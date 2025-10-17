import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { setAuthToken } from '../utils/api'

export default function OAuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    // Expect server to redirect to /oauth/callback?token=...
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    if (token) {
      setAuthToken(token)
      // show token briefly (debug) then navigate
      setTimeout(() => navigate('/'), 500)
    } else {
      // show query for debugging then send to login
      console.warn('OAuth callback missing token', Object.fromEntries(params.entries()))
      setTimeout(() => navigate('/login'), 800)
    }
  }, [navigate])

  return <div>Processing...</div>
}
