import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot } from '../../pages/Dashboard'
import { Loader2, Plus, Square, RotateCcw, Trash2, ScrollText, Rocket, MoreHorizontal } from 'lucide-react'
import { api } from '../../services/api'
import { BotLogs } from './BotLogs'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { LanguageIcon } from '../LanguageIcon'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const StatusBadge = ({ status }: { status: Bot['status'] }) => {
  if (status === 'RUNNING') return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
      </span>
      Running
    </span>
  )
  const config = {
    STOPPED: { label: 'Stopped', color: 'text-muted-foreground' },
    ERROR: { label: 'Error', color: 'text-destructive' },
    DEPLOYING: { label: 'Deploying', color: 'text-primary' },
  }
  const { label, color } = config[status] || config.STOPPED
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${color}`}>
      <span className="inline-flex rounded-full h-1.5 w-1.5 bg-current opacity-70"></span>
      {label}
    </span>
  )
}

type BotStats = { ram: string; uptime: string }

function BotCard({ bot, onSelectBot, onLogs, onStop, onRestart, onDelete, actionLoading }: {
  bot: Bot
  onSelectBot: (bot: Bot) => void
  onLogs: (bot: { id: string; name: string }) => void
  onStop: (id: string) => void
  onRestart: (id: string) => void
  onDelete: (id: string) => void
  actionLoading: string | null
}) {
  const [stats, setStats] = useState<BotStats | null>(null)

  useEffect(() => {
    if (bot.status !== 'RUNNING') return
    const fetch = async () => {
      try {
        const res = await api.get(`/bots/${bot.id}/stats`)
        setStats({ ram: res.data.ram, uptime: res.data.uptime })
      } catch {}
    }
    fetch()
    const interval = setInterval(fetch, 10000)
    return () => clearInterval(interval)
  }, [bot.id, bot.status])

  return (
    <Card
      onClick={() => onSelectBot(bot)}
      className="p-4 border-border/40 hover:border-border/60 transition-all cursor-pointer group rounded-lg bg-card"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <LanguageIcon language={bot.language} size={32} />
          <div>
            <p className="text-[13px] font-semibold text-foreground/90 group-hover:text-foreground transition-colors leading-none mb-1">
              {bot.name}
            </p>
            <StatusBadge status={bot.status} />
          </div>
        </div>
        <div onClick={e => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-foreground">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 bg-card border-border/50">
              <DropdownMenuItem className="cursor-pointer text-[13px] gap-2"
                onClick={() => onLogs({ id: bot.id, name: bot.name })}>
                <ScrollText className="w-3.5 h-3.5" /> View logs
              </DropdownMenuItem>
              {bot.status === 'RUNNING' && (
                <DropdownMenuItem className="cursor-pointer text-[13px] gap-2"
                  onClick={() => onStop(bot.id)} disabled={!!actionLoading}>
                  {actionLoading === bot.id + '-stop' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
                  Stop
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="cursor-pointer text-[13px] gap-2"
                onClick={() => onRestart(bot.id)} disabled={!!actionLoading}>
                {actionLoading === bot.id + '-restart' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                Restart
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-[13px] gap-2 text-destructive focus:text-destructive"
                onClick={() => onDelete(bot.id)}>
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Info row */}
      <div className="flex items-center gap-3 text-[11px] text-muted-foreground/50 border-t border-border/20 pt-3">
        <span>{bot.memory} MB limit</span>
        <span>·</span>
        <span>{bot.language === 'python' ? 'Python' : 'Node.js'}</span>
        <span>·</span>
        <span>{new Date(bot.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-2 mt-2.5">
        <div className="bg-muted/20 rounded-md px-2.5 py-1.5">
          <div className="flex items-center gap-1 mb-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/40"><rect x="2" y="9" width="20" height="8" rx="1"/><path d="M6 9V6"/><path d="M10 9V6"/><path d="M14 9V6"/><path d="M18 9V6"/><path d="M6 17v3"/><path d="M10 17v3"/><path d="M14 17v3"/><path d="M18 17v3"/></svg>
            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">RAM</p>
          </div>
          <p className="text-[12px] font-medium text-foreground/70">
            {bot.status === 'RUNNING' ? (stats?.ram ? `${stats.ram} / ${bot.memory} MB` : '—') : '—'}
          </p>
        </div>
        <div className="bg-muted/20 rounded-md px-2.5 py-1.5">
          <div className="flex items-center gap-1 mb-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground/40"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <p className="text-[10px] text-muted-foreground/40 uppercase tracking-wider">Uptime</p>
          </div>
          <p className="text-[12px] font-medium text-foreground/70">
            {bot.status === 'RUNNING' ? (stats?.uptime || '—') : '—'}
          </p>
        </div>
      </div>
    </Card>
  )
}

type Props = {
  bots: Bot[]
  loading: boolean
  onNewBot: () => void
  onRefresh: () => void
  onSelectBot: (bot: Bot) => void
}

export function BotList({ bots, loading, onNewBot, onRefresh, onSelectBot }: Props) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [logsBot, setLogsBot] = useState<{ id: string; name: string } | null>(null)

  const handleStop = async (id: string) => {
    setActionLoading(id + '-stop')
    try { await api.post(`/bots/${id}/stop`); onRefresh() }
    catch (err: any) { alert(err.response?.data?.error || 'Failed to stop.') }
    finally { setActionLoading(null) }
  }

  const handleRestart = async (id: string) => {
    setActionLoading(id + '-restart')
    try { await api.post(`/bots/${id}/restart`); onRefresh() }
    catch (err: any) { alert(err.response?.data?.error || 'Failed to restart.') }
    finally { setActionLoading(null) }
  }

  const handleDelete = async (id: string) => {
    setActionLoading(id + '-delete')
    try { await api.delete(`/bots/${id}`); setConfirmDelete(null); onRefresh() }
    catch (err: any) { alert(err.response?.data?.error || 'Failed to delete.') }
    finally { setActionLoading(null) }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-28 bg-muted/10 animate-pulse rounded-lg border border-border/30" />
        ))}
      </div>
    )
  }

  if (bots.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="py-8">

        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-[22px] font-semibold mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>
            Deploy your first application
          </h2>
          <p className="text-[13px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Zip your project, upload it, and your bot will be live in seconds.
          </p>
          <Button onClick={onNewBot} className="cursor-pointer gap-2 bg-blue-600 hover:bg-blue-500 mt-5">
            <Plus className="w-4 h-4" />
            New Application
          </Button>
        </div>

        {/* Steps with connector line */}
        <div className="relative mb-12">
          {/* Connector line */}
          <div className="absolute top-5 left-[calc(16.666%+20px)] right-[calc(16.666%+20px)] h-px bg-border/40" />

          <div className="grid grid-cols-3 gap-4 relative">
            {[
              {
                step: 1,
                title: 'Zip your project',
                desc: 'Add your code and a requirements.txt or package.json to a .zip file.',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                )
              },
              {
                step: 2,
                title: 'Upload and configure',
                desc: 'Set your application name, memory limit and auto-restart options.',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/>
                    <line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                )
              },
              {
                step: 3,
                title: 'Go live instantly',
                desc: 'Nuvee installs dependencies and starts your bot in an isolated container.',
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                )
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-600/30 flex items-center justify-center text-blue-400 mb-4 relative z-10 bg-background">
                  {item.icon}
                </div>
                <p className="text-[13px] font-semibold mb-1.5">{item.title}</p>
                <p className="text-[12px] text-muted-foreground leading-relaxed max-w-[180px]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Supported languages */}
        <div className="border border-border/30 rounded-xl p-5 bg-card/30">
          <p className="text-[11px] text-muted-foreground/50 uppercase tracking-wider mb-4">Supported languages</p>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 256 255" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="py1e" x1="12.959%" y1="12.039%" x2="79.639%" y2="78.201%">
                    <stop offset="0%" stopColor="#387EB8"/>
                    <stop offset="100%" stopColor="#366994"/>
                  </linearGradient>
                  <linearGradient id="py2e" x1="19.128%" y1="20.579%" x2="90.742%" y2="88.429%">
                    <stop offset="0%" stopColor="#FFE052"/>
                    <stop offset="100%" stopColor="#FFC331"/>
                  </linearGradient>
                </defs>
                <path fill="url(#py1e)" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"/>
                <path fill="url(#py2e)" d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"/>
              </svg>
              <span className="text-[13px] font-medium">Python</span>
            </div>
            <div className="w-px h-4 bg-border/40" />
            <div className="flex items-center gap-2.5">
              <svg width="22" height="22" viewBox="0 0 256 289" xmlns="http://www.w3.org/2000/svg">
                <path d="M128 288.464c-3.975 0-7.685-1.06-11.13-2.915l-35.247-20.936c-5.3-2.98-2.645-3.975-1.06-4.64 7.42-2.58 8.81-3.18 16.495-7.685.795-.53 1.855-.265 2.65.265l27.032 16.096c1.06.53 2.52.53 3.44 0l105.74-61.2c1.06-.53 1.59-1.59 1.59-2.78V83.192c0-1.19-.53-2.25-1.59-2.78L128.928 19.353c-1.06-.53-2.385-.53-3.44 0L19.884 80.411c-1.06.53-1.59 1.72-1.59 2.78v122.256c0 1.06.53 2.25 1.59 2.78l28.887 16.76c15.7 7.86 25.44-1.325 25.44-10.64V94.453c0-1.59 1.325-2.915 2.915-2.915h12.59c1.59 0 2.915 1.325 2.915 2.915V214.347c0 20.8-11.395 32.726-31.136 32.726-6.095 0-10.9 0-24.38-6.625L9.574 223.918C3.745 220.673 0 214.613 0 208.022V85.632c0-6.59 3.745-12.65 9.574-15.895L119.133 8.08c5.7-3.18 13.25-3.18 18.88 0l109.56 61.657c5.83 3.31 9.57 9.37 9.57 15.895v122.39c0 6.59-3.74 12.58-9.57 15.89L147.013 285.35c-3.18 1.59-6.89 2.915-11.13 2.915h-7.883z" fill="#539E43"/>
                <path d="M160.264 206.828c-46.233 0-55.898-21.2-55.898-39.016 0-1.59 1.325-2.915 2.915-2.915h12.854c1.46 0 2.65 1.06 2.915 2.52 1.986 13.385 7.95 20.14 37.347 20.14 22.924 0 32.726-5.17 32.726-17.36 0-7.02-2.78-12.19-38.276-15.7-29.663-2.916-48.02-9.44-48.02-33.09 0-21.8 18.35-34.783 49.08-34.783 34.517 0 51.61 11.926 53.73 37.745.13.795-.13 1.59-.66 2.25-.53.53-1.325.928-2.12.928h-12.985c-1.325 0-2.52-.928-2.78-2.253-3.31-14.84-11.396-19.61-35.185-19.61-25.97 0-28.95 9.04-28.95 15.83 0 8.215 3.58 10.64 37.082 15.3 33.36 4.64 49.22 11.13 49.22 33.36-.133 23.72-19.743 37.612-54.993 37.612z" fill="#539E43"/>
              </svg>
              <span className="text-[13px] font-medium">Node.js</span>
            </div>
            <div className="w-px h-4 bg-border/40" />
            <span className="text-[12px] text-muted-foreground/40 italic">More languages coming soon</span>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence>
          {bots.map((bot, index) => (
            <motion.div
              key={bot.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <BotCard
                bot={bot}
                onSelectBot={onSelectBot}
                onLogs={setLogsBot}
                onStop={handleStop}
                onRestart={handleRestart}
                onDelete={setConfirmDelete}
                actionLoading={actionLoading}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {logsBot && <BotLogs botId={logsBot.id} botName={logsBot.name} onClose={() => setLogsBot(null)} />}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
            <Card className="p-6 w-full max-w-sm mx-4 border-border/50">
              <h2 className="text-[15px] font-semibold mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>Delete application?</h2>
              <p className="text-[13px] text-muted-foreground mb-6 leading-relaxed">
                This will stop the container and remove all data. This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 cursor-pointer" onClick={() => setConfirmDelete(null)}>Cancel</Button>
                <Button variant="destructive" className="flex-1 cursor-pointer" onClick={() => handleDelete(confirmDelete)} disabled={!!actionLoading}>
                  {actionLoading === confirmDelete + '-delete' ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </>
  )
}
