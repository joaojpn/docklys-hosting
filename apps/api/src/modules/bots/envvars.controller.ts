import { FastifyInstance } from 'fastify'
import { prisma } from '../../plugins/prisma'

export async function envVarsRoutes(app: FastifyInstance) {
  app.get('/bots/:id/env', async (request, reply) => {
    const { id } = request.params as any
    const userId = (request as any).userId

    const bot = await prisma.bot.findFirst({ where: { id, userId } })
    if (!bot) return reply.status(404).send({ error: 'Application not found.' })

    const envVars = await prisma.envVar.findMany({
      where: { botId: id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, key: true, value: true },
    })

    return reply.send({ envVars })
  })

  app.put('/bots/:id/env', async (request, reply) => {
    const { id } = request.params as any
    const userId = (request as any).userId
    const { vars } = request.body as any

    if (!Array.isArray(vars)) {
      return reply.status(400).send({ error: 'vars must be an array.' })
    }

    const bot = await prisma.bot.findFirst({ where: { id, userId } })
    if (!bot) return reply.status(404).send({ error: 'Application not found.' })

    await prisma.envVar.deleteMany({ where: { botId: id } })

    if (vars.length > 0) {
      await prisma.envVar.createMany({
        data: vars
          .filter((v: any) => v.key?.trim() && v.value !== undefined)
          .map((v: any) => ({
            key: v.key.trim(),
            value: v.value,
            botId: id,
          })),
      })
    }

    if (bot.containerId) {
      try {
        const Dockerode = (await import('dockerode')).default
        const docker = new Dockerode()
        const container = docker.getContainer(bot.containerId)
        await container.restart()
        await prisma.bot.update({ where: { id }, data: { status: 'RUNNING' } })
      } catch {}
    }

    const updated = await prisma.envVar.findMany({
      where: { botId: id },
      orderBy: { createdAt: 'asc' },
      select: { id: true, key: true, value: true },
    })

    return reply.send({ envVars: updated })
  })
}
