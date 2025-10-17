import React, { createContext, useContext, useEffect, useState } from 'react'
import api, { setAuthToken, getAuthToken, logout as apiLogout } from '../utils/api'

type Role = 'STUDENT' | 'TUTOR' | 'ADMIN'

interface User {
  id: number
  name: string
  email: string
  role: Role
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role?: Role) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = async () => {
    const token = getAuthToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await api.get('/auth/me')
      setUser(res.data.user)
    } catch (err) {
      console.error('fetchMe error', err)
      apiLogout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    const { token, user } = res.data
    setAuthToken(token)
    setUser(user)
  }

  const register = async (name: string, email: string, password: string, role: Role = 'STUDENT') => {
  const res = await api.post('/auth/register', { name, email, password, role })
  const { token, user } = res.data
  setAuthToken(token)
  setUser(user)
  }

  const logout = () => {
    apiLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
