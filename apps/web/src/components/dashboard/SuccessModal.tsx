import { X, CheckCircle } from 'lucide-react'
import { DeployedBot } from '../../pages/Dashboard'

type Props = {
  data: DeployedBot
  onClose: () => void
  onDeploy: () => void
}

export function SuccessModal({ data, onClose, onDeploy }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-8 w-full max-w-md mx-4">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Application deployed</h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                <span className="text-white font-medium">{data.name}</span> is now running
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Application Name</p>
            <p className="text-sm text-white font-medium">{data.name}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Application ID</p>
            <p className="text-xs text-zinc-300 font-mono truncate">{data.id}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Language</p>
            <p className="text-sm text-white font-medium capitalize">{data.language}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Memory</p>
            <p className="text-sm text-white font-medium">{data.memory} MB</p>
          </div>
          <div className="bg-zinc-800/50 rounded-lg p-3 col-span-2">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wide mb-1">Start Command</p>
            <p className="text-sm text-zinc-300 font-mono">{data.startCommand}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onDeploy}
            className="flex-1 h-10 text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all cursor-pointer"
          >
            Deploy another
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-10 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all cursor-pointer"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
