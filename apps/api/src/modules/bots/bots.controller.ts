import { FastifyInstance } from 'fastify'
import { prisma } from '../../plugins/prisma'
import { detectLanguage } from '../deploy/language-detector'
import { buildAndRun, extractZip, removeContainer } from '../deploy/docker.service'
import path from 'path'
import fs from 'fs'
import { pipeline } from 'stream/promises'

const UPLOADS_DIR = path.join(process.cwd(), 'uploads')
const EXTRACTED_DIR = path.join(process.cwd(), 'extracted')

function ensureDirs() {
  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })
  if (!fs.existsSync(EXTRACTED_DIR)) fs.mkdirSync(EXTRACTED_DIR, { recursive: true })
}

export async function botsRoutes(app: FastifyInstance) {
  app.get('/bots', async (request, reply) => {
    const userId = (request as any).userId

    try {
      const bots = await prisma.bot.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      })

      return reply.send({
        bots: bots.map(bot => ({
          id: bot.id,
          name: bot.name,
          description: bot.description,
          memory: bot.memory,
          status: bot.status,
          startCommand: bot.startCommand,
          createdAt: bot.createdAt,
        })),
      })
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to fetch applications.' })
    }
  })

  app.post('/bots/deploy', async (request, reply) => {
    ensureDirs()

    const userId = (request as any).userId

    const data = await request.file()
    if (!data) return reply.status(400).send({ error: 'No file uploaded.' })

    const name = data.fields.name as any
    const description = data.fields.description as any
    const memory = data.fields.memory as any
    const autoRestart = data.fields.autoRestart as any

    if (!name?.value) return reply.status(400).send({ error: 'Application name is required.' })
    if (!data.filename.endsWith('.zip')) return reply.status(400).send({ error: 'Only .zip files are accepted.' })

    const botId = crypto.randomUUID()
    const zipPath = path.join(UPLOADS_DIR, `${botId}.zip`)
    const extractPath = path.join(EXTRACTED_DIR, botId)

    try {
      await pipeline(data.file, fs.createWriteStream(zipPath))

      const { language, startCommand } = detectLanguage(zipPath)

      await extractZip(zipPath, extractPath)

      const containerId = await buildAndRun({
        botId,
        language,
        startCommand,
        memory: parseInt(memory?.value || '256'),
        autoRestart: autoRestart?.value !== 'false',
        extractedPath: extractPath,
      })

      const bot = await prisma.bot.create({
        data: {
          id: botId,
          name: name.value,
          description: description?.value || null,
          memory: parseInt(memory?.value || '256'),
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

  app.delete('/bots/:id', async (request, reply) => {
    const { id } = request.params as any
    const userId = (request as any).userId

    try {
      const bot = await prisma.bot.findFirst({ where: { id, userId } })
      if (!bot) return reply.status(404).send({ error: 'Application not found.' })

      if (bot.containerId) await removeContainer(bot.containerId)

      await prisma.bot.delete({ where: { id } })

      return reply.send({ success: true })
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to delete application.' })
    }
  })
}
