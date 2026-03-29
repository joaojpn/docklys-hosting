import { useEffect, useRef, useState } from 'react'
import { X, Terminal } from 'lucide-react'

type Props = {
  botId: string
  botName: string
  onClose: () => void
}

export function BotLogs({ botId, botName, onClose }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333'

  useEffect(() => {
    const token = localStorage.getItem('@Docklys:token')
    if (!token) return

    const url = `${apiUrl}/bots/${botId}/logs?token=${token}`
    const es = new EventSource(url)

    es.onopen = () => setConnected(true)

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data)
        if (data.line) {
          setLines(prev => [...prev.slice(-500), data.line])
        }
      } catch {}
    }

    es.onerror = () => {
      setConnected(false)
      es.close()
    }

    return () => {
      es.close()
    }
  }, [botId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-3xl mx-4 flex flex-col" style={{ height: '80vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Terminal className="w-4 h-4 text-zinc-400" />
            <span className="text-sm font-medium text-white">{botName}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${connected ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}`}>
              {connected ? 'Live' : 'Disconnected'}
            </span>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Logs */}
        <div className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-0.5">
          {lines.length === 0 ? (
            <p className="text-zinc-600">Waiting for logs...</p>
          ) : (
            lines.map((line, i) => (
              <div key={i} className="text-zinc-300 leading-5">
                <span className="text-zinc-600 mr-2 select-none">{String(i + 1).padStart(4, ' ')}</span>
                {line}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>

      </div>
    </div>
  )
}
