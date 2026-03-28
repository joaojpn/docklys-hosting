import { useState, useRef, DragEvent } from 'react'
import { api } from '../../services/api'
import { Upload, ArrowLeft, Loader2 } from 'lucide-react'
import { DeployedBot } from '../../pages/Dashboard'

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
    if (dropped && dropped.name.endsWith('.zip')) {
      setFile(dropped)
    } else {
      setError('Only .zip files are accepted.')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (selected && selected.name.endsWith('.zip')) {
      setFile(selected)
      setError('')
    } else {
      setError('Only .zip files are accepted.')
    }
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
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold text-white">Deploy Application</h1>
          <p className="text-sm text-zinc-400 mt-1">Follow the instructions to upload your bot.</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* LEFT — Upload */}
        <div className="space-y-4">
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all ${
              dragging
                ? 'border-blue-500/60 bg-blue-500/5'
                : file
                ? 'border-green-500/40 bg-green-500/5'
                : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
            }`}
          >
            <Upload className={`w-8 h-8 ${file ? 'text-green-400' : 'text-zinc-600'}`} />
            {file ? (
              <>
                <p className="text-sm font-medium text-green-400">{file.name}</p>
                <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(1)} KB — click to change</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-white">Select a .zip file</p>
                <p className="text-xs text-zinc-500">or drag and drop here</p>
              </>
            )}
            <input
              ref={fileRef}
              type="file"
              accept=".zip"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-xs text-zinc-400 font-mono space-y-1">
            <p className="text-zinc-500 mb-2 font-sans text-xs">Required zip structure:</p>
            <p>your-bot/</p>
            <p>├── main.py <span className="text-zinc-600"># or index.js</span></p>
            <p>├── requirements.txt <span className="text-zinc-600"># or package.json</span></p>
            <p>└── docklys.config</p>
            <p className="text-zinc-600 mt-2 font-sans">docklys.config example:</p>
            <p className="text-zinc-500">[main]</p>
            <p className="text-zinc-500">name = my-bot</p>
            <p className="text-zinc-500">memory = 256</p>
            <p className="text-zinc-500">start = python main.py</p>
          </div>
        </div>

        {/* RIGHT — Config */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Application Name *</label>
              <input
                placeholder="My Bot"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 h-10 text-sm placeholder:text-zinc-600 rounded-md px-3 outline-none transition-all text-white"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Memory *</label>
              <select
                value={memory}
                onChange={e => setMemory(e.target.value)}
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 h-10 text-sm rounded-md px-3 outline-none transition-all text-white cursor-pointer"
              >
                <option value="128">128 MB</option>
                <option value="256">256 MB</option>
                <option value="512">512 MB</option>
                <option value="1024">1024 MB</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Description</label>
            <input
              placeholder="A bot that does cool things"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 h-10 text-sm placeholder:text-zinc-600 rounded-md px-3 outline-none transition-all text-white"
            />
          </div>

          <div className="flex items-center justify-between bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-white">Auto Restart</span>
                <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full uppercase tracking-wide">Recommended</span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">Automatically restarts on failure</p>
            </div>
            <button
              type="button"
              onClick={() => setAutoRestart(!autoRestart)}
              className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${autoRestart ? 'bg-blue-600' : 'bg-zinc-700'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${autoRestart ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-500/5 border border-red-500/10 text-red-400 text-xs">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full flex items-center justify-center h-11 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-all disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Deploy Bot'}
          </button>
        </div>
      </div>
    </main>
  )
}
