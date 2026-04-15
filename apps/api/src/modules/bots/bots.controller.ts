import { FastifyInstance } from 'fastify'
import { prisma } from '../../plugins/prisma'
import { detectLanguage } from '../deploy/language-detector'
import { audit, getIp } from '../../utils/audit'
import { buildAndRun, extractZip, removeContainer, getContainerStats } from '../deploy/docker.service'
import path from 'path'
import fs from 'fs'
import { pipeline } from 'stream/promises'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')
const EXTRACTED_DIR = path.join(process.cwd(), 'extracted')

function ensureDirs() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  if (!fs.existsSync(EXTRACTED_DIR)) fs.mkdirSync(EXTRACTED_DIR, { recursive: true })
}

function detectLanguageFromCommand(startCommand: string): 'python' | 'node' | undefined {
  if (startCommand.includes('python')) return 'python'
  if (startCommand.includes('node')) return 'node'
  return undefined
}

function getFieldValue(field: any): string | undefined {
  if (!field) return undefined
  if (typeof field === 'string') return field
  if (field.value !== undefined) return field.value
  if (Array.isArray(field)) return field[0]?.value ?? field[0]
  return undefined
}

export async function botsRoutes(app: FastifyInstance) {
  app.get('/bots', async (request, reply) => {
    const userId = (request as any).userId

    try {
      const bots = await prisma.bot.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })

      const botsWithStatus = await Promise.all(
        bots.map(async (bot) => {
          let status = bot.status
          if (bot.containerId) {
            try {
              const stats = await getContainerStats(bot.containerId)
              status = stats.status as any
            } catch {}
          }

          return {
            id: bot.id,
            name: bot.name,
            description: bot.description,
            memory: bot.memory,
            status,
            startCommand: bot.startCommand,
            language: detectLanguageFromCommand(bot.startCommand),
            createdAt: bot.createdAt,
          }
        })
      )

      return reply.send({ bots: botsWithStatus })
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch applications.' })
    }
  })

  app.post('/bots/deploy', async (request, reply) => {
    ensureDirs()
    const userId = (request as any).userId

    const parts = request.parts()
    let fileData: any = null
    const fields: Record<string, string> = {}

    for await (const part of parts) {
      if (part.type === 'file') {
        fileData = part
        const botId = crypto.randomUUID()
        const zipPath = path.join(UPLOADS_DIR, `${botId}.zip`)
        await pipeline(part.file, fs.createWriteStream(zipPath))
        fileData.savedPath = zipPath
        fileData.botId = botId
      } else {
        fields[part.fieldname] = (part as any).value
      }
    }

    if (!fileData) return reply.status(400).send({ error: 'No file uploaded.' })
    if (!fields.name?.trim()) return reply.status(400).send({ error: 'Application name is required.' })
    if (!fileData.filename.endsWith('.zip')) return reply.status(400).send({ error: 'Only .zip files are accepted.' })

    const botId = fileData.botId
    const zipPath = fileData.savedPath
    const extractPath = path.join(EXTRACTED_DIR, botId)

    try {
      const { language, startCommand } = detectLanguage(zipPath)

      await extractZip(zipPath, extractPath)

      const containerId = await buildAndRun({
        botId,
        language,
        startCommand,
        memory: parseInt(fields.memory || '256'),
        autoRestart: fields.autoRestart !== 'false',
        extractedPath: extractPath,
      })

      const bot = await prisma.bot.create({
        data: {
          id: botId,
          name: fields.name.trim(),
          description: fields.description?.trim() || null,
          memory: parseInt(fields.memory || '256'),
          startCommand,
          status: 'RUNNING',
          containerId,
          zipPath,
          userId,
        },
      })

      return reply.status(201).send({
        bot: {
          id: bot.id,
          name: bot.name,
          memory: bot.memory,
          language,
          startCommand: bot.startCommand,
        },
      })
    } catch (err: any) {
      fs.rmSync(zipPath, { force: true })
      fs.rmSync(extractPath, { recursive: true, force: true })
      return reply.status(400).send({ error: err.message || 'Deploy failed.' })
    }
  })

  app.post('/bots/:id/stop', async (request, reply) => {
    const { id } = request.params as any
    const userId = (request as any).userId

    try {
      const bot = await prisma.bot.findFirst({ where: { id, userId } })
      if (!bot) return reply.status(404).send({ error: 'Application not found.' })
      if (!bot.containerId) return reply.status(400).send({ error: 'No container found.' })

      const Dockerode = (await import('dockerode')).default
      const docker = new Dockerode()
      await docker.getContainer(bot.containerId).stop()
      await audit({ userId, action: 'STOP_BOT', ipAddress: getIp(request), metadata: { botId: id, botName: bot.name } })

      await prisma.bot.update({ where: { id }, data: { status: 'STOPPED' } })

      return reply.send({ success: true })
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to stop application.' })
    }
  })

  app.post('/bots/:id/restart', async (request, reply) => {
    const { id } = request.params as any
    const userId = (request as any).userId

    try {
      const bot = await prisma.bot.findFirst({ where: { id, userId } })
      if (!bot) return reply.status(404).send({ error: 'Application not found.' })
      if (!bot.containerId) return reply.status(400).send({ error: 'No container found.' })

      const Dockerode = (await import('dockerode')).default
      const docker = new Dockerode()
      await docker.getContainer(bot.containerId).restart()
      await audit({ userId, action: 'RESTART_BOT', ipAddress: getIp(request), metadata: { botId: id, botName: bot.name } })

      await prisma.bot.update({ where: { id }, data: { status: 'RUNNING' } })

      return reply.send({ success: true })
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to restart application.' })
    }
  })

  app.delete('/bots/:id', async (request, reply) => {
    const { id } = request.params as any
    const userId = (request as any).userId

    try {
      const bot = await prisma.bot.findFirst({ where: { id, userId } })
      if (!bot) return reply.status(404).send({ error: 'Application not found.' })

      if (bot.containerId) await removeContainer(bot.containerId)

      if (bot.zipPath) fs.rmSync(bot.zipPath, { force: true })
      const extractPath = path.join(EXTRACTED_DIR, bot.id)
      fs.rmSync(extractPath, { recursive: true, force: true })

      await prisma.bot.delete({ where: { id } })
      await audit({ userId, action: 'DELETE_BOT', ipAddress: getIp(request), metadata: { botId: id, botName: bot.name } })

      return reply.send({ success: true })
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to delete application.' })
    }
  })
}
