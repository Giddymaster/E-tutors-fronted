import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

interface Props {
  children: React.ReactElement
  requiredRole?: 'STUDENT' | 'TUTOR' | 'ADMIN'
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>

  if (!user) return <Navigate to="/login" replace />

  if (requiredRole && user.role !== requiredRole) return <Navigate to="/" replace />

  return children
}
