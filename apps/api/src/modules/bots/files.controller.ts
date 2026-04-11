import { FastifyInstance } from 'fastify'
import { prisma } from '../../plugins/prisma'
import Dockerode from 'dockerode'

const docker = new Dockerode()

async function execCommand(containerId: string, cmd: string[]): Promise<string> {
  const container = docker.getContainer(containerId)
  const exec = await container.exec({
    Cmd: cmd,
    AttachStdout: true,
    AttachStderr: true,
  })
  const stream = await exec.start({ hijack: true, stdin: false })
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    stream.on('data', (chunk: Buffer) => {
      if (chunk.length > 8) chunks.push(chunk.slice(8))
    })
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    stream.on('error', reject)
  })
}

export async function filesRoutes(app: FastifyInstance) {

  app.get('/bots/:id/files', async (request, reply) => {
    const { id } = request.params as any
    const { filePath = '/app' } = request.query as any
    const userId = (request as any).userId

    const bot = await prisma.bot.findFirst({ where: { id, userId } })
    if (!bot) return reply.status(404).send({ error: 'Application not found.' })
    if (!bot.containerId) return reply.status(400).send({ error: 'Container is not running.' })

    try {
      const output = await execCommand(bot.containerId, [
        'sh', '-c',
        `find "${filePath}" -maxdepth 1 ! -path "${filePath}" -printf '%y\t%f\t%p\n' 2>/dev/null | sort -t'\t' -k1,1r -k2,2`
      ])

      const entries = output.trim().split('\n').filter(line => {
        const parts = line.split('\t')
        return parts.length === 3 && parts[1].trim() !== ''
      }).map(line => {
        const [type, name, fullPath] = line.split('\t')
        return {
          name: name.trim(),
          path: fullPath.trim(),
          type: type.trim() === 'd' ? 'directory' : 'file',
        }
      })

      return reply.send({ entries, currentPath: filePath })
    } catch (err: any) {
      return reply.status(500).send({ error: 'Failed to list files.' })
    }
  })

  app.get('/bots/:id/files/content', async (request, reply) => {
    const { id } = request.params as any
    const { filePath } = request.query as any
    const userId = (request as any).userId

    if (!filePath || filePath.trim() === '') {
      return reply.status(400).send({ error: 'filePath is required.' })
    }

    const bot = await prisma.bot.findFirst({ where: { id, userId } })
    if (!bot) return reply.status(404).send({ error: 'Application not found.' })
    if (!bot.containerId) return reply.status(400).send({ error: 'Container is not running.' })

    try {
      const content = await execCommand(bot.containerId, ['cat', filePath.trim()])
      return reply.send({ content, filePath })
    } catch {
      return reply.status(500).send({ error: 'Failed to read file.' })
    }
  })

  app.put('/bots/:id/files/content', async (request, reply) => {
    const { id } = request.params as any
    const { filePath, content } = request.body as any
    const userId = (request as any).userId

    if (!filePath || content === undefined) {
      return reply.status(400).send({ error: 'filePath and content are required.' })
    }

    const bot = await prisma.bot.findFirst({ where: { id, userId } })
    if (!bot) return reply.status(404).send({ error: 'Application not found.' })
    if (!bot.containerId) return reply.status(400).send({ error: 'Container is not running.' })

    try {
      const container = docker.getContainer(bot.containerId)
      const exec = await container.exec({
        Cmd: ['sh', '-c', `cat > "${filePath.trim()}"`],
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
      })

      const stream = await exec.start({ hijack: true, stdin: true })
      stream.write(content)
      stream.end()

      await new Promise(resolve => stream.on('end', resolve))

      return reply.send({ success: true })
    } catch {
      return reply.status(500).send({ error: 'Failed to save file.' })
    }
  })
}
