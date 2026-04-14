import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { api } from '../services/api'
import { ArrowLeft, Loader2, Copy, CheckCircle, Smartphone, Key, Shield } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

type Step = 'intro' | 'qrcode' | 'recovery' | 'confirm' | 'success'

type Props = {
  onBack: () => void
  onSuccess: () => void
}

export function TwoFactorSetup({ onBack, onSuccess }: Props) {
  const [step, setStep] = useState<Step>('intro')
  const [qrCode, setQrCode] = useState('')
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([])
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [savedCodes, setSavedCodes] = useState(false)

  const steps: Step[] = ['intro', 'qrcode', 'recovery', 'confirm']
  const currentIndex = steps.indexOf(step)

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/2fa/generate')
      setQrCode(res.data.qrCodeDataUrl)
      setRecoveryCodes(res.data.recoveryCodes)
      setStep('qrcode')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate 2FA setup.')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirm = async () => {
    setLoading(true)
    setError('')
    try {
      await api.post('/2fa/confirm', { token })
      setStep('success')
      onSuccess()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid token.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCodes = () => {
    navigator.clipboard.writeText(recoveryCodes.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="max-w-xl mx-auto px-6 py-8">
      <motion.button onClick={onBack}
        className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-8"
        whileHover={{ x: -2 }}>
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Profile
      </motion.button>

      <div className="mb-8">
        <h1 className="text-[22px] font-semibold tracking-tight mb-1" style={{ fontFamily: 'Geist, sans-serif' }}>
          Two-Factor Authentication
        </h1>
        <p className="text-[13px] text-muted-foreground">
          Protect your account with an extra layer of security.
        </p>
      </div>

      {/* Progress bar */}
      {step !== 'success' && (
        <div className="flex items-center gap-0 mb-10">
          {['App setup', 'QR Code', 'Recovery', 'Confirm'].map((label, i) => (
            <div key={label} className="flex items-center flex-1">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all ${
                  i < currentIndex ? 'bg-blue-600 text-white' :
                  i === currentIndex ? 'bg-blue-600 text-white ring-4 ring-blue-600/20' :
                  'bg-muted/40 text-muted-foreground'
                }`}>
                  {i < currentIndex ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
                </div>
                <span className={`text-[10px] font-medium ${i <= currentIndex ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                  {label}
                </span>
              </div>
              {i < 3 && (
                <div className={`h-px flex-1 mb-5 transition-all ${i < currentIndex ? 'bg-blue-600' : 'bg-border/40'}`} />
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">

        {/* Intro */}
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="space-y-6">
            <div className="space-y-3">
              {[
                { icon: Smartphone, title: 'Get an authenticator app', desc: 'Download Google Authenticator, Authy, or any TOTP-compatible app on your phone.' },
                { icon: Key, title: 'Scan the QR code', desc: 'Use your authenticator app to scan the QR code we will show you next.' },
                { icon: Shield, title: 'Save your recovery codes', desc: 'Store your recovery codes somewhere safe. You will need them if you lose access to your app.' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl bg-muted/20 border border-border/30">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium mb-0.5">{item.title}</p>
                    <p className="text-[12px] text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            {error && <p className="text-[12px] text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={onBack} className="cursor-pointer text-[13px]">Cancel</Button>
              <Button onClick={handleGenerate} disabled={loading} className="cursor-pointer text-[13px] bg-blue-600 hover:bg-blue-500">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Get started
              </Button>
            </div>
          </motion.div>
        )}

        {/* QR Code */}
        {step === 'qrcode' && (
          <motion.div key="qrcode" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="space-y-6">
            <div>
              <h2 className="text-[16px] font-semibold mb-1">Scan this QR code</h2>
              <p className="text-[13px] text-muted-foreground">
                Open your authenticator app, tap the + button, and scan the QR code below.
              </p>
            </div>
            {qrCode && (
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-2xl shadow-sm">
                  <img src={qrCode} alt="QR Code" className="w-52 h-52" />
                </div>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('intro')} className="cursor-pointer text-[13px]">Back</Button>
              <Button onClick={() => setStep('recovery')} className="cursor-pointer text-[13px] bg-blue-600 hover:bg-blue-500">
                I have scanned the QR code
              </Button>
            </div>
          </motion.div>
        )}

        {/* Recovery codes */}
        {step === 'recovery' && (
          <motion.div key="recovery" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="space-y-5">
            <div>
              <h2 className="text-[16px] font-semibold mb-1">Save your recovery codes</h2>
              <p className="text-[13px] text-muted-foreground">
                If you lose access to your authenticator app, you can use one of these codes to sign in.
                Each code can only be used once.
              </p>
            </div>
            <div className="bg-muted/20 border border-border/40 rounded-xl p-5">
              <div className="grid grid-cols-2 gap-y-2 gap-x-6 font-mono text-[13px] mb-4">
                {recoveryCodes.map(code => (
                  <span key={code} className="text-foreground/80 tracking-wider">{code}</span>
                ))}
              </div>
              <button onClick={handleCopyCodes}
                className="flex items-center gap-1.5 text-[12px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy all codes'}
              </button>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={savedCodes} onChange={e => setSavedCodes(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer accent-blue-600" />
              <span className="text-[13px] text-muted-foreground">I have saved my recovery codes in a safe place</span>
            </label>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('qrcode')} className="cursor-pointer text-[13px]">Back</Button>
              <Button onClick={() => setStep('confirm')} disabled={!savedCodes}
                className="cursor-pointer text-[13px] bg-blue-600 hover:bg-blue-500 disabled:opacity-40">
                Continue
              </Button>
            </div>
          </motion.div>
        )}

        {/* Confirm */}
        {step === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            className="space-y-5">
            <div>
              <h2 className="text-[16px] font-semibold mb-1">Confirm your setup</h2>
              <p className="text-[13px] text-muted-foreground">
                Enter the 6-digit code from your authenticator app to verify and activate 2FA.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium">Authenticator code</label>
              <Input
                placeholder="000000"
                value={token}
                onChange={e => setToken(e.target.value.replace(/\D/g, ''))}
                maxLength={6}
                className="text-[16px] cursor-text w-40 font-mono tracking-[0.3em] text-center h-11"
                autoFocus
              />
              {error && <p className="text-[12px] text-destructive">{error}</p>}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('recovery')} className="cursor-pointer text-[13px]">Back</Button>
              <Button onClick={handleConfirm} disabled={loading || token.length !== 6}
                className="cursor-pointer text-[13px] bg-blue-600 hover:bg-blue-500">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                Activate 2FA
              </Button>
            </div>
          </motion.div>
        )}

        {/* Success */}
        {step === 'success' && (
          <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-8 gap-4">
            <motion.div
              className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"
              initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}>
              <CheckCircle className="w-8 h-8 text-emerald-500" />
            </motion.div>
            <div>
              <h2 className="text-[18px] font-semibold mb-1">2FA is now active!</h2>
              <p className="text-[13px] text-muted-foreground">
                Your account is now protected with two-factor authentication.
              </p>
            </div>
            <Button onClick={onBack} className="cursor-pointer text-[13px] bg-blue-600 hover:bg-blue-500 mt-2">
              Back to Profile
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
