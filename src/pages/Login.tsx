import React, { useState } from 'react'
import { FcGoogle } from 'react-icons/fc'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import AppleIcon from '@mui/icons-material/Apple';
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthFooter from '../components/AuthFooter'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()
  const API_BASE = (import.meta.env.VITE_API_BASE as string) || 'http://localhost:4000/api'
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({
    email: null,
    password: null,
  })
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
      const result = (await login(email, password)) as any
      let role = (result && (result.role || (result.user && result.user.role))) || null
      if (typeof role === 'string') role = role.toUpperCase()

      if (role === 'STUDENT') {
        navigate('/student')
      } else if (role === 'TUTOR') {
        navigate('/tutor')
      } else {
        navigate('/')
      }
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
    <Grid container sx={{ minHeight: '100vh' }}>
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fafafa',
        }}
      >
        <Container sx={{ mt: 6 }} maxWidth="xs">
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1">
              Log In
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Don’t have an account?{' '}
              <Button component={RouterLink} to="/register">Sign up for free.</Button>
            </Typography>
          </Box>

          <Box sx={{ display: 'grid', gap: 2 }}>
            {serverError && <Alert severity="error">{serverError}</Alert>}

            <Button
              variant="outlined"
              startIcon={<FcGoogle />}
              onClick={() => (window.location.href = `${API_BASE}/auth/google`)}
            >
              Log in with Google
            </Button>
            <Button
              variant="outlined"
              startIcon={<AppleIcon />}
              onClick={() => alert('Apple OAuth not configured')}
            >
              Log in with Apple
            </Button>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary">
                Or
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email || ''}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password || ''}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      onClick={() => setShowPassword((s) => !s)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Button variant="contained" onClick={submit}>
                Log in
              </Button>
              <Button variant="text">Forgot username or password?</Button>
            </Box>
          </Box>

          <AuthFooter />
        </Container>
      </Grid>

      {/* ✅ Right side: Background Image */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          backgroundImage:
            'url("https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    </Grid>
  )
}
