import Fastify from 'fastify'
import cors from '@fastify/cors'
import multipart from '@fastify/multipart'
import { authRoutes } from './modules/auth/auth.controller'
import { botsRoutes } from './modules/bots/bots.controller'
import { logsRoutes } from './modules/bots/logs.controller'
import { statsRoutes } from './modules/bots/stats.controller'
import { envVarsRoutes } from './modules/bots/envvars.controller'
import { filesRoutes } from './modules/bots/files.controller'
import { profileRoutes } from './modules/profile/profile.controller'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const app = Fastify({ logger: true })

app.register(cors, {
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://172.28.115.4:5173'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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
app.register(logsRoutes)

app.register(async (instance) => {
  instance.addHook('preHandler', authenticate)
  instance.register(botsRoutes)
  instance.register(statsRoutes)
  instance.register(envVarsRoutes)
  instance.register(filesRoutes)
  instance.register(profileRoutes)
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
