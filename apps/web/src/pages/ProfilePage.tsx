import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'
import { Loader2, CheckCircle, Trash2, User, Lock, Link, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Separator } from '../components/ui/separator'

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12c0-5.523-4.477-10-10-10z"/>
  </svg>
)

type Profile = {
  id: string
  name: string
  email: string
  githubLogin: string | null
  hasPassword: boolean
  hasGithub: boolean
  createdAt: string
}

type Props = { onBack: () => void }
type Section = 'account' | 'security' | 'connections' | 'danger'

export function ProfilePage({ onBack }: Props) {
  const { signOut, updateUser } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState<Section>('account')

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
    setNameLoading(true); setNameError(''); setNameSuccess(false)
    try {
      await api.patch('/profile', { name })
      updateUser({ name })
      setNameSuccess(true)
      setTimeout(() => setNameSuccess(false), 3000)
    } catch (err: any) { setNameError(err.response?.data?.error || 'Failed to update name.') }
    finally { setNameLoading(false) }
  }

  const handleUpdatePassword = async () => {
    setPasswordLoading(true); setPasswordError(''); setPasswordSuccess(false)
    try {
      await api.patch('/profile/password', { currentPassword, newPassword })
      setPasswordSuccess(true); setCurrentPassword(''); setNewPassword('')
      setTimeout(() => setPasswordSuccess(false), 3000)
    } catch (err: any) { setPasswordError(err.response?.data?.error || 'Failed to update password.') }
    finally { setPasswordLoading(false) }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    try { await api.delete('/profile'); signOut() }
    catch (err: any) { alert(err.response?.data?.error || 'Failed to delete account.'); setDeleteLoading(false) }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-32"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
  }

  const navItems = [
    { id: 'account' as Section, label: 'My Account', icon: User },
    { id: 'security' as Section, label: 'Security', icon: Lock },
    { id: 'connections' as Section, label: 'Connections', icon: Link },
    { id: 'danger' as Section, label: 'Danger zone', icon: AlertTriangle, destructive: true },
  ]

  return (
    <main className="max-w-5xl mx-auto px-6 py-8">
      <button onClick={onBack} className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer mb-8">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Dashboard
      </button>

      <div className="flex gap-10">
        <aside className="w-52 shrink-0">
          <div className="flex items-center gap-3 mb-6">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-[13px]">
                {profile?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[13px] font-medium truncate">{profile?.name}</p>
              <p className="text-[11px] text-muted-foreground truncate">{profile?.email}</p>
            </div>
          </div>
          <nav className="space-y-0.5">
            {navItems.map(item => (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors cursor-pointer text-left ${
                  activeSection === item.id ? 'bg-accent text-accent-foreground font-medium'
                  : item.destructive ? 'text-destructive/70 hover:text-destructive hover:bg-destructive/10'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}>
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 min-w-0">
          {activeSection === 'account' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Geist, sans-serif' }}>Account Information</h2>
                <p className="text-[13px] text-muted-foreground">Manage your account details.</p>
              </div>
              <Separator />
              <div className="space-y-2 max-w-md">
                <p className="text-[13px] font-medium mb-1">Display name</p>
                <p className="text-[12px] text-muted-foreground mb-3">This is your public display name visible across the platform.</p>
                <div className="flex gap-2">
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" className="text-[13px] cursor-text" />
                  <Button onClick={handleUpdateName} disabled={nameLoading} className="cursor-pointer shrink-0">
                    {nameLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : nameSuccess ? <CheckCircle className="w-4 h-4" /> : 'Save'}
                  </Button>
                </div>
                {nameError && <p className="text-[12px] text-destructive mt-1.5">{nameError}</p>}
              </div>
              <Separator />
              <div className="space-y-2 max-w-md">
                <p className="text-[13px] font-medium mb-1">Email address</p>
                <p className="text-[12px] text-muted-foreground mb-3">Your email is used for login and notifications.</p>
                <Input value={profile?.email} disabled className="text-[13px] text-muted-foreground" />
              </div>
              <Separator />
              <div className="space-y-2 max-w-md">
                <p className="text-[13px] font-medium mb-1">Account ID</p>
                <p className="text-[12px] text-muted-foreground mb-3">Your unique identifier in the Docklys platform.</p>
                <Input value={profile?.id} disabled className="text-[13px] text-muted-foreground font-mono text-[11px]" />
              </div>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Geist, sans-serif' }}>Security</h2>
                <p className="text-[13px] text-muted-foreground">Manage your password and security settings.</p>
              </div>
              <Separator />
              {profile?.hasPassword ? (
                <div className="space-y-4 max-w-md">
                  <p className="text-[13px] font-medium mb-1">Change password</p>
                  <p className="text-[12px] text-muted-foreground mb-3">Update your account password.</p>
                  <div className="space-y-2">
                    <Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Current password" className="text-[13px] cursor-text" />
                    <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min. 6 characters)" className="text-[13px] cursor-text" />
                    {passwordError && <p className="text-[12px] text-destructive">{passwordError}</p>}
                    {passwordSuccess && <p className="text-[12px] text-emerald-500 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Password updated successfully.</p>}
                    <Button onClick={handleUpdatePassword} disabled={passwordLoading || !currentPassword || !newPassword} className="cursor-pointer text-[13px]">
                      {passwordLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Update password
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-[13px] text-muted-foreground">Your account uses GitHub OAuth for authentication. No password is set.</p>
              )}
            </div>
          )}

          {activeSection === 'connections' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ fontFamily: 'Geist, sans-serif' }}>Connections</h2>
                <p className="text-[13px] text-muted-foreground">Connect your accounts for easier sign-in.</p>
              </div>
              <Separator />
              <div className="max-w-md">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-muted border border-border flex items-center justify-center">
                      <GithubIcon />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium">GitHub</p>
                      <p className="text-[11px] text-muted-foreground">{profile?.hasGithub ? `Connected as @${profile.githubLogin}` : 'Not connected'}</p>
                    </div>
                  </div>
                  {profile?.hasGithub ? (
                    <div className="flex items-center gap-1.5 text-[12px] text-emerald-500"><CheckCircle className="w-3.5 h-3.5" /> Connected</div>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`} className="cursor-pointer text-[13px]">Connect</Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'danger' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-lg font-semibold mb-1 text-destructive" style={{ fontFamily: 'Geist, sans-serif' }}>Danger zone</h2>
                <p className="text-[13px] text-muted-foreground">Irreversible actions for your account.</p>
              </div>
              <Separator />
              <div className="max-w-md space-y-2">
                <p className="text-[13px] font-medium">Delete account</p>
                <p className="text-[12px] text-muted-foreground">Permanently delete your account, stop all running containers and remove all data. This action cannot be undone.</p>
                {!confirmDelete ? (
                  <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)} className="cursor-pointer gap-2 text-[13px] mt-2">
                    <Trash2 className="w-3.5 h-3.5" /> Delete account
                  </Button>
                ) : (
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={() => setConfirmDelete(false)} className="cursor-pointer text-[13px]">Cancel</Button>
                    <Button variant="destructive" size="sm" onClick={handleDeleteAccount} disabled={deleteLoading} className="cursor-pointer text-[13px]">
                      {deleteLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                      Yes, delete my account
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
