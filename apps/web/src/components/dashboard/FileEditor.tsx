import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Loader2, Folder, File, ChevronRight, Save, ArrowLeft } from 'lucide-react'
import { Button } from '../ui/button'
import Editor from '@monaco-editor/react'

type FileEntry = {
  name: string
  path: string
  type: 'file' | 'directory'
}

type Props = {
  botId: string
}

const getLanguage = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase()
  const map: Record<string, string> = {
    py: 'python', js: 'javascript', ts: 'typescript',
    json: 'json', md: 'markdown', txt: 'plaintext',
    yml: 'yaml', yaml: 'yaml', sh: 'shell',
    env: 'plaintext', toml: 'plaintext',
  }
  return map[ext || ''] || 'plaintext'
}

export function FileEditor({ botId }: Props) {
  const [currentPath, setCurrentPath] = useState('/app')
  const [entries, setEntries] = useState<FileEntry[]>([])
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [fileLoading, setFileLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [pathHistory, setPathHistory] = useState<string[]>([])

  useEffect(() => {
    loadFiles(currentPath)
  }, [currentPath])

  const loadFiles = async (filePath: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await api.get(`/bots/${botId}/files`, { params: { filePath } })
      setEntries(res.data.entries)
    } catch {
      setError('Failed to load files. Make sure the bot is running.')
    } finally {
      setLoading(false)
    }
  }

  const openFile = async (filePath: string) => {
    setFileLoading(true)
    setSelectedFile(filePath)
    try {
      const res = await api.get(`/bots/${botId}/files/content`, { params: { filePath } })
      setContent(res.data.content)
      setOriginalContent(res.data.content)
    } catch {
      setError('Failed to read file.')
    } finally {
      setFileLoading(false)
    }
  }

  const openDirectory = (dirPath: string) => {
    setPathHistory(prev => [...prev, currentPath])
    setCurrentPath(dirPath)
    setSelectedFile(null)
  }

  const goBack = () => {
    const prev = pathHistory[pathHistory.length - 1]
    if (prev) {
      setPathHistory(h => h.slice(0, -1))
      setCurrentPath(prev)
      setSelectedFile(null)
    }
  }

  const handleSave = async () => {
    if (!selectedFile) return
    setSaving(true)
    try {
      await api.put(`/bots/${botId}/files/content`, { filePath: selectedFile, content })
      setOriginalContent(content)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Failed to save file.')
    } finally {
      setSaving(false)
    }
  }

  const isDirty = content !== originalContent

  return (
    <div className="flex gap-4" style={{ height: '460px' }}>
      {/* File tree */}
      <div className="w-48 shrink-0 border border-border/40 rounded-lg overflow-hidden flex flex-col">
        <div className="px-3 py-2 border-b border-border/30 flex items-center gap-2">
          {pathHistory.length > 0 && (
            <button onClick={goBack} className="text-muted-foreground hover:text-foreground cursor-pointer">
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[11px] text-muted-foreground truncate font-mono">
            {currentPath.replace('/app', '') || '/'}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-[11px] text-muted-foreground px-3 py-4">Empty directory</p>
          ) : (
            entries.map(entry => (
              <button
                key={entry.path}
                onClick={() => entry.type === 'directory' ? openDirectory(entry.path) : openFile(entry.path)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-muted/30 transition-colors cursor-pointer text-left ${selectedFile === entry.path ? 'bg-muted/40 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {entry.type === 'directory' ? (
                  <Folder className="w-3.5 h-3.5 text-primary/70 shrink-0" />
                ) : (
                  <File className="w-3.5 h-3.5 shrink-0" />
                )}
                <span className="truncate">{entry.name}</span>
                {entry.type === 'directory' && <ChevronRight className="w-3 h-3 ml-auto shrink-0" />}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 border border-border/40 rounded-lg overflow-hidden flex flex-col">
        {selectedFile ? (
          <>
            <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 shrink-0">
              <div className="flex items-center gap-2">
                <File className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[12px] text-muted-foreground font-mono">
                  {selectedFile.replace('/app/', '')}
                </span>
                {isDirty && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" title="Unsaved changes" />}
              </div>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving || !isDirty}
                className="h-7 px-3 text-[12px] cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : saved ? 'Saved!' : <><Save className="w-3.5 h-3.5 mr-1" />Save</>}
              </Button>
            </div>
            {fileLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex-1">
                <Editor
                  height="100%"
                  language={getLanguage(selectedFile)}
                  value={content}
                  onChange={val => setContent(val || '')}
                  theme="vs-dark"
                  options={{
                    fontSize: 12,
                    fontFamily: 'JetBrains Mono, Fira Code, monospace',
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    renderLineHighlight: 'line',
                    padding: { top: 12 },
                    tabSize: 2,
                    wordWrap: 'on',
                  }}
                />
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <File className="w-8 h-8 text-muted-foreground/30 mb-3" />
            <p className="text-[13px] text-muted-foreground">Select a file to edit</p>
            <p className="text-[11px] text-muted-foreground/50 mt-1">Click on any file in the tree on the left</p>
          </div>
        )}
        {error && (
          <div className="px-4 py-2 border-t border-destructive/20 bg-destructive/5 text-destructive text-[12px]">
            {error}
          </div>
        )}
      </div>
    </div>
  )
}
