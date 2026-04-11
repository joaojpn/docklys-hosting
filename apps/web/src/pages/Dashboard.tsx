import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import { api } from '../services/api'
import { RefreshCw, Plus, Search } from 'lucide-react'
import { BotList } from '../components/dashboard/BotList'
import { DeployBot } from '../components/dashboard/DeployBot'
import { SuccessModal } from '../components/dashboard/SuccessModal'
import { BotDetails } from './BotDetails'
import { ProfilePage } from './ProfilePage'
import { Header } from '../components/Header'
import { PageTransition } from '../components/PageTransition'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
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

  const filteredBots = bots.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  )

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

      <AnimatePresence mode="sync">
        {view === 'list' && (
          <PageTransition key="list">
            <main className="max-w-6xl mx-auto px-6 py-8 w-full">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-[13px]">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-medium">{user?.name}</span>
                      <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium uppercase tracking-wide">
                        Your Account
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground/50 font-mono">{user?.id}</p>
                  </div>
                </div>
                <Button size="sm" onClick={() => setView('deploy')} className="cursor-pointer gap-1.5 text-[13px]">
                  <Plus className="w-3.5 h-3.5" />
                  New Application
                </Button>
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Search in applications..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 text-[13px] cursor-text"
                  />
                </div>
                <Button variant="outline" size="sm" onClick={() => fetchBots()} className="cursor-pointer gap-1.5 text-[13px] shrink-0">
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
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
              <div className="border-t border-border/40 py-3 mt-auto">
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                  <p className="text-[12px] text-muted-foreground">
                    Total of <span className="text-foreground font-medium">{bots.length}</span> application{bots.length !== 1 ? 's' : ''}
                    {search && filteredBots.length !== bots.length && (
                      <span className="ml-1">· <span className="text-foreground font-medium">{filteredBots.length}</span> matching</span>
                    )}
                  </p>
                  <div className="flex items-center gap-4 text-[12px]">
                    <span className="flex items-center gap-1.5 text-emerald-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      {running} online
                    </span>
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 inline-block" />
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
