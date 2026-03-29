import { useState, useEffect, useCallback } from 'react'
import { Bot } from './Dashboard'
import { api } from '../services/api'
import { ArrowLeft, Square, RotateCcw, Trash2, Loader2, Terminal, Cpu, MemoryStick, Clock } from 'lucide-react'
import { BotLogs } from '../components/dashboard/BotLogs'

type Props = {
  bot: Bot
  onBack: () => void
  onDelete: () => void
}

type Stats = {
  status: string
  uptime: string
  cpu: string
  ram: string
  ramLimit: string
}

const PythonIcon = () => (
  <div className="w-10 h-10 rounded-lg bg-[#3776AB]/20 border border-[#3776AB]/30 flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#3776AB">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.031v-2.868s-.109-3.403 3.347-3.403h5.766s3.24.052 3.24-3.13V3.347S18.28 0 11.914 0zm-3.21 1.875a1.031 1.031 0 1 1 0 2.063 1.031 1.031 0 0 1 0-2.063z"/>
      <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.031v2.868s.109 3.403-3.347 3.403H9.453s-3.24-.052-3.24 3.13v5.184S5.72 24 12.086 24zm3.21-1.875a1.031 1.031 0 1 1 0-2.063 1.031 1.031 0 0 1 0 2.063z"/>
    </svg>
  </div>
)

const NodeIcon = () => (
  <div className="w-10 h-10 rounded-lg bg-[#339933]/20 border border-[#339933]/30 flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#339933">
      <path d="M11.998 24a2.44 2.44 0 0 1-1.218-.324l-3.862-2.286c-.578-.323-.295-.436-.105-.502.769-.269.924-.329 1.742-.796.086-.049.199-.031.288.019l2.97 1.762c.107.058.258.058.357 0l11.566-6.678c.107-.061.174-.185.174-.312V7.148c0-.132-.067-.252-.177-.317L12.18 .156a.365.365 0 0 0-.357 0L.258 6.831C.145 6.898.077 7.02.077 7.148v13.35c0 .128.068.25.18.314l3.17 1.83c1.72.86 2.772-.153 2.772-1.17V8.233c0-.188.15-.335.34-.335h1.47c.185 0 .337.147.337.335v13.24c0 2.292-1.25 3.607-3.421 3.607-.668 0-1.194 0-2.664-.724L.599 22.59A2.43 2.43 0 0 1 0 20.497V7.148c0-.841.45-1.626 1.18-2.049L12.743.425a2.498 2.498 0 0 1 2.496 0L26.8 7.099A2.432 2.432 0 0 1 27.98 9.148v13.35c0 .843-.453 1.624-1.183 2.047l-11.562 6.678c-.377.212-.8.324-1.237.324z"/>
    </svg>
  </div>
)

const StatusBadge = ({ status }: { status: string }) => {
  const config: Record<string, { label: string; class: string }> = {
    RUNNING: { label: 'Running', class: 'bg-green-500/10 text-green-400 border-green-500/20' },
    STOPPED: { label: 'Stopped', class: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
    ERROR: { label: 'Error', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
    DEPLOYING: { label: 'Deploying', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  }
  const { label, class: cls } = config[status] || config.STOPPED
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

export function BotDetails({ bot, onBack, onDelete }: Props) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showLogs, setShowLogs] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(bot.status)

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get(`/bots/${bot.id}/stats`)
      setStats(response.data)
      setCurrentStatus(response.data.status)
    } catch {}
  }, [bot.id])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [fetchStats])

  const handleStop = async () => {
    setActionLoading('stop')
    try {
      await api.post(`/bots/${bot.id}/stop`)
      setCurrentStatus('STOPPED')
      fetchStats()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to stop.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRestart = async () => {
    setActionLoading('restart')
    try {
      await api.post(`/bots/${bot.id}/restart`)
      setCurrentStatus('RUNNING')
      fetchStats()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to restart.')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    setActionLoading('delete')
    try {
      await api.delete(`/bots/${bot.id}`)
      onDelete()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete.')
      setActionLoading(null)
    }
  }

  return (
    <main className="relative max-w-4xl mx-auto px-6 py-10">

      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-center gap-4">
          {bot.language === 'python' ? <PythonIcon /> : <NodeIcon />}
          <div>
            <h1 className="text-2xl font-semibold text-white">{bot.name}</h1>
            {bot.description && <p className="text-sm text-zinc-400 mt-0.5">{bot.description}</p>}
            <div className="mt-2">
              <StatusBadge status={currentStatus} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLogs(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-md transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5" />
            Logs
          </button>
          {currentStatus === 'RUNNING' && (
            <button
              onClick={handleStop}
              disabled={!!actionLoading}
              className="flex items-center gap-2 px-3 py-2 text-sm text-yellow-400 border border-yellow-400/20 hover:bg-yellow-400/10 rounded-md transition-all cursor-pointer disabled:opacity-50"
            >
              {actionLoading === 'stop' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
              Stop
            </button>
          )}
          <button
            onClick={handleRestart}
            disabled={!!actionLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-blue-400 border border-blue-400/20 hover:bg-blue-400/10 rounded-md transition-all cursor-pointer disabled:opacity-50"
          >
            {actionLoading === 'restart' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
            Restart
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            disabled={!!actionLoading}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 border border-red-400/20 hover:bg-red-400/10 rounded-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
            <Cpu className="w-3.5 h-3.5" />
            CPU
          </div>
          <p className="text-xl font-semibold text-white">{stats?.cpu || '—'}</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
            <MemoryStick className="w-3.5 h-3.5" />
            Memory
          </div>
          <p className="text-xl font-semibold text-white">{stats?.ram || '—'}</p>
          <p className="text-xs text-zinc-600 mt-0.5">of {bot.memory} MB</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
            <Clock className="w-3.5 h-3.5" />
            Uptime
          </div>
          <p className="text-xl font-semibold text-white">{stats?.uptime || '—'}</p>
        </div>
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 text-zinc-500 text-xs mb-2">
            <Terminal className="w-3.5 h-3.5" />
            Language
          </div>
          <p className="text-xl font-semibold text-white capitalize">{bot.language || '—'}</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-medium text-white">Application Info</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500 text-xs mb-1">Application ID</p>
            <p className="text-zinc-300 font-mono text-xs">{bot.id}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-1">Start Command</p>
            <p className="text-zinc-300 font-mono text-xs">{bot.startCommand}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-1">Created</p>
            <p className="text-zinc-300 text-xs">
              {new Date(bot.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs mb-1">Memory Limit</p>
            <p className="text-zinc-300 text-xs">{bot.memory} MB</p>
          </div>
        </div>
      </div>

      {/* Logs Modal */}
      {showLogs && (
        <BotLogs botId={bot.id} botName={bot.name} onClose={() => setShowLogs(false)} />
      )}

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-base font-semibold text-white mb-2">Delete application?</h2>
            <p className="text-sm text-zinc-400 mb-6">
              This will stop the container and remove all data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 h-10 text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!!actionLoading}
                className="flex-1 h-10 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {actionLoading === 'delete' ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
