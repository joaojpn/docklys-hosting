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
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted/30 border border-border/40 flex items-center justify-center mb-4">
          <Rocket className="w-5 h-5 text-muted-foreground" />
        </div>
        <h2 className="text-[15px] font-semibold mb-1.5" style={{ fontFamily: 'Geist, sans-serif' }}>No applications yet</h2>
        <p className="text-[13px] text-muted-foreground max-w-xs mb-5 leading-relaxed">
          Deploy your first bot — zip your project and upload it.
        </p>
        <Button onClick={onNewBot} size="sm" className="cursor-pointer gap-2 bg-blue-600 hover:bg-blue-500">
          <Plus className="w-3.5 h-3.5" />
          New Application
        </Button>
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
