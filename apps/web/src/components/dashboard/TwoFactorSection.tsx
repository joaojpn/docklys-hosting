import { useState } from 'react'
import { api } from '../../services/api'
import { Loader2, ShieldCheck, ShieldOff } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

type Props = {
  enabled: boolean
  onSetup: () => void
  onUpdate: () => void
}

export function TwoFactorSection({ enabled, onSetup, onUpdate }: Props) {
  const [step, setStep] = useState<'idle' | 'disable'>('idle')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDisable = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post('/2fa/disable', { token })
      setStep('idle')
      setToken('')
      onUpdate()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid token.')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'disable') {
    return (
      <div className="space-y-3 max-w-md">
        <p className="text-[13px] font-medium text-destructive">Disable Two-Factor Authentication</p>
        <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-[12px] text-muted-foreground">
          Enter your authenticator code to confirm.
        </div>
        <div className="space-y-1.5">
          <Input placeholder="000000" value={token} onChange={e => setToken(e.target.value)}
            maxLength={6} className="text-[13px] cursor-text w-36 font-mono tracking-widest h-8" />
          {error && <p className="text-[12px] text-destructive">{error}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => { setStep('idle'); setError('') }} className="cursor-pointer text-[13px]">Cancel</Button>
          <Button variant="destructive" size="sm" onClick={handleDisable} disabled={loading || token.length !== 6} className="cursor-pointer text-[13px]">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Disable 2FA'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          {enabled
            ? <ShieldCheck className="w-4 h-4 text-emerald-500" />
            : <ShieldOff className="w-4 h-4 text-muted-foreground" />
          }
          <p className="text-[13px] font-medium">
            Two-Factor Authentication is {enabled ? 'enabled' : 'disabled'}
          </p>
        </div>
        <p className="text-[12px] text-muted-foreground">
          {enabled
            ? 'Your account is protected with an extra layer of security.'
            : 'Add an extra layer of security using an authenticator app.'}
        </p>
      </div>
      {enabled ? (
        <Button variant="outline" size="sm" onClick={() => setStep('disable')}
          className="cursor-pointer text-[13px] shrink-0 ml-4 hover:text-destructive hover:border-destructive/30">
          Disable
        </Button>
      ) : (
        <Button size="sm" onClick={onSetup}
          className="cursor-pointer text-[13px] shrink-0 ml-4 bg-blue-600 hover:bg-blue-500">
          Enable 2FA
        </Button>
      )}
    </div>
  )
}
