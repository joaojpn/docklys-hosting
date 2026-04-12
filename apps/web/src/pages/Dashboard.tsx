import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { api } from '../services/api'
import { Plus, Search, RefreshCw } from 'lucide-react'
import { BotList } from '../components/dashboard/BotList'
import { DeployBot } from '../components/dashboard/DeployBot'
import { SuccessModal } from '../components/dashboard/SuccessModal'
import { BotDetails } from './BotDetails'
import { ProfilePage } from './ProfilePage'
import { Header } from '../components/Header'
import { PageTransition } from '../components/PageTransition'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { useAuth } from '../contexts/AuthContext'

export type Bot = {
  id: string
  name: string
  description?: string
  memory: number
  status: 'RUNNING' | 'STOPPED' | 'ERROR' | 'DEPLOYING'
  language?: 'python' | 'node'
  startCommand: string
  createdAt: string
}

export type DeployedBot = {
  id: string
  name: string
  memory: number
  language: string
  startCommand: string
}

export function Dashboard() {
  const { user } = useAuth()
  const [view, setView] = useState<'list' | 'deploy' | 'details' | 'profile'>('list')
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [successData, setSuccessData] = useState<DeployedBot | null>(null)
  const [selectedBot, setSelectedBot] = useState<Bot | null>(null)
  const [search, setSearch] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'memory' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [statusFilter, setStatusFilter] = useState<'all' | 'RUNNING' | 'STOPPED'>('all')

  const fetchBots = useCallback(async (silent = false) => {
    if (!silent) setLoading(true)
    try {
      const response = await api.get('/bots')
      setBots(response.data.bots || [])
    } catch (error) {
      console.error('Failed to fetch bots:', error)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => { fetchBots() }, [fetchBots])

  useEffect(() => {
    if (view !== 'list') return
    const interval = setInterval(() => fetchBots(true), 10000)
    return () => clearInterval(interval)
  }, [view, fetchBots])

  const handleDeploySuccess = (bot: DeployedBot) => {
    setSuccessData(bot)
    setView('list')
    fetchBots()
  }

  const filteredBots = bots
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    .filter(b => statusFilter === 'all' ? true : b.status === statusFilter)
    .sort((a, b) => {
      let valA: any = a[sortBy]
      let valB: any = b[sortBy]
      if (sortBy === 'name') { valA = valA.toLowerCase(); valB = valB.toLowerCase() }
      if (sortOrder === 'asc') return valA > valB ? 1 : -1
      return valA < valB ? 1 : -1
    })

  const running = bots.filter(b => b.status === 'RUNNING').length
  const stopped = bots.filter(b => b.status !== 'RUNNING').length

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header
        onLogoClick={() => setView('list')}
        onProfileClick={() => setView('profile')}
        isProfileActive={view === 'profile'}
        currentView={view}
      />

      {/* Early Access Banner */}
      <div className="bg-blue-600/10 border-b border-blue-500/20 py-2.5">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-semibold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">Early Access</span>
            <p className="text-[12px] text-blue-300/80">Docklys is in early access — features may change. We appreciate your feedback.</p>
          </div>
          <a href="https://discord.gg/ke5V4NeQ49" target="_blank" rel="noopener noreferrer"
            className="text-[12px] text-blue-400 hover:text-blue-300 transition-colors cursor-pointer shrink-0">
            Share feedback →
          </a>
        </div>
      </div>

      <AnimatePresence mode="sync">
        {view === 'list' && (
          <PageTransition key="list">
            <main className="max-w-5xl mx-auto px-6 py-8 w-full">

              {/* Workspace */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <p className="text-[12px] text-muted-foreground mb-1">Workspace</p>
                  <div className="flex items-center gap-2">
                    <h1 className="text-[22px] font-semibold tracking-tight" style={{ fontFamily: 'Geist, sans-serif' }}>
                      {user?.name}
                    </h1>
                    <span className="text-[10px] font-semibold bg-muted text-muted-foreground px-2 py-0.5 rounded-md uppercase tracking-wide">
                      Free
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/40 font-mono mt-0.5">{user?.id}</p>
                </div>

              </div>

              {/* Search */}
              <div className="flex items-center gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search applications..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 text-[13px] cursor-text h-9"
                  />
                </div>
                <div className="relative shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilter(!showFilter)}
                    className={`cursor-pointer gap-1.5 text-[13px] h-9 px-4 transition-colors ${showFilter || statusFilter !== 'all' ? 'border-blue-500/50 text-blue-400' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                    Filter
                    {statusFilter !== 'all' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />}
                  </Button>

                  {showFilter && (
                    <div className="absolute top-10 left-0 z-50 w-56 bg-card border border-border/50 rounded-xl shadow-xl p-3 space-y-3">
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Status</p>
                        <div className="space-y-1">
                          {(['all', 'RUNNING', 'STOPPED'] as const).map(s => (
                            <button key={s} onClick={() => setStatusFilter(s)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${statusFilter === s ? 'bg-blue-600/20 text-blue-400' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                              {s === 'all' ? 'All' : s === 'RUNNING' ? '● Running' : '● Stopped'}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-px bg-border/40" />
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Sort by</p>
                        <div className="space-y-1">
                          {([['name', 'Name'], ['status', 'Status'], ['memory', 'Memory'], ['createdAt', 'Date created']] as const).map(([val, label]) => (
                            <button key={val} onClick={() => setSortBy(val)}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${sortBy === val ? 'bg-blue-600/20 text-blue-400' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}>
                              {label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="h-px bg-border/40" />
                      <div>
                        <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-2">Order</p>
                        <div className="flex gap-1.5">
                          <button onClick={() => setSortOrder('asc')}
                            className={`flex-1 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${sortOrder === 'asc' ? 'bg-blue-600/20 text-blue-400' : 'text-muted-foreground hover:bg-muted/50'}`}>
                            A → Z
                          </button>
                          <button onClick={() => setSortOrder('desc')}
                            className={`flex-1 py-1.5 rounded-md text-[12px] transition-colors cursor-pointer ${sortOrder === 'desc' ? 'bg-blue-600/20 text-blue-400' : 'text-muted-foreground hover:bg-muted/50'}`}>
                            Z → A
                          </button>
                        </div>
                      </div>
                      <button onClick={() => { setStatusFilter('all'); setSortBy('createdAt'); setSortOrder('desc') }}
                        className="w-full text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-pointer pt-1">
                        Reset filters
                      </button>
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => setView('deploy')}
                  size="sm"
                  className="cursor-pointer gap-1.5 bg-blue-600 hover:bg-blue-500 text-[13px] h-9 px-4 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  New Application
                </Button>
              </div>

              <BotList
                bots={filteredBots}
                loading={loading}
                onNewBot={() => setView('deploy')}
                onRefresh={() => fetchBots()}
                onSelectBot={(bot) => { setSelectedBot(bot); setView('details') }}
              />
            </main>

            {!loading && bots.length > 0 && (
              <div className="border-t border-border/20 py-2.5 mt-auto">
                <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground/40">
                    {bots.length} application{bots.length !== 1 ? 's' : ''}
                    {search && filteredBots.length !== bots.length && ` · ${filteredBots.length} matching`}
                  </p>
                  <div className="flex items-center gap-4 text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-500/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      {running} online
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 inline-block" />
                      {stopped} offline
                    </span>
                  </div>
                </div>
              </div>
            )}
          </PageTransition>
        )}

        {view === 'deploy' && (
          <PageTransition key="deploy">
            <DeployBot onBack={() => setView('list')} onSuccess={handleDeploySuccess} />
          </PageTransition>
        )}

        {view === 'details' && selectedBot && (
          <PageTransition key="details">
            <BotDetails
              bot={selectedBot}
              onBack={() => { setView('list'); fetchBots() }}
              onDelete={() => { setView('list'); fetchBots() }}
            />
          </PageTransition>
        )}

        {view === 'profile' && (
          <PageTransition key="profile">
            <ProfilePage onBack={() => setView('list')} />
          </PageTransition>
        )}
      </AnimatePresence>

      {successData && (
        <SuccessModal
          data={successData}
          onClose={() => setSuccessData(null)}
          onDeploy={() => { setSuccessData(null); setView('deploy') }}
        />
      )}
    </div>
  )
}
