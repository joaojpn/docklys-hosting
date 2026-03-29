import { FastifyInstance } from 'fastify'
import { prisma } from '../../plugins/prisma'
import Dockerode from 'dockerode'

const docker = new Dockerode()

function formatUptime(startedAt: string): string {
  const start = new Date(startedAt)
  const now = new Date()
  const diff = Math.floor((now.getTime() - start.getTime()) / 1000)

  if (diff < 60) return `${diff}s`
  if (diff < 3600) return `${Math.floor(diff / 60)}m`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`
  return `${Math.floor(diff / 86400)}d ${Math.floor((diff % 86400) / 3600)}h`
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export async function statsRoutes(app: FastifyInstance) {
  app.get('/bots/:id/stats', async (request, reply) => {
    const { id } = request.params as any
    const userId = (request as any).userId

    const bot = await prisma.bot.findFirst({ where: { id, userId } })
    if (!bot) return reply.status(404).send({ error: 'Application not found.' })
    if (!bot.containerId) return reply.status(400).send({ error: 'No container found.' })

    try {
      const container = docker.getContainer(bot.containerId)
      const info = await container.inspect()

      if (!info.State.Running) {
        return reply.send({
          status: 'STOPPED',
          uptime: '—',
          cpu: '0%',
          ram: '0 MB',
        })
      }

      const stats = await container.stats({ stream: false }) as any

      const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage
      const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage
      const numCpus = stats.cpu_stats.online_cpus || 1
      const cpuPercent = ((cpuDelta / systemDelta) * numCpus * 100).toFixed(1)

      const memUsage = stats.memory_stats.usage - (stats.memory_stats.stats?.cache || 0)

      return reply.send({
        status: 'RUNNING',
        uptime: formatUptime(info.State.StartedAt),
        cpu: `${cpuPercent}%`,
        ram: formatBytes(memUsage),
      })
    } catch (err: any) {
      return reply.send({
        status: 'ERROR',
        uptime: '—',
        cpu: '—',
        ram: '—',
      })
    }
  })
}
