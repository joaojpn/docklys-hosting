import React, { createContext, useState, useContext, useEffect } from 'react'
import { api } from '../services/api'

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextData {
  signed: boolean
  user: User | null
  signIn: (data: { email: string; password: string }) => Promise<{ requires2FA: boolean; tempToken?: string }>
  signInWithGithub: () => void
  signOut: () => void
  updateUser: (data: Partial<User>) => void
  loading: boolean
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem('@Docklys:user')
    const storedToken = localStorage.getItem('@Docklys:token')
    if (storedToken && storedUser) {
      api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  async function signIn({ email, password }: { email: string; password: string }) {
    const response = await api.post('/auth/login', { email, password })
    const { token, user, requires2FA, tempToken } = response.data

    if (requires2FA) {
      return { requires2FA: true, tempToken }
    }

    localStorage.setItem('@Docklys:user', JSON.stringify(user))
    localStorage.setItem('@Docklys:token', token)
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    setUser(user)
    return { requires2FA: false }
  }

  function signInWithGithub() {
    window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:3333'}/auth/github`
  }

  function signOut() {
    localStorage.removeItem('@Docklys:user')
    localStorage.removeItem('@Docklys:token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  function updateUser(data: Partial<User>) {
    if (!user) return
    const updated = { ...user, ...data }
    setUser(updated)
    localStorage.setItem('@Docklys:user', JSON.stringify(updated))
  }

  return (
    <AuthContext.Provider value={{ signed: !!user, user, signIn, signInWithGithub, signOut, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
