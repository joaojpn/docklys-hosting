import { motion } from 'framer-motion'
import { CheckCircle, X, Rocket } from 'lucide-react'
import { DeployedBot } from '../../pages/Dashboard'
import { Button } from '../ui/button'

type Props = {
  data: DeployedBot
  onClose: () => void
  onDeploy: () => void
}

export function SuccessModal({ data, onClose, onDeploy }: Props) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={e => e.stopPropagation()}
        className="bg-card border border-border/50 rounded-2xl w-full max-w-lg mx-4 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-[20px] font-bold tracking-tight" style={{ fontFamily: 'Geist, sans-serif' }}>
                Application uploaded successfully
              </h2>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer mt-1 ml-4 shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[13px] text-muted-foreground">
            Your application <span className="text-foreground font-semibold">{data.name}</span> has been successfully submitted.
          </p>
        </div>

        {/* Info grid */}
        <div className="px-6 pb-6">
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Application name</p>
              <p className="text-[15px] font-semibold">{data.name}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Application ID</p>
              <p className="text-[12px] font-mono text-muted-foreground truncate">{data.id}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Language</p>
              <p className="text-[15px] font-semibold">{data.language === 'python' ? 'Python' : 'Node.js'}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Memory</p>
              <p className="text-[15px] font-semibold">{data.memory} MB</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">Start command</p>
              <p className="text-[13px] font-mono">{data.startCommand}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between">
          <button
            onClick={onDeploy}
            className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Send another application
          </button>
          <Button onClick={onClose} className="cursor-pointer text-[13px] bg-blue-600 hover:bg-blue-500">
            Go to application
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
