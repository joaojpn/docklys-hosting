import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { Loader2, CheckCircle, Shield, Trash2, ArrowLeft } from 'lucide-react'

type Profile = {
  id: string
  name: string
  email: string
  githubLogin: string | null
  hasPassword: boolean
  hasGithub: boolean
  createdAt: string
}

type Props = {
  onBack: () => void
}

export function ProfilePage({ onBack }: Props) {
  const { signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const [name, setName] = useState('')
  const [nameLoading, setNameLoading] = useState(false)
  const [nameSuccess, setNameSuccess] = useState(false)
  const [nameError, setNameError] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    api.get('/profile').then(res => {
      setProfile(res.data.user)
      setName(res.data.user.name)
    }).finally(() => setLoading(false))
  }, [])

  const handleUpdateName = async () => {
    setNameLoading(true)
    setNameError('')
    setNameSuccess(false)
    try {
      await api.patch('/profile', { name })
      setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 3000)
    } catch (err: any) {
      setNameError(err.response?.data?.error || 'Failed to update name.')
    } finally {
      setNameLoading(false)
    }
  }

  const handleUpdatePassword = async () => {
    setPasswordLoading(true)
    setPasswordError('')
    setPasswordSuccess(false)
    try {
      await api.patch('/profile/password', { currentPassword, newPassword })
      setPasswordSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err: any) {
      setPasswordError(err.response?.data?.error || 'Failed to update password.')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try {
      await api.delete('/profile')
      signOut()
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete account.')
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-600" />
      </div>
    )
  }

  return (
    <main className="relative max-w-2xl mx-auto px-6 py-10">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="text-sm text-zinc-400 mt-1">Manage your account information.</p>
      </div>

      <div className="space-y-4">

        {/* Avatar + info */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-xl font-semibold text-white flex-shrink-0">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-lg font-medium text-white">{profile?.name}</p>
            <p className="text-sm text-zinc-400">{profile?.email}</p>
            <p className="text-xs text-zinc-600 mt-1">
              Member since {new Date(profile?.createdAt || '').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Update name */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
          <h2 className="text-sm font-medium text-white mb-4">Display name</h2>
          <div className="flex gap-3">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              className="flex-1 bg-zinc-800/50 border border-zinc-700 focus:border-blue-500/50 h-10 text-sm text-white placeholder:text-zinc-600 rounded-md px-3 outline-none transition-all"
              placeholder="Your name"
            />
            <button
              onClick={handleUpdateName}
              disabled={nameLoading}
              className="px-4 h-10 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {nameLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : nameSuccess ? <CheckCircle className="w-4 h-4" /> : 'Save'}
            </button>
          </div>
          {nameError && <p className="text-xs text-red-400 mt-2">{nameError}</p>}
        </div>

        {/* Change password */}
        {profile?.hasPassword && (
          <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
            <h2 className="text-sm font-medium text-white mb-4">Change password</h2>
            <div className="space-y-3">
              <input
                type="password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full bg-zinc-800/50 border border-zinc-700 focus:border-blue-500/50 h-10 text-sm text-white placeholder:text-zinc-600 rounded-md px-3 outline-none transition-all"
              />
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New password (min. 6 characters)"
                className="w-full bg-zinc-800/50 border border-zinc-700 focus:border-blue-500/50 h-10 text-sm text-white placeholder:text-zinc-600 rounded-md px-3 outline-none transition-all"
              />
              {passwordError && <p className="text-xs text-red-400">{passwordError}</p>}
              {passwordSuccess && <p className="text-xs text-green-400 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Password updated successfully.</p>}
              <button
                onClick={handleUpdatePassword}
                disabled={passwordLoading || !currentPassword || !newPassword}
                className="px-4 h-10 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update password'}
              </button>
            </div>
          </div>
        )}

        {/* GitHub connection */}
        <div className="bg-zinc-900/50 border border-white/5 rounded-xl p-6">
          <h2 className="text-sm font-medium text-white mb-4">Connections</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-zinc-300"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/></svg>
              </div>
              <div>
                <p className="text-sm text-white">GitHub</p>
                <p className="text-xs text-zinc-500">
                  {profile?.hasGithub ? `Connected as @${profile.githubLogin}` : 'Not connected'}
                </p>
              </div>
            </div>
            {profile?.hasGithub ? (
              <span className="flex items-center gap-1.5 text-xs text-green-400">
                <CheckCircle className="w-3.5 h-3.5" /> Connected
              </span>
            ) : (
              <button
                onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`}
                className="px-3 py-1.5 text-xs font-medium border border-white/10 hover:border-white/20 text-zinc-400 hover:text-white rounded-md transition-all cursor-pointer"
              >
                Connect
              </button>
            )}
          </div>
        </div>

        {/* Delete account */}
        <div className="bg-zinc-900/50 border border-red-500/10 rounded-xl p-6">
          <div className="flex items-start gap-3 mb-4">
            <Shield className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-sm font-medium text-white">Danger zone</h2>
              <p className="text-xs text-zinc-500 mt-0.5">Deleting your account will remove all your applications and data permanently.</p>
            </div>
          </div>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-2 px-4 h-9 text-sm text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-md transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete account
          </button>
        </div>
      </div>

      {/* Delete modal */}
      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm mx-4">
            <h2 className="text-base font-semibold text-white mb-2">Delete account?</h2>
            <p className="text-sm text-zinc-400 mb-6">
              This will permanently delete your account, all applications, and stop all running containers. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(false)}
                className="flex-1 h-10 text-sm text-zinc-400 hover:text-white border border-white/10 rounded-lg transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 h-10 text-sm font-medium bg-red-600 hover:bg-red-500 text-white rounded-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Delete account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
