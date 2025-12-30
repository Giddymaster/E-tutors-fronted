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
    try {
      let token = getAuthToken()
      if (!token) {
        try {
          const r = await api.post('/auth/refresh')
          token = r.data?.token
          if (token) setAuthToken(token)
        } catch (err: any) {
          // 401 is expected when user is not logged in - suppress silently
          if (err.response?.status === 401) {
            setLoading(false)
            return
          }
          // Only log other errors
          console.error('Refresh token error:', err)
          setLoading(false)
          return
        }
      }

      if (token) {
        const res = await api.get('/auth/me')
        setUser(res.data.user)
      }
    } catch (err: any) {
      // Suppress 401 here too
      if (err.response?.status === 401) {
        setLoading(false)
        return
      }
      console.error('fetchMe error', err)
      logout()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMe()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password })
    const { token } = res.data
    setAuthToken(token)
    await fetchMe()  // Fetch updated user data
  }

  const register = async (name: string, email: string, password: string, role: Role = 'STUDENT') => {
    const res = await api.post('/auth/register', { name, email, password, role })
    const { token } = res.data
    setAuthToken(token)
    await fetchMe()  // Fetch updated user data
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
