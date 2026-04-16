import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { AuthCallback } from './pages/AuthCallback'
import { TermsOfService } from './pages/TermsOfService'
import { PrivacyPolicy } from './pages/PrivacyPolicy'
import { Loader2 } from 'lucide-react'

function Routes() {
  const { signed, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (window.location.pathname === '/auth/callback') {
    return <AuthCallback />
  }
  if (window.location.pathname === '/terms') {
    return <TermsOfService onBack={() => window.history.back()} />
  }
  if (window.location.pathname === '/privacy') {
    return <PrivacyPolicy onBack={() => window.history.back()} />
  }

  if (!signed) {
    return <Login />
  }

  return <Dashboard />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  )
}
