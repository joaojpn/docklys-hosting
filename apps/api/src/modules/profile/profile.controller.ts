import { FastifyInstance } from 'fastify'
import { prisma } from '../../plugins/prisma'
import bcrypt from 'bcrypt'

export async function profileRoutes(app: FastifyInstance) {
  app.get('/profile', async (request, reply) => {
    const userId = (request as any).userId

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        githubId: true,
        githubLogin: true,
        createdAt: true,
        passwordHash: true,
      },
    })

    if (!user) return reply.status(404).send({ error: 'User not found.' })

    return reply.send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        githubLogin: user.githubLogin,
        hasPassword: !!user.passwordHash,
        hasGithub: !!user.githubId,
        createdAt: user.createdAt,
      }
    })
  })

  app.patch('/profile', async (request, reply) => {
    const userId = (request as any).userId
    const { name } = request.body as any

    if (!name?.trim()) return reply.status(400).send({ error: 'Name is required.' })

    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: name.trim() },
      select: { id: true, name: true, email: true },
    })

    return reply.send({ user })
  })

  app.patch('/profile/password', async (request, reply) => {
    const userId = (request as any).userId
    const { currentPassword, newPassword } = request.body as any

    if (!currentPassword || !newPassword) {
      return reply.status(400).send({ error: 'Both current and new password are required.' })
    }

    if (newPassword.length < 6) {
      return reply.status(400).send({ error: 'New password must be at least 6 characters.' })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user?.passwordHash) {
      return reply.status(400).send({ error: 'This account does not have a password.' })
    }

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return reply.status(400).send({ error: 'Current password is incorrect.' })

    const passwordHash = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: userId }, data: { passwordHash } })

    return reply.send({ success: true })
  })

  app.delete('/profile', async (request, reply) => {
    const userId = (request as any).userId

    const bots = await prisma.bot.findMany({ where: { userId } })

    for (const bot of bots) {
      if (bot.containerId) {
        try {
          const Dockerode = (await import('dockerode')).default
          const docker = new Dockerode()
          const container = docker.getContainer(bot.containerId)
          try { await container.stop() } catch {}
          await container.remove()
        } catch {}
      }
    }

    await prisma.bot.deleteMany({ where: { userId } })
    await prisma.user.delete({ where: { id: userId } })

    return reply.send({ success: true })
  })
}
