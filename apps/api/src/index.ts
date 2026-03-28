import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { authRoutes } from './modules/auth/auth.controller'
import { botsRoutes } from './modules/bots/bots.controller'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const app = Fastify({ logger: true })

app.register(cors, {
  origin: 'http://localhost:5173',
  credentials: true,
})

app.register(multipart, {
  limits: { fileSize: 50 * 1024 * 1024 },
})

async function authenticate(request: any, reply: any) {
  const authHeader = request.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Unauthorized.' })
  }
  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
    request.userId = payload.sub
  } catch {
    return reply.status(401).send({ error: 'Invalid or expired token.' })
  }
}

app.register(authRoutes)

app.register(async (instance) => {
  instance.addHook('preHandler', authenticate)
  instance.register(botsRoutes)
})

app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() }
})

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' })
    console.log('API running on http://localhost:3333')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
