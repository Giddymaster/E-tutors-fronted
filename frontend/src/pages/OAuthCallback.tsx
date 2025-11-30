import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthToken } from '../utils/api'

export default function OAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      setAuthToken(token)
      window.location.replace('/')
    } else {
      console.warn('OAuth callback missing token', Object.fromEntries(params.entries()))
      setTimeout(() => navigate('/login'), 800)
    }
  }, [navigate])

  return <div>Processing...</div>
}
