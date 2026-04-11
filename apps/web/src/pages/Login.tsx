import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import { api } from '../services/api'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Separator } from '../components/ui/separator'

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/>
  </svg>
)

const DocklysLogo = () => (
  <svg width="36" height="28" viewBox="0 0 108 86" fill="none">
    <path d="M38.5 0C59.7 0 34.5 19.3 34.5 43S59.7 86 38.5 86 0 66.7 0 43 17.2 0 38.5 0Z" fill="hsl(var(--primary))"/>
    <path d="M80.1 3C101.7 3 72.1 20.7 72.1 42.5S101.7 82 80.1 82 41 64.3 41 42.5 58.5 3 80.1 3Z" fill="hsl(var(--primary))" opacity=".55"/>
    <path d="M102.6 16C117.3 16 97.2 27.9 97.2 42.5S117.3 69 102.6 69 76 57.1 76 42.5 87.9 16 102.6 16Z" fill="hsl(var(--primary))" opacity=".25"/>
  </svg>
)

export function Login() {
  const { signIn, signInWithGithub } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (isLogin) {
        await signIn({ email, password })
      } else {
        await api.post('/auth/register', { name, email, password })
        await signIn({ email, password })
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Glow blob 1 */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          scale: [1, 1.15, 0.95, 1],
          borderRadius: [
            '60% 40% 70% 30% / 50% 60% 40% 50%',
            '40% 60% 30% 70% / 60% 40% 60% 40%',
            '70% 30% 60% 40% / 40% 50% 60% 50%',
            '60% 40% 70% 30% / 50% 60% 40% 50%',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          width: '500px',
          height: '350px',
          background: 'rgba(37, 99, 235, 0.15)',
          filter: 'blur(70px)',
          position: 'absolute',
          top: 'calc(50% - 175px)',
          left: 'calc(50% - 250px)',
        }}
      />

      {/* Glow blob 2 */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          scale: [1, 0.9, 1.1, 1],
          borderRadius: [
            '40% 60% 30% 70% / 60% 40% 60% 40%',
            '60% 40% 70% 30% / 50% 60% 40% 50%',
            '30% 70% 40% 60% / 40% 60% 50% 50%',
            '40% 60% 30% 70% / 60% 40% 60% 40%',
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        style={{
          width: '350px',
          height: '250px',
          background: 'rgba(99, 102, 241, 0.1)',
          filter: 'blur(60px)',
          position: 'absolute',
          top: 'calc(50% - 175px)',
          left: 'calc(50% - 280px)',
        }}
      />

      <div className="w-full max-w-sm space-y-5 relative z-10">
        <div className="flex justify-center">
          <DocklysLogo />
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center" style={{ fontFamily: 'Geist, sans-serif' }}>
              {isLogin ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-center text-[13px]">
              {isLogin ? 'Sign in to your account to continue.' : 'Start hosting your bots in seconds.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full cursor-pointer gap-2 text-[13px]" onClick={signInWithGithub} type="button">
              <GithubIcon />
              Continue with GitHub
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><Separator /></div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-widest">
                <span className="bg-card px-2 text-muted-foreground">or continue with</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium">Name</label>
                  <Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required={!isLogin} className="text-[13px]" />
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium">Email</label>
                <Input type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="text-[13px]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[13px] font-medium">Password</label>
                <Input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="text-[13px]" />
              </div>
              {error && <p className="text-[12px] text-destructive">{error}</p>}
              <Button type="submit" className="w-full cursor-pointer text-[13px] bg-blue-600 hover:bg-blue-500" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {isLogin ? 'Sign in' : 'Create account'}
              </Button>
            </form>

            <p className="text-center text-[13px] text-muted-foreground">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => { setIsLogin(!isLogin); setError('') }} className="text-foreground hover:underline cursor-pointer font-medium">
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-[11px] text-muted-foreground">
          By continuing, you agree to our{' '}
          <a href="#" className="underline hover:text-foreground transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-foreground transition-colors">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}
