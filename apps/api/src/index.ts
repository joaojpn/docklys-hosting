import Fastify from 'fastify'
import { authRoutes } from './modules/auth/auth.controller'
import 'dotenv/config'

const app = Fastify({ logger: true })

app.register(authRoutes)

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
