import React, { useState } from 'react'
import { Container, TextField, Button, Typography, Box, Alert, Divider } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthFooter from '../components/AuthFooter'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STUDENT')
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({ name: null, email: null, password: null })
  const [serverError, setServerError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { register } = useAuth()
  const location = useLocation()

  React.useEffect(() => {
    const params = new URLSearchParams(location.search)
    const r = params.get('role')
    if (r) setRole(r.toUpperCase())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validate = () => {
    const e: any = { name: null, email: null, password: null }
    if (!name.trim()) e.name = 'Name is required'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Valid email is required'
    if (!password) e.password = 'Password is required'
    else if (password.length < 8 || password.length > 15) e.password = 'Password must be 8-15 characters long'
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/.test(password)) e.password = 'Password must include uppercase, lowercase, and a number'
    setErrors(e)
    return !Object.values(e).some(Boolean)
  }

  const submit = async () => {
    setServerError(null)
    if (!validate()) return
    try {
      await register(name, email, password, role as any)
      navigate('/')
    } catch (err) {
      console.error(err)
      // @ts-ignore
      if ((err as any) && (err as any).validation) {
        const first = (err as any).validation[0]
        if (first && first.param) setErrors((s) => ({ ...s, [first.param]: first.msg }))
        else setServerError((err as any).validation.map((v: any) => v.msg).join('\n'))
      } else {
        setServerError((err as any)?.message || 'Registration failed')
      }
    }
  }

  return (
    <Container sx={{ mt: 6 }} maxWidth="xs">
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">Sign Up</Typography>
        <Typography variant="body2" color="text.secondary">Already have an account? <Button onClick={() => navigate('/login')}>Log in</Button></Typography>
      </Box>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {serverError && <Alert severity="error">{serverError}</Alert>}

  <Button variant="outlined" onClick={() => window.location.href = '/api/auth/google'}>Sign up with Google</Button>
  <Button variant="outlined" onClick={() => alert('Apple OAuth not configured')}>Sign up with Apple</Button>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">Or</Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>

        <TextField label="Full name" value={name} onChange={(e) => setName(e.target.value)} error={!!errors.name} helperText={errors.name || ''} />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email || ''} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password || ''} />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" onClick={submit}>Create account</Button>
        </Box>
      </Box>

      <AuthFooter />
    </Container>
  )
}
