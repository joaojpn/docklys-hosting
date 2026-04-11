import { useState, useRef, DragEvent } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../services/api'
import { Upload, ArrowLeft, Loader2, File } from 'lucide-react'
import { DeployedBot } from '../../pages/Dashboard'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'

type Props = {
  onBack: () => void
  onSuccess: (bot: DeployedBot) => void
}

export function DeployBot({ onBack, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [memory, setMemory] = useState('256')
  const [autoRestart, setAutoRestart] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.name.endsWith('.zip')) { setFile(dropped); setError('') }
    else setError('Only .zip files are accepted.')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected && selected.name.endsWith('.zip')) { setFile(selected); setError('') }
    else setError('Only .zip files are accepted.')
  }

  const handleSubmit = async () => {
    if (!file) return setError('Please select a .zip file.')
    if (!name.trim()) return setError('Application name is required.')
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', name.trim())
      formData.append('description', description.trim())
      formData.append('memory', memory)
      formData.append('autoRestart', String(autoRestart))
      const response = await api.post('/bots/deploy', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      onSuccess(response.data.bot)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Deploy failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-8">
      <motion.button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-8"
        whileHover={{ x: -2 }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </motion.button>

      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'Geist, sans-serif' }}>
          Deploy Application
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">Upload a .zip file to deploy your bot.</p>
      </div>

      <div className="grid grid-cols-2 gap-12">
        {/* Left — upload */}
        <div className="space-y-6">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all aspect-[4/3] ${
              dragging ? 'border-primary/60 bg-primary/5' :
              file ? 'border-blue-500/40 bg-blue-500/5' :
              'border-border/50 hover:border-border/80 bg-muted/10 hover:bg-muted/20'
            }`}
          >
            {file ? (
              <>
                <div className="w-14 h-14 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <File className="w-7 h-7 text-blue-400" />
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-semibold text-foreground">{file.name}</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
                <p className="text-[11px] text-muted-foreground/60">click to change</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-semibold">Select a .zip file</p>
                  <p className="text-[12px] text-muted-foreground mt-0.5">or drag and drop here</p>
                </div>
              </>
            )}
            <input ref={fileRef} type="file" accept=".zip" className="hidden" onChange={handleFileChange} />
          </div>


        </div>

        {/* Right — config */}
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium">Application name <span className="text-destructive">*</span></label>
              <Input placeholder="My Bot" value={name} onChange={e => setName(e.target.value)} className="text-[13px] cursor-text" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium">Memory <span className="text-destructive">*</span></label>
              <select
                value={memory}
                onChange={e => setMemory(e.target.value)}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-[13px] cursor-pointer outline-none focus:ring-1 focus:ring-ring transition-all text-foreground"
              >
                <option value="128">128 MB</option>
                <option value="256">256 MB</option>
                <option value="512">512 MB</option>
                <option value="1024">1024 MB</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-medium">Description</label>
            <Input placeholder="A short description of your bot" value={description} onChange={e => setDescription(e.target.value)} className="text-[13px] cursor-text" />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-medium">Auto Restart</p>
                <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">Recommended</span>
              </div>
              <p className="text-[12px] text-muted-foreground mt-0.5">Automatically restarts the bot on failure.</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoRestart(!autoRestart)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${autoRestart ? "bg-blue-600" : "bg-muted"}`}
            >
              <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${autoRestart ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          <Separator />

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[12px]">
              {error}
            </div>
          )}

          <Button onClick={handleSubmit} disabled={loading} className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500" size="lg">
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {loading ? 'Deploying...' : 'Deploy Bot'}
          </Button>
        </div>
      </div>
    </main>
  )
}
