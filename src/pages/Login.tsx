import React, { useState } from 'react'
import { Container, TextField, Button, Typography, Box, Alert, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthFooter from '../components/AuthFooter'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({ email: null, password: null })
  const [serverError, setServerError] = useState<string | null>(null)

  const validate = () => {
    const e: any = { email: null, password: null }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Valid email is required'
    if (!password) e.password = 'Password is required'
    setErrors(e)
    return !Object.values(e).some(Boolean)
  }

  const submit = async () => {
    setServerError(null)
    if (!validate()) return
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      console.error(err)
      if ((err as any) && (err as any).validation) {
        const first = (err as any).validation[0]
        if (first && first.param) setErrors((s) => ({ ...s, [first.param]: first.msg }))
        else setServerError((err as any).validation.map((v: any) => v.msg).join('\n'))
      } else {
        setServerError((err as any)?.message || 'Login failed')
      }
    }
  }

  return (
    <Container sx={{ mt: 6 }} maxWidth="xs">
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Log In</Typography>
        <Typography variant="body2" color="text.secondary">Don’t have an account? <Button onClick={() => navigate('/register')}>Sign up for free.</Button></Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {serverError && <Alert severity="error">{serverError}</Alert>}

  <Button variant="outlined" onClick={() => window.location.href = '/api/auth/google'}>Log in with Google</Button>
  <Button variant="outlined" onClick={() => alert('Apple OAuth not configured')}>Log in with Apple</Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">Or</Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email || ''} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password || ''} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button variant="contained" onClick={submit}>Log in</Button>
          <Button variant="text">Forgot username or password?</Button>
        </Box>
      </Box>

      <AuthFooter />
    </Container>
  )
}
