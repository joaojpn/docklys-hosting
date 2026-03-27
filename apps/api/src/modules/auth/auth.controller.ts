import { FastifyInstance } from 'fastify'
import { registerUser, validateUser } from './auth.service'
import { registerSchema, loginSchema } from './auth.schema'
import { getGithubAuthUrl, handleGithubCallback } from './github.service'
import jwt from 'jsonwebtoken'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', { schema: registerSchema }, async (request, reply) => {
    const { name, email, password } = request.body as any

    try {
      const user = await registerUser(name, email, password)
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
      return reply.status(201).send({ token, user })
    } catch (err: any) {
      return reply.status(400).send({ error: err.message })
    }
  })

  app.post('/auth/login', { schema: loginSchema }, async (request, reply) => {
    const { email, password } = request.body as any

    try {
      const user = await validateUser(email, password)
      const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' })
      return reply.status(200).send({ token, user })
    } catch (err: any) {
      return reply.status(401).send({ error: err.message })
    }
  })

  app.get('/auth/github', async (request, reply) => {
    const url = getGithubAuthUrl()
    return reply.redirect(url)
  })

  app.get('/auth/github/callback', async (request, reply) => {
    const { code } = request.query as any

    try {
      const { token, user } = await handleGithubCallback(code)
      const frontendUrl = process.env.FRONTEND_URL!
      return reply.redirect(`${frontendUrl}/auth/callback?token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&id=${user.id}`)
    } catch (err: any) {
      return reply.redirect(`${process.env.FRONTEND_URL}/login?error=github_failed`)
    }
  })
}
