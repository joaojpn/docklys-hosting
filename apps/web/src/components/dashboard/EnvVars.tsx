import { useState, useEffect } from 'react'
import { api } from '../../services/api'
import { Plus, Trash2, Loader2, Eye, EyeOff, Save } from 'lucide-react'

type EnvVar = {
  id?: string
  key: string
  value: string
  revealed?: boolean
}

type Props = {
  botId: string
}

export function EnvVars({ botId }: Props) {
  const [vars, setVars] = useState<EnvVar[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/bots/${botId}/env`).then(res => {
      setVars(res.data.envVars.map((v: any) => ({ ...v, revealed: false })))
    }).finally(() => setLoading(false))
  }, [botId])

  const handleAdd = () => {
    setVars(prev => [...prev, { key: '', value: '', revealed: true }])
  }

  const handleChange = (index: number, field: 'key' | 'value', value: string) => {
    setVars(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v))
  }

  const handleRemove = (index: number) => {
    setVars(prev => prev.filter((_, i) => i !== index))
  }

  const handleToggleReveal = (index: number) => {
    setVars(prev => prev.map((v, i) => i === index ? { ...v, revealed: !v.revealed } : v))
  }

  const handleSave = async () => {
    const invalid = vars.some(v => !v.key.trim())
    if (invalid) return setError('All variables must have a key.')

    const duplicates = vars.map(v => v.key).filter((k, i, a) => a.indexOf(k) !== i)
    if (duplicates.length > 0) return setError(`Duplicate key: ${duplicates[0]}`)

    setSaving(true)
    setError('')
    try {
      await api.put(`/bots/${botId}/env`, {
        vars: vars.map(v => ({ key: v.key.trim(), value: v.value }))
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to save.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {vars.length === 0 && (
        <p className="text-sm text-zinc-600 py-2">No environment variables defined yet.</p>
      )}

      {vars.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <input
            value={v.key}
            onChange={e => handleChange(i, 'key', e.target.value)}
            placeholder="KEY"
            className="w-40 bg-zinc-800/50 border border-zinc-700 focus:border-blue-500/50 h-9 text-xs text-white placeholder:text-zinc-600 rounded-md px-3 outline-none font-mono transition-all"
          />
          <div className="flex-1 relative">
            <input
              type={v.revealed ? 'text' : 'password'}
              value={v.value}
              onChange={e => handleChange(i, 'value', e.target.value)}
              placeholder="VALUE"
              className="w-full bg-zinc-800/50 border border-zinc-700 focus:border-blue-500/50 h-9 text-xs text-white placeholder:text-zinc-600 rounded-md px-3 pr-9 outline-none font-mono transition-all"
            />
            <button
              onClick={() => handleToggleReveal(i)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 cursor-pointer"
            >
              {v.revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <button
            onClick={() => handleRemove(i)}
            className="p-2 text-zinc-600 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 px-3 h-8 text-xs text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-md transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add variable
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1.5 px-3 h-8 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          {saved ? 'Saved!' : 'Save & restart'}
        </button>
      </div>
      {vars.length > 0 && (
        <p className="text-xs text-zinc-600">Saving will restart the container with the new variables applied.</p>
      )}
    </div>
  )
}
