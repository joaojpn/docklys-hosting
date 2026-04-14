import { FastifyInstance } from 'fastify'
import { prisma } from '../../plugins/prisma'
import { generateTwoFactorSetup, verifyTOTP, verifyRecoveryCode } from '../../utils/twoFactor'

const APP_NAME = process.env.APP_NAME || 'Nuvee'
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_MINUTES = 15

export async function twoFactorRoutes(app: FastifyInstance) {

  // POST /2fa/generate — gera QR code e recovery codes
  app.post('/2fa/generate', async (request, reply) => {
    const userId = (request as any).userId
    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) return reply.status(404).send({ error: 'User not found.' })
    if (user.twoFactorEnabled) return reply.status(400).send({ error: '2FA is already enabled.' })

    const setup = await generateTwoFactorSetup(user.email, APP_NAME)

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorTempSecret: setup.encryptedSecret,
        recoveryCodes: setup.hashedRecoveryCodes,
      },
    })

    return reply.send({
      qrCodeDataUrl: setup.qrCodeDataUrl,
      recoveryCodes: setup.recoveryCodes,
      message: 'Save your recovery codes in a safe place. They will not be shown again.',
    })
  })

  // POST /2fa/confirm — confirma setup com primeiro token
  app.post('/2fa/confirm', async (request, reply) => {
    const userId = (request as any).userId
    const { token } = request.body as any

    if (!token) return reply.status(400).send({ error: 'Token is required.' })

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user?.twoFactorTempSecret) {
      return reply.status(400).send({ error: 'No 2FA setup in progress. Call /2fa/generate first.' })
    }

    const { valid, timestamp } = await verifyTOTP(token, user.twoFactorTempSecret, user.lastUsedOtpAt)
    if (!valid) return reply.status(400).send({ error: 'Invalid token. Please try again.' })

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: user.twoFactorTempSecret,
        twoFactorTempSecret: null,
        twoFactorEnabled: true,
        failedOtpAttempts: 0,
        lastUsedOtpAt: timestamp,
      },
    })

    return reply.send({ message: '2FA has been enabled successfully.' })
  })

  // POST /2fa/validate — valida OTP durante login
  app.post('/2fa/validate', async (request, reply) => {
    const userId = (request as any).userId
    const { token } = request.body as any

    if (!token) return reply.status(400).send({ error: 'Token is required.' })

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
      return reply.status(400).send({ error: '2FA is not enabled.' })
    }

    if (user.otpLockedUntil && user.otpLockedUntil > new Date()) {
      const waitMinutes = Math.ceil((user.otpLockedUntil.getTime() - Date.now()) / 60_000)
      return reply.status(429).send({
        error: `Account temporarily locked. Try again in ${waitMinutes} minute(s).`,
      })
    }

    const isValid = await verifyTOTP(token, user.twoFactorSecret)

    if (!isValid) {
      const failed = user.failedOtpAttempts + 1
      const lockUntil = failed >= MAX_FAILED_ATTEMPTS
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60_000)
        : null

      await prisma.user.update({
        where: { id: userId },
        data: {
          failedOtpAttempts: failed,
          ...(lockUntil ? { otpLockedUntil: lockUntil } : {}),
        },
      })

      if (lockUntil) {
        return reply.status(429).send({
          error: `Too many failed attempts. Account locked for ${LOCKOUT_MINUTES} minutes.`,
        })
      }

      return reply.status(400).send({
        error: 'Invalid token.',
        attemptsRemaining: MAX_FAILED_ATTEMPTS - failed,
      })
    }

    await prisma.user.update({
      where: { id: userId },
      data: { failedOtpAttempts: 0, otpLockedUntil: null },
    })

    return reply.send({ message: '2FA verified successfully.' })
  })

  // POST /2fa/recover — login com recovery code
  app.post('/2fa/recover', async (request, reply) => {
    const userId = (request as any).userId
    const { recoveryCode } = request.body as any

    if (!recoveryCode) return reply.status(400).send({ error: 'Recovery code is required.' })

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user?.twoFactorEnabled) {
      return reply.status(400).send({ error: '2FA is not enabled.' })
    }

    const usedIndex = await verifyRecoveryCode(recoveryCode, user.recoveryCodes)

    if (usedIndex === -1) {
      return reply.status(400).send({ error: 'Invalid recovery code.' })
    }

    const updatedCodes = user.recoveryCodes.filter((_, i) => i !== usedIndex)

    await prisma.user.update({
      where: { id: userId },
      data: { recoveryCodes: updatedCodes },
    })

    const remaining = updatedCodes.length

    return reply.send({
      message: `Recovery code accepted. ${remaining} code(s) remaining.`,
      ...(remaining <= 2 ? { warning: 'You have very few recovery codes left. Consider regenerating them.' } : {}),
    })
  })

  // POST /2fa/disable — desabilita 2FA
  app.post('/2fa/disable', async (request, reply) => {
    const userId = (request as any).userId
    const { token } = request.body as any

    if (!token) return reply.status(400).send({ error: 'Token is required.' })

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
      return reply.status(400).send({ error: '2FA is not enabled.' })
    }

    const { valid } = await verifyTOTP(token, user.twoFactorSecret, user.lastUsedOtpAt)
    if (!valid) return reply.status(400).send({ error: 'Invalid or already used token.' })

    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        twoFactorTempSecret: null,
        recoveryCodes: [],
        failedOtpAttempts: 0,
        otpLockedUntil: null,
      },
    })

    return reply.send({ message: '2FA has been disabled.' })
  })
}
