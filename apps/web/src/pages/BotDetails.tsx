import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import { Bot } from './Dashboard'
import { api } from '../services/api'
import { ArrowLeft, Square, RotateCcw, Trash2, Loader2 } from 'lucide-react'
import { EnvVars } from '../components/dashboard/EnvVars'
import { FileEditor } from '../components/dashboard/FileEditor'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Separator } from '../components/ui/separator'
import { LanguageIcon } from '../components/LanguageIcon'
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart'

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
}

type RamPoint = {
  time: string
  ram: number
}

const chartConfig = {
  ram: { label: 'RAM (MB)', color: '#6366f1' },
}

export function BotDetails({ bot, onBack, onDelete }: Props) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(bot.status)
  const [activeTab, setActiveTab] = useState<'console' | 'overview' | 'env' | 'files'>('console')
  const [logLines, setLogLines] = useState<string[]>([])
  const [logConnected, setLogConnected] = useState(false)
  const [ramHistory, setRamHistory] = useState<RamPoint[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333'

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get(`/bots/${bot.id}/stats`)
      setStats(response.data)
      setCurrentStatus(response.data.status)
      if (response.data.ram && response.data.ram !== '—') {
        const raw = parseFloat(response.data.ram.replace(/[^0-9.]/g, ''))
        const isKB = response.data.ram.includes('KB')
        const isGB = response.data.ram.includes('GB')
        let ramMB = raw
        if (isKB) ramMB = raw / 1024
        if (isGB) ramMB = raw * 1024
        const now = new Date()
        const timeLabel = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`
        setRamHistory(prev => [...prev.slice(-30), { time: timeLabel, ram: parseFloat(ramMB.toFixed(1)) }])
      }
    } catch {}
  }, [bot.id])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [fetchStats])

  useEffect(() => {
    const token = localStorage.getItem('@Docklys:token')
    if (!token) return
    const es = new EventSource(`${apiUrl}/bots/${bot.id}/logs?token=${token}`)
    es.onopen = () => setLogConnected(true)
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.line) setLogLines(prev => [...prev.slice(-500), data.line])
      } catch {}
    }
    es.onerror = () => { setLogConnected(false); es.close() }
    return () => es.close()
  }, [bot.id])

  useEffect(() => {
    if (activeTab === 'console') bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logLines, activeTab])

  const handleStop = async () => {
    setActionLoading('stop')
    try { await api.post(`/bots/${bot.id}/stop`); setCurrentStatus('STOPPED'); fetchStats() }
    catch (err: any) { alert(err.response?.data?.error || 'Failed to stop.') }
    finally { setActionLoading(null) }
  }

  const handleRestart = async () => {
    setActionLoading('restart')
    try { await api.post(`/bots/${bot.id}/restart`); setCurrentStatus('RUNNING'); fetchStats() }
    catch (err: any) { alert(err.response?.data?.error || 'Failed to restart.') }
    finally { setActionLoading(null) }
  }

  const handleDelete = async () => {
    setActionLoading('delete')
    try { await api.delete(`/bots/${bot.id}`); onDelete() }
    catch (err: any) { alert(err.response?.data?.error || 'Failed to delete.'); setActionLoading(null) }
  }

  const isRunning = currentStatus === 'RUNNING'
  const tabs = [
    { id: 'console' as const, label: 'Console' },
    { id: 'overview' as const, label: 'Overview' },
    { id: 'env' as const, label: 'Environment' },
    { id: 'files' as const, label: 'Files' },
  ]

  return (
    <main className="max-w-6xl mx-auto px-6 py-8">
      <motion.button onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-8"
        whileHover={{ x: -2 }}>
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </motion.button>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <LanguageIcon language={bot.language} size={38} />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[18px] font-semibold tracking-tight" style={{ fontFamily: 'Geist, sans-serif' }}>{bot.name}</h1>
              {isRunning ? (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full font-medium">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                  </span>
                  Online
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground bg-muted/40 border border-border/50 px-2 py-0.5 rounded-full">
                  <span className="inline-flex rounded-full h-1.5 w-1.5 bg-muted-foreground/40"></span>
                  Offline
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground/40 font-mono mt-0.5">{bot.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <Button variant="outline" size="sm" onClick={handleStop} disabled={!!actionLoading}
              className="gap-1.5 cursor-pointer text-[13px] hover:text-yellow-400 hover:border-yellow-400/20">
              {actionLoading === 'stop' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
              Stop
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleRestart} disabled={!!actionLoading}
            className="gap-1.5 cursor-pointer text-[13px] hover:text-primary hover:border-primary/20">
            {actionLoading === 'restart' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
            Restart
          </Button>
          <Button variant="outline" size="sm" onClick={() => setConfirmDelete(true)} disabled={!!actionLoading}
            className="gap-1.5 cursor-pointer text-[13px] hover:text-destructive hover:border-destructive/20">
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </Button>
        </div>
      </div>

      {/* Stats */}
      <Card className="border-border/50 mb-6">
        <CardContent className="py-4 px-6">
          <div className="flex items-center">
            {[
              { label: 'CPU', value: stats?.cpu || '—' },
              { label: 'Memory', value: stats?.ram || '—', sub: `limit ${bot.memory} MB` },
              { label: 'Uptime', value: stats?.uptime || '—' },
              { label: 'Language', value: bot.language ? bot.language.charAt(0).toUpperCase() + bot.language.slice(1) : '—' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center flex-1">
                {i > 0 && <div className="w-px h-8 bg-border/50 mr-6" />}
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">{stat.label}</p>
                  <p className="text-[18px] font-semibold tracking-tight leading-none" style={{ fontFamily: 'Geist, sans-serif' }}>{stat.value}</p>
                  {stat.sub && <p className="text-[11px] text-muted-foreground/40 mt-0.5">{stat.sub}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border/40 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-[13px] transition-all cursor-pointer relative ${activeTab === tab.id ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground/70'}`}>
            {tab.label}
            {activeTab === tab.id && <motion.div layoutId="bot-tab" className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />}
          </button>
        ))}
        {activeTab === 'console' && (
          <div className="ml-auto flex items-center gap-1.5 text-[11px] pb-2">
            <span className={`w-1.5 h-1.5 rounded-full ${logConnected ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground/40'}`} />
            <span className={logConnected ? 'text-emerald-500' : 'text-muted-foreground/40'}>
              {logConnected ? 'Live' : 'Disconnected'}
            </span>
          </div>
        )}
      </div>

      {/* Console */}
      {activeTab === 'console' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-border/50 overflow-hidden" style={{ height: '460px', display: 'flex', flexDirection: 'column' }}>
            <div className="flex-1 overflow-y-auto p-5 font-mono text-[12px] space-y-0.5 bg-black/20">
              {logLines.length === 0 ? (
                <p className="text-muted-foreground/30">Waiting for output...</p>
              ) : (
                logLines.map((line, i) => (
                  <div key={i} className="leading-5 flex gap-3">
                    <span className="text-muted-foreground/20 select-none shrink-0 w-8 text-right">{i + 1}</span>
                    <span className="text-foreground/60 break-all">{line}</span>
                  </div>
                ))
              )}
              <div ref={bottomRef} />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Overview */}
      {activeTab === 'overview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-x-12 gap-y-5">
                {[
                  { label: 'Application ID', value: bot.id, mono: true },
                  { label: 'Start command', value: bot.startCommand, mono: true },
                  { label: 'Created', value: new Date(bot.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' }) },
                  { label: 'Memory limit', value: `${bot.memory} MB` },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                    <p className={`text-[13px] text-foreground/80 ${item.mono ? 'font-mono text-[12px]' : ''}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {ramHistory.length > 1 && (
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <p className="text-[11px] text-muted-foreground uppercase tracking-wider">Memory usage over time</p>
                  <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">Beta</span>
                </div>
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                  <AreaChart data={ramHistory} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.3} />
                    <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} minTickGap={40} />
                    <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area dataKey="ram" type="natural" fill="url(#ramGrad)" stroke="#6366f1" strokeWidth={1.5} />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      {/* Environment */}
      {activeTab === 'env' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-border/50">
            <CardContent className="pt-6">
              <EnvVars botId={bot.id} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Files */}
      {activeTab === 'files' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="pt-6">
              <FileEditor botId={bot.id} />
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Delete modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border/50 rounded-xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-[15px] font-semibold mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>Delete application?</h2>
            <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed">This will stop the container and remove all data permanently.</p>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              <Button variant="destructive" className="flex-1 cursor-pointer" onClick={handleDelete} disabled={!!actionLoading}>
                {actionLoading === 'delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}
