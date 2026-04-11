import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot } from '../../pages/Dashboard'
import { Loader2, Plus, Square, RotateCcw, Trash2, ScrollText, Rocket } from 'lucide-react'
import { api } from '../../services/api'
import { BotLogs } from './BotLogs'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { LanguageIcon } from '../LanguageIcon'

const StatusBadge = ({ status }: { status: Bot['status'] }) => {
  if (status === 'RUNNING') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[12px] text-emerald-400">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
        </span>
        Running
      </span>
    )
  }
  const config = {
    STOPPED: { label: 'Stopped', color: 'text-muted-foreground', dot: 'bg-muted-foreground/50' },
    ERROR: { label: 'Error', color: 'text-destructive', dot: 'bg-destructive' },
    DEPLOYING: { label: 'Deploying', color: 'text-primary', dot: 'bg-primary' },
  }
  const { label, color, dot } = config[status] || config.STOPPED
  return (
    <span className={`inline-flex items-center gap-1.5 text-[12px] ${color}`}>
      <span className={`inline-flex rounded-full h-1.5 w-1.5 ${dot}`}></span>
      {label}
    </span>
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

  const handleStop = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    setActionLoading(id + '-stop')
    try { await api.post(`/bots/${id}/stop`); onRefresh() }
    catch (err: any) { alert(err.response?.data?.error || 'Failed to stop.') }
    finally { setActionLoading(null) }
  }

  const handleRestart = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
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
      <div className="space-y-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-muted/20 rounded-xl animate-pulse border border-border/40" />
        ))}
      </div>
    )
  }

  if (bots.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-muted/30 border border-border/50 flex items-center justify-center mb-6">
          <Rocket className="w-6 h-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ fontFamily: 'Geist, sans-serif' }}>
          No applications yet
        </h2>
        <p className="text-[13px] text-muted-foreground max-w-xs mb-6 leading-relaxed">
          Deploy your first bot in seconds — zip your project and upload it.
        </p>
        <Button onClick={onNewBot} className="cursor-pointer gap-2">
          <Plus className="w-4 h-4" />
          New Application
        </Button>
      </motion.div>
    )
  }

  const running = bots.filter(b => b.status === 'RUNNING').length

  return (
    <>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[12px] text-muted-foreground">{bots.length} application{bots.length !== 1 ? 's' : ''}</span>
        {running > 0 && (
          <>
            <span className="text-muted-foreground/30">·</span>
            <span className="text-[12px] text-emerald-500">{running} running</span>
          </>
        )}
      </div>

      <Card className="overflow-hidden border-border/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-5 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Application</th>
              <th className="text-left px-5 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Memory</th>
              <th className="text-left px-5 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Created</th>
              <th className="text-right px-5 py-3 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {bots.map((bot, index) => (
                <motion.tr
                  key={bot.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onSelectBot(bot)}
                  className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors cursor-pointer group"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <LanguageIcon language={bot.language} size={30} />
                      <div>
                        <p className="text-[13px] font-medium text-foreground/80 group-hover:text-foreground transition-colors">{bot.name}</p>
                        {bot.description && <p className="text-[11px] text-muted-foreground mt-0.5">{bot.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><StatusBadge status={bot.status} /></td>
                  <td className="px-5 py-3.5 text-[13px] text-muted-foreground">{bot.memory} MB</td>
                  <td className="px-5 py-3.5 text-[13px] text-muted-foreground">
                    {new Date(bot.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3.5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer text-muted-foreground hover:text-foreground"
                        onClick={e => { e.stopPropagation(); setLogsBot({ id: bot.id, name: bot.name }) }}>
                        <ScrollText className="w-3.5 h-3.5" />
                      </Button>
                      {bot.status === 'RUNNING' && (
                        <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-yellow-400 cursor-pointer text-muted-foreground"
                          onClick={e => handleStop(e, bot.id)} disabled={!!actionLoading}>
                          {actionLoading === bot.id + '-stop' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Square className="w-3.5 h-3.5" />}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-primary cursor-pointer text-muted-foreground"
                        onClick={e => handleRestart(e, bot.id)} disabled={!!actionLoading}>
                        {actionLoading === bot.id + '-restart' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7 hover:text-destructive cursor-pointer text-muted-foreground"
                        onClick={e => { e.stopPropagation(); setConfirmDelete(bot.id) }} disabled={!!actionLoading}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </Card>

      {logsBot && (
        <BotLogs botId={logsBot.id} botName={logsBot.name} onClose={() => setLogsBot(null)} />
      )}

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
