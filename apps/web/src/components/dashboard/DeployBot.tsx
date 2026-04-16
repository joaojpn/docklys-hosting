import { useState, useRef, DragEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../../services/api'
import { Upload, ArrowLeft, Loader2, File, ChevronDown, Info } from 'lucide-react'
import { useState as useTooltipState } from 'react'
import { DeployedBot } from '../../pages/Dashboard'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

function Tooltip({ text }: { text: string }) {
  const [show, setShow] = useTooltipState(false)
  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-default"
      >
        <Info className="w-3.5 h-3.5" />
      </button>
      {show && (
        <div className="absolute left-5 top-1/2 -translate-y-1/2 z-50 w-56 p-2.5 rounded-lg bg-card border border-border/50 shadow-xl text-[12px] text-muted-foreground leading-relaxed">
          {text}
        </div>
      )}
    </div>
  )
}

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
    <main className="max-w-xl mx-auto px-6 py-8">
      <motion.button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-8"
        whileHover={{ x: -2 }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </motion.button>

      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight" style={{ fontFamily: 'Geist, sans-serif' }}>
          New Application
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1">Deploy your bot in seconds.</p>
      </div>

      <div className="space-y-5">

        {/* Upload */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[13px] font-medium">Project file</span>
          <Tooltip text="Zip your project folder with all source files. Make sure to include requirements.txt (Python) or package.json (Node.js) at the root level." />
        </div>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
            dragging ? 'border-blue-500/60 bg-blue-500/5' :
            file ? 'border-blue-500/30 bg-blue-500/5' :
            'border-border/40 hover:border-border/70 bg-muted/5 hover:bg-muted/10'
          }`}
        >
          <AnimatePresence mode="wait">
            {file ? (
              <motion.div key="file" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <File className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold">{file.name}</p>
                  <p className="text-[12px] text-muted-foreground">{(file.size / 1024).toFixed(1)} KB · click to change</p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-2xl bg-muted/40 border border-border/40 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-[14px] font-semibold">Drop your .zip file here</p>
                  <p className="text-[12px] text-muted-foreground">or click to browse</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <input ref={fileRef} type="file" accept=".zip" className="hidden" onChange={handleFileChange} />
        </div>

        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium">Application name <span className="text-destructive">*</span></label>
          <Input placeholder="My Bot" value={name} onChange={e => setName(e.target.value)} className="text-[13px] cursor-text" />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium text-muted-foreground">Description <span className="font-normal text-[12px]">(optional)</span></label>
          <Input placeholder="What does your bot do?" value={description} onChange={e => setDescription(e.target.value)} className="text-[13px] cursor-text" />
        </div>

        {/* Memory */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-medium flex items-center gap-1.5">
            Memory limit
            <Tooltip text="128 MB is enough for simple bots. Use 256 MB or more for bots with heavy processing, image generation, or multiple concurrent users." />
          </label>
          <div className="relative">
            <select
              value={memory}
              onChange={e => setMemory(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-background px-3 pr-8 text-[13px] cursor-pointer outline-none focus:ring-1 focus:ring-ring transition-all text-foreground appearance-none"
            >
              <option value="128">128 MB</option>
              <option value="256">256 MB</option>
              <option value="512">512 MB</option>
              <option value="1024">1024 MB</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Auto Restart */}
        <div className="flex items-center justify-between py-3 border-t border-border/30">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[13px] font-medium">Auto Restart</p>
              <span className="text-[10px] bg-blue-600/10 text-blue-400 border border-blue-600/20 px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">Recommended</span>
            </div>
            <p className="text-[12px] text-muted-foreground mt-0.5">Restarts automatically on failure.</p>
          </div>
          <button
            type="button"
            onClick={() => setAutoRestart(!autoRestart)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${autoRestart ? "bg-blue-600" : "bg-muted"}`}
          >
            <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg transition-transform ${autoRestart ? 'translate-x-5' : 'translate-x-1'}`} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[12px]">
            {error}
          </div>
        )}

        <Button onClick={handleSubmit} disabled={loading} className="w-full cursor-pointer bg-blue-600 hover:bg-blue-500" size="lg">
          {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {loading ? 'Deploying...' : 'Deploy'}
        </Button>

      </div>
    </main>
  )
}
