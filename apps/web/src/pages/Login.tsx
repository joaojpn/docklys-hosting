import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Loader2, ArrowRight, CheckCircle } from 'lucide-react'
import { api } from '../services/api'

const GithubIcon = () => (
  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z" />
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
  const [successMsg, setSuccessMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccessMsg('')

    try {
      if (isLogin) {
        await signIn({ email, password })
      } else {
        await api.post('/auth/register', { name, email, password })
        setSuccessMsg('Account created! Signing in...')
        setTimeout(async () => {
          await signIn({ email, password })
        }, 1500)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex bg-[#050505] text-white font-sans">

      {/* LEFT COLUMN */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 sm:px-12 md:px-16 py-12 z-10 relative border-r border-white/5">
        <div className="max-w-sm w-full mx-auto space-y-8">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-sm text-zinc-400">
              {isLogin
                ? 'Enter your credentials to access your dashboard.'
                : 'Start hosting your bots in seconds.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300">Name</label>
                <input
                  placeholder="John Doe"
                  className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 h-10 text-sm placeholder:text-zinc-600 rounded-md px-3 outline-none transition-all"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required={!isLogin}
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300">Email address</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 h-10 text-sm placeholder:text-zinc-600 rounded-md px-3 outline-none transition-all"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-zinc-300">Password</label>
                {isLogin && <a href="#" className="text-xs text-blue-500 hover:text-blue-400 transition-colors cursor-pointer">Forgot password?</a>}
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-zinc-900/50 border border-zinc-800 focus:border-blue-500/50 h-10 text-sm placeholder:text-zinc-600 rounded-md px-3 outline-none transition-all"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-md bg-red-500/5 border border-red-500/10 text-red-500 text-xs text-center">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-md bg-green-500/5 border border-green-500/10 text-green-500 text-xs text-center flex items-center justify-center gap-2">
                <CheckCircle className="w-3 h-3" /> {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 h-10 text-sm font-medium text-white rounded-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  {isLogin ? 'Sign in' : 'Create account'}
                  <ArrowRight className="w-4 h-4 ml-2 opacity-70" />
                </>
              )}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
                <span className="bg-[#050505] px-2 text-zinc-500">Or continue with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={signInWithGithub}
              className="w-full flex items-center justify-center bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 h-10 text-sm rounded-md transition-all cursor-pointer"
            >
              <GithubIcon /> GitHub
            </button>
          </form>

          <p className="text-center text-sm text-zinc-500">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccessMsg('') }}
              className="text-white hover:text-blue-400 font-medium transition-colors cursor-pointer"
            >
              {isLogin ? 'Create account' : 'Sign in'}
            </button>
          </p>
        </div>

        <div className="absolute bottom-8 left-0 w-full text-center">
          <div className="flex justify-center gap-6 text-xs text-zinc-600">
            <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">Documentation</a>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="hidden lg:flex w-[55%] bg-black relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="relative z-10 max-w-lg w-full text-center px-8">
          <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
            Secure, isolated infrastructure ready for <span className="text-blue-500">production</span>.
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Deploy Discord, Telegram, and WhatsApp bots with no configuration. Focus on your code — we handle the rest.
          </p>
        </div>
      </div>
    </div>
  )
}
