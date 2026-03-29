import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { LogOut, RefreshCw, Plus } from 'lucide-react'
import { BotList } from '../components/dashboard/BotList'
import { DeployBot } from '../components/dashboard/DeployBot'
import { SuccessModal } from '../components/dashboard/SuccessModal'

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
  const { user, signOut } = useAuth()
  const [view, setView] = useState<'list' | 'deploy'>('list')
  const [bots, setBots] = useState<Bot[]>([])
  const [loading, setLoading] = useState(true)
  const [successData, setSuccessData] = useState<DeployedBot | null>(null)

  const fetchBots = async () => {
    setLoading(true)
    try {
      const response = await api.get('/bots')
      setBots(response.data.bots || [])
    } catch (error) {
      console.error('Failed to fetch bots:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBots()
  }, [])

  const handleDeploySuccess = (bot: DeployedBot) => {
    setSuccessData(bot)
    setView('list')
    fetchBots()
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* GRID BACKGROUND */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/95 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setView('list')}
          >
            <span className="text-lg font-semibold tracking-tight">Docklys</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-400">
              Hello, <span className="text-white">{user?.name?.split(' ')[0]}</span>
            </span>
            <div className="h-4 w-px bg-white/10" />
            <button
              onClick={signOut}
              className="text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      {view === 'list' && (
        <main className="relative max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
              <p className="text-sm text-zinc-400 mt-1">Manage and monitor your applications in real time.</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchBots}
                className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-md transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Refresh
              </button>
              <button
                onClick={() => setView('deploy')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                New Application
              </button>
            </div>
          </div>

          <BotList
            bots={bots}
            loading={loading}
            onNewBot={() => setView('deploy')}
            onRefresh={fetchBots}
          />
        </main>
      )}

      {view === 'deploy' && (
        <DeployBot onBack={() => setView('list')} onSuccess={handleDeploySuccess} />
      )}

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
