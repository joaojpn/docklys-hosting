import { FastifyInstance } from 'fastify'
import { registerUser, validateUser } from './auth.service'
import { registerSchema, loginSchema } from './auth.schema'
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
}
