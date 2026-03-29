import { FastifyInstance } from 'fastify'
import { prisma } from '../../plugins/prisma'
import Dockerode from 'dockerode'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

const docker = new Dockerode()

export async function logsRoutes(app: FastifyInstance) {
  app.get('/bots/:id/logs', async (request, reply) => {
    const { id } = request.params as any
    const { token } = request.query as any

    if (!token) return reply.status(401).send({ error: 'Unauthorized.' })

    let userId: string
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: string }
      userId = payload.sub
    } catch {
      return reply.status(401).send({ error: 'Invalid or expired token.' })
    }

    const bot = await prisma.bot.findFirst({ where: { id, userId } })
    if (!bot) return reply.status(404).send({ error: 'Application not found.' })
    if (!bot.containerId) return reply.status(400).send({ error: 'No container found.' })

    reply.raw.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': request.headers.origin || '*',
      'Access-Control-Allow-Credentials': 'true',
    })

    const send = (data: string) => {
      reply.raw.write(`data: ${JSON.stringify({ line: data })}\n\n`)
    }

    try {
      const container = docker.getContainer(bot.containerId)

      const logStream = await container.logs({
        follow: true,
        stdout: true,
        stderr: true,
        tail: 100,
      })

      logStream.on('data', (chunk: Buffer) => {
        const lines = chunk.toString('utf8').split('\n')
        for (const line of lines) {
          const cleaned = line.replace(/[\x00-\x08\x0b-\x1f\x7f]/g, '').trim()
          if (cleaned) send(cleaned)
        }
      })

      logStream.on('end', () => {
        send('— stream ended —')
        reply.raw.end()
      })

      request.raw.on('close', () => {
        logStream.destroy()
      })
    } catch (err: any) {
      send(`Error: ${err.message}`)
      reply.raw.end()
    }
  })
}
