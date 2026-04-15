import { FastifyInstance } from 'fastify'
import { registerUser, validateUser } from './auth.service'
import { registerSchema, loginSchema } from './auth.schema'
import { getGithubAuthUrl, handleGithubCallback } from './github.service'
import jwt from 'jsonwebtoken'
import { audit, getIp } from '../../utils/audit'
import { prisma } from '../../plugins/prisma'
import crypto from 'crypto'

const TRUSTED_DEVICE_DAYS = 30

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', { schema: registerSchema }, async (request, reply) => {
    const { name, email, password } = request.body as any
    try {
      const user = await registerUser(name, email, password)
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
      await audit({ userId: user.id, userEmail: email, action: 'REGISTER', ipAddress: getIp(request) })
      return reply.status(201).send({ token, user })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message })
    }
  })

  app.post('/auth/login', { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body as any
    try {
      const user = await validateUser(email, password)

      // Check if 2FA is enabled
      if (user.twoFactorEnabled) {
        // Check trusted device cookie
        const deviceToken = request.cookies?.['trusted_device']
        if (deviceToken) {
          const trusted = await prisma.trustedDevice.findUnique({
            where: { token: deviceToken },
          })
          if (trusted && trusted.userId === user.id && trusted.expiresAt > new Date()) {
            // Trusted device — skip 2FA
            const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
            await audit({ userId: user.id, userEmail: email, action: 'LOGIN', ipAddress: getIp(request), metadata: { trustedDevice: true } })
            return reply.send({ token, user, requires2FA: false })
          }
        }

        // Requires 2FA — return temp token
        const tempToken = jwt.sign({ sub: user.id, pending2FA: true }, process.env.JWT_SECRET!, { expiresIn: '5m' })
        return reply.send({ tempToken, requires2FA: true, userId: user.id })
      }

      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
      await audit({ userId: user.id, userEmail: email, action: 'LOGIN', ipAddress: getIp(request) })
      return reply.status(200).send({ token, user, requires2FA: false })
    } catch (err: any) {
      await audit({ userEmail: email, action: 'LOGIN', ipAddress: getIp(request), metadata: { failed: true } })
      return reply.status(401).send({ error: err.message })
    }
  })

  // 2FA verification during login
  app.post('/auth/2fa/verify', async (request, reply) => {
    const { tempToken, token: otpToken, rememberDevice } = request.body as any

    if (!tempToken || !otpToken) {
      return reply.status(400).send({ error: 'tempToken and token are required.' })
    }

    let payload: any
    try {
      payload = jwt.verify(tempToken, process.env.JWT_SECRET!) as any
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired session. Please login again.' })
    }

    if (!payload.pending2FA) {
      return reply.status(400).send({ error: 'Invalid token type.' })
    }

    const user = await prisma.user.findUnique({ where: { id: payload.sub } })
    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
      return reply.status(400).send({ error: '2FA is not enabled.' })
    }

    // Check lockout
    if (user.otpLockedUntil && user.otpLockedUntil > new Date()) {
      const waitMinutes = Math.ceil((user.otpLockedUntil.getTime() - Date.now()) / 60_000)
      return reply.status(429).send({ error: `Account locked. Try again in ${waitMinutes} minute(s).` })
    }

    const { verifyTOTP } = await import('../../utils/twoFactor')
    const { valid, timestamp } = await verifyTOTP(otpToken, user.twoFactorSecret, user.lastUsedOtpAt)

    if (!valid) {
      const failed = user.failedOtpAttempts + 1
      const lockUntil = failed >= 5 ? new Date(Date.now() + 15 * 60_000) : null
      await prisma.user.update({
        where: { id: user.id },
        data: { failedOtpAttempts: failed, ...(lockUntil ? { otpLockedUntil: lockUntil } : {}) },
      })
      await audit({ userId: user.id, action: '2FA_AUTH_FAIL', ipAddress: getIp(request) })
      return reply.status(400).send({ error: 'Invalid or already used token.', attemptsRemaining: 5 - failed })
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { failedOtpAttempts: 0, otpLockedUntil: null, lastUsedOtpAt: timestamp },
    })

    await audit({ userId: user.id, action: '2FA_AUTH_SUCCESS', ipAddress: getIp(request) })

    // Remember device
    if (rememberDevice) {
      const deviceToken = crypto.randomBytes(32).toString('hex')
      const expiresAt = new Date(Date.now() + TRUSTED_DEVICE_DAYS * 24 * 60 * 60_000)
      await prisma.trustedDevice.create({
        data: {
          userId: user.id,
          token: deviceToken,
          userAgent: request.headers['user-agent'],
          ipAddress: getIp(request),
          expiresAt,
        },
      })
      reply.setCookie('trusted_device', deviceToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: TRUSTED_DEVICE_DAYS * 24 * 60 * 60,
        path: '/',
      })
    }

    const finalToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    const userData = { id: user.id, name: user.name, email: user.email }

    return reply.send({ token: finalToken, user: userData })
  })

  app.get('/auth/github', async (request, reply) => {
    const url = getGithubAuthUrl()
    return reply.redirect(url)
  })

  app.get('/auth/github/callback', async (request, reply) => {
    const { code } = request.query as any
    try {
      const { token, user } = await handleGithubCallback(code)
      await audit({ userId: user.id, userEmail: user.email, action: 'LOGIN', ipAddress: getIp(request), metadata: { provider: 'github' } })
      const frontendUrl = process.env.FRONTEND_URL!
      return reply.redirect(`${frontendUrl}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&id=${user.id}`)
    } catch (err: any) {
      return reply.redirect(`${process.env.FRONTEND_URL}/login?error=github_failed`)
    }
  })
}
