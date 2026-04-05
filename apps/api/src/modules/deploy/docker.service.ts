import Dockerode from 'dockerode'
import AdmZip from 'adm-zip'
import path from 'path'
import fs from 'fs'
import { Language } from './language-detector'

const docker = new Dockerode()

const BASE_IMAGES: Record<Language, string> = {
  python: 'python:3.11-slim',
  node: 'node:20-slim',
}

const INSTALL_COMMANDS: Record<Language, string> = {
  python: 'pip install -r requirements.txt --quiet 2>/dev/null || true',
  node: 'npm install --quiet 2>/dev/null || true',
}

export async function extractZip(zipPath: string, destDir: string): Promise<void> {
  const zip = new AdmZip(zipPath)
  const entries = zip.getEntries()

  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true })

  const rootDirs = new Set<string>()
  for (const entry of entries) {
    const parts = entry.entryName.split('/')
    if (parts[0]) rootDirs.add(parts[0])
  }

  const hasSubfolder = rootDirs.size === 1 && entries.some(e => e.entryName.includes('/'))
  const prefix = hasSubfolder ? [...rootDirs][0] + '/' : ''

  for (const entry of entries) {
    if (entry.isDirectory) continue
    const relativePath = prefix ? entry.entryName.replace(prefix, '') : entry.entryName
    if (!relativePath) continue
    const outPath = path.join(destDir, relativePath)
    fs.mkdirSync(path.dirname(outPath), { recursive: true })
    fs.writeFileSync(outPath, entry.getData())
  }
}

export async function buildAndRun(opts: {
  botId: string
  language: Language
  startCommand: string
  memory: number
  autoRestart: boolean
  extractedPath: string
  envVars?: Record<string, string>
}): Promise<string> {
  const { botId, language, startCommand, memory, autoRestart, extractedPath, envVars = {} } = opts

  const image = BASE_IMAGES[language]
  const installCmd = INSTALL_COMMANDS[language]

  const baseCmd = startCommand.startsWith('python ')
    ? startCommand.replace('python ', 'python -u ')
    : startCommand

  await pullImageIfNeeded(image)

  const envArray = Object.entries(envVars).map(([k, v]) => `${k}=${v}`)

  const container = await docker.createContainer({
    name: `docklys-${botId}`,
    Image: image,
    Cmd: ['sh', '-c', `${installCmd} && ${baseCmd}`],
    WorkingDir: '/app',
    Env: envArray,
    HostConfig: {
      Binds: [`${extractedPath}:/app`],
      Memory: memory * 1024 * 1024,
      RestartPolicy: autoRestart
        ? { Name: 'on-failure', MaximumRetryCount: 5 }
        : { Name: 'no' },
    },
  })

  await container.start()
  return container.id
}

async function pullImageIfNeeded(image: string): Promise<void> {
  const images = await docker.listImages()
  const exists = images.some(img =>
    img.RepoTags && img.RepoTags.some(tag => tag === image || tag === `${image}:latest`)
  )

  if (!exists) {
    await new Promise<void>((resolve, reject) => {
      docker.pull(image, (err: Error, stream: NodeJS.ReadableStream) => {
        if (err) return reject(err)
        docker.modem.followProgress(stream, (err) => {
          if (err) return reject(err)
          resolve()
        })
      })
    })
  }
}

export async function stopContainer(containerId: string): Promise<void> {
  const container = docker.getContainer(containerId)
  await container.stop()
}

export async function removeContainer(containerId: string): Promise<void> {
  const container = docker.getContainer(containerId)
  try { await container.stop() } catch {}
  await container.remove()
}

export async function getContainerStats(containerId: string) {
  const container = docker.getContainer(containerId)
  const info = await container.inspect()
  return {
    status: info.State.Running ? 'RUNNING' : 'STOPPED',
    uptime: info.State.StartedAt,
  }
}

export async function restartWithEnv(containerId: string, envVars: Record<string, string>): Promise<void> {
  const container = docker.getContainer(containerId)
  const info = await container.inspect()

  const envArray = Object.entries(envVars).map(([k, v]) => `${k}=${v}`)

  await container.stop()
  await container.remove()

  const newContainer = await docker.createContainer({
    name: info.Name.replace('/', ''),
    Image: info.Config.Image,
    Cmd: info.Config.Cmd || [],
    WorkingDir: info.Config.WorkingDir,
    Env: envArray,
    HostConfig: info.HostConfig,
  })

  await newContainer.start()
}
