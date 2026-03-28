import { Bot } from '../../pages/Dashboard'
import { Loader2, Plus, Rocket } from 'lucide-react'

const PythonIcon = () => (
  <div className="w-8 h-8 rounded-md bg-[#3776AB]/20 border border-[#3776AB]/30 flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#3776AB">
      <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.007 2.752h5.814v.826H3.9S0 5.789 0 11.969c0 6.18 3.403 5.963 3.403 5.963h2.031v-2.868s-.109-3.403 3.347-3.403h5.766s3.24.052 3.24-3.13V3.347S18.28 0 11.914 0zm-3.21 1.875a1.031 1.031 0 1 1 0 2.063 1.031 1.031 0 0 1 0-2.063z"/>
      <path d="M12.086 24c6.094 0 5.714-2.656 5.714-2.656l-.007-2.752h-5.814v-.826h8.121S24 18.211 24 12.031c0-6.18-3.403-5.963-3.403-5.963h-2.031v2.868s.109 3.403-3.347 3.403H9.453s-3.24-.052-3.24 3.13v5.184S5.72 24 12.086 24zm3.21-1.875a1.031 1.031 0 1 1 0-2.063 1.031 1.031 0 0 1 0 2.063z"/>
    </svg>
  </div>
)

const NodeIcon = () => (
  <div className="w-8 h-8 rounded-md bg-[#339933]/20 border border-[#339933]/30 flex items-center justify-center">
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#339933">
      <path d="M11.998 24a2.44 2.44 0 0 1-1.218-.324l-3.862-2.286c-.578-.323-.295-.436-.105-.502.769-.269.924-.329 1.742-.796.086-.049.199-.031.288.019l2.97 1.762c.107.058.258.058.357 0l11.566-6.678c.107-.061.174-.185.174-.312V7.148c0-.132-.067-.252-.177-.317L12.18 .156a.365.365 0 0 0-.357 0L.258 6.831C.145 6.898.077 7.02.077 7.148v13.35c0 .128.068.25.18.314l3.17 1.83c1.72.86 2.772-.153 2.772-1.17V8.233c0-.188.15-.335.34-.335h1.47c.185 0 .337.147.337.335v13.24c0 2.292-1.25 3.607-3.421 3.607-.668 0-1.194 0-2.664-.724L.599 22.59A2.43 2.43 0 0 1 0 20.497V7.148c0-.841.45-1.626 1.18-2.049L12.743.425a2.498 2.498 0 0 1 2.496 0L26.8 7.099A2.432 2.432 0 0 1 27.98 9.148v13.35c0 .843-.453 1.624-1.183 2.047l-11.562 6.678c-.377.212-.8.324-1.237.324z"/>
    </svg>
  </div>
)

const UnknownIcon = () => (
  <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
    <span className="text-zinc-400 text-xs font-bold">?</span>
  </div>
)

const StatusBadge = ({ status }: { status: Bot['status'] }) => {
  const config = {
    RUNNING: { label: 'Running', class: 'bg-green-500/10 text-green-400 border-green-500/20' },
    STOPPED: { label: 'Stopped', class: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' },
    ERROR: { label: 'Error', class: 'bg-red-500/10 text-red-400 border-red-500/20' },
    DEPLOYING: { label: 'Deploying', class: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  }
  const { label, class: cls } = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${cls}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

type Props = {
  bots: Bot[]
  loading: boolean
  onNewBot: () => void
}

export function BotList({ bots, loading, onNewBot }: Props) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
      </div>
    )
  }

  if (bots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900/80 border border-white/5 flex items-center justify-center mb-6">
          <Rocket className="w-7 h-7 text-zinc-600" />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">No applications yet</h2>
        <p className="text-sm text-zinc-500 max-w-xs mb-6">
          Deploy your first bot in seconds — just zip your project and upload.
        </p>
        <div className="bg-zinc-900/60 border border-white/5 rounded-xl px-5 py-4 text-left mb-8 font-mono text-xs space-y-0.5">
          <p className="text-zinc-500 mb-2 font-sans">Required zip structure:</p>
          <p className="text-zinc-400">your-bot/</p>
          <p className="text-zinc-400">├── main.py <span className="text-zinc-600"># or index.js</span></p>
          <p className="text-zinc-400">├── requirements.txt <span className="text-zinc-600"># or package.json</span></p>
          <p className="text-zinc-400">└── docklys.config</p>
        </div>
        <button
          onClick={onNewBot}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          New Application
        </button>
      </div>
    )
  }

  const running = bots.filter(b => b.status === 'RUNNING').length
  const stopped = bots.filter(b => b.status !== 'RUNNING').length

  return (
    <div className="border border-white/5 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm font-medium">My Applications</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-green-400">{running} Running</span>
          <span className="text-zinc-600">•</span>
          <span className="text-zinc-400">{stopped} Stopped</span>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-white/5">
            <th className="text-left px-6 py-3 text-xs text-zinc-500 font-medium">NO</th>
            <th className="text-left px-6 py-3 text-xs text-zinc-500 font-medium">APPLICATION</th>
            <th className="text-left px-6 py-3 text-xs text-zinc-500 font-medium">UPTIME</th>
            <th className="text-left px-6 py-3 text-xs text-zinc-500 font-medium">CREATED</th>
            <th className="text-left px-6 py-3 text-xs text-zinc-500 font-medium">MEMORY</th>
            <th className="text-left px-6 py-3 text-xs text-zinc-500 font-medium">STATUS</th>
          </tr>
        </thead>
        <tbody>
          {bots.map((bot, index) => (
            <tr key={bot.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="px-6 py-4 text-xs text-zinc-600">
                {String(index + 1).padStart(2, '0')}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {bot.language === 'python' ? <PythonIcon /> : bot.language === 'node' ? <NodeIcon /> : <UnknownIcon />}
                  <div>
                    <p className="text-sm font-medium text-white">{bot.name}</p>
                    {bot.description && <p className="text-xs text-zinc-500 mt-0.5">{bot.description}</p>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-zinc-400">{bot.uptime || '—'}</td>
              <td className="px-6 py-4 text-sm text-zinc-400">
                {new Date(bot.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
              </td>
              <td className="px-6 py-4 text-sm text-zinc-400">{bot.memory} MB</td>
              <td className="px-6 py-4">
                <StatusBadge status={bot.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
