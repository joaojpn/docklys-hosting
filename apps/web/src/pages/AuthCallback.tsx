import { useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function AuthCallback() {
  const { signIn } = useAuth()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const name = params.get('name')
    const email = params.get('email')
    const id = params.get('id')

    if (token && name && email && id) {
      localStorage.setItem('@Docklys:token', token)
      localStorage.setItem('@Docklys:user', JSON.stringify({ id, name, email }))
      window.location.href = '/'
    } else {
      window.location.href = '/login?error=github_failed'
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <p className="text-zinc-400 text-sm">Authenticating...</p>
    </div>
  )
}
