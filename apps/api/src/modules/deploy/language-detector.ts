import AdmZip from 'adm-zip'

export type Language = 'python' | 'node'

export interface DetectionResult {
  language: Language
  startCommand: string
}

export function detectLanguage(zipPath: string): DetectionResult {
  const zip = new AdmZip(zipPath)
  const entries = zip.getEntries().map(e => e.entryName)

  const hasPython = entries.some(e => e.endsWith('requirements.txt'))
  const hasNode = entries.some(e => e.endsWith('package.json'))

  if (hasPython) {
    const hasMainPy = entries.some(e => e.endsWith('main.py'))
    return {
      language: 'python',
      startCommand: hasMainPy ? 'python main.py' : 'python index.py',
    }
  }

  if (hasNode) {
    const hasIndexJs = entries.some(e => e.endsWith('index.js'))
    return {
      language: 'node',
      startCommand: hasIndexJs ? 'node index.js' : 'node main.js',
    }
  }

  throw new Error('Could not detect language. Make sure your zip contains requirements.txt (Python) or package.json (Node.js).')
}
