import React, { useState, useRef } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Container, TextField, Button, Typography, Box, Alert, Divider, Grid, InputAdornment, IconButton, LinearProgress, CircularProgress } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import AppleIcon from '@mui/icons-material/Apple';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext' 


export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth()

  // refs to allow focusing the first invalid field
  const firstNameRef = useRef<HTMLInputElement | null>(null)
  const lastNameRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const passwordRef = useRef<HTMLInputElement | null>(null)

  const focusField = (key: string | null) => {
    if (!key) return
    if (key === 'firstName') firstNameRef.current?.focus()
    else if (key === 'lastName') lastNameRef.current?.focus()
    else if (key === 'phone') phoneRef.current?.focus()
    else if (key === 'email') emailRef.current?.focus()
    else if (key === 'password') passwordRef.current?.focus()
  }

  const [errors, setErrors] = useState<{ [k: string]: string | null }>({
    firstName: null,
    lastName: null,
    phone: null,
    email: null,
    password: null,
  })
  const [serverError, setServerError] = useState<string | null>(null)

  // Password strength (0-5)
  const passwordStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score += 1
    if (/[A-Z]/.test(pw)) score += 1
    if (/[a-z]/.test(pw)) score += 1
    if (/[0-9]/.test(pw)) score += 1
    if (/[^A-Za-z0-9]/.test(pw)) score += 1
    return score
  }
  const passwordStrengthLabel = (score: number) => {
    if (score <= 1) return 'Very weak'
    if (score === 2) return 'Weak'
    if (score === 3) return 'Fair'
    if (score === 4) return 'Good'
    return 'Strong'
  }

  const validate = () => {
    const e: any = { firstName: null, lastName: null, phone: null, email: null, password: null }
    if (!firstName) e.firstName = 'First name is required'
    if (!lastName) e.lastName = 'Last name is required'
    if (!phone) e.phone = 'Phone is required'
    else if (!/^\+?[0-9\s\-]{7,15}$/.test(phone)) e.phone = 'Enter a valid phone number (include country code)'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Valid email is required'
    if (!password) e.password = 'Password is required'
    else if (password.length < 8 || password.length > 15) e.password = 'Password must be 8-15 characters'
    else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) e.password = 'Password must include upper and lower case letters and a number'
    setErrors(e)
    // focus first invalid field
    const order = ['firstName', 'lastName', 'phone', 'email', 'password']
    const firstInvalid = order.find((k) => !!e[k]) || null
    if (firstInvalid) focusField(firstInvalid)
    return !Object.values(e).some(Boolean)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null)
    if (!validate()) return

    try {
      setLoading(true)
      const name = `${firstName.trim()} ${lastName.trim()}`
      const user = await register(name, email, password)
      const role = (user as any)?.role || null
      if (role === 'STUDENT') navigate('/student')
      else if (role === 'TUTOR') navigate('/tutor')
      else navigate('/login')
    } catch (err) {
      if (import.meta.env.DEV) console.error(err)
      if ((err as any) && (err as any).validation) {
        const first = (err as any).validation[0]
        if (first && first.param) setErrors((s) => ({ ...s, [first.param]: first.msg }))
        else setServerError((err as any).validation.map((v: any) => v.msg).join('\n'))
      } else if ((err as any)?.field && (err as any)?.message) {
        setErrors((s) => ({ ...s, [(err as any).field]: (err as any).message }))
      } else {
        setServerError((err as any)?.message || 'Registration failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Grid container sx={{ minHeight: '100vh' }}>
      {/* Left side - Sign up form */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="xs" sx={{ py: 8 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mt: 4 }}>
            Sign Up
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" gutterBottom sx={{ mb: 4 }}>
            Create your Excellent Tutors account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
        {error && <Alert severity="error">{error}</Alert>}
        {serverError && <Alert severity="error">{serverError}</Alert>}
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              inputRef={firstNameRef}
              error={!!errors.firstName}
              helperText={errors.firstName || ''}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              inputRef={lastNameRef}
              error={!!errors.lastName}
              helperText={errors.lastName || ''}
              fullWidth
            />
          </Grid>
        </Grid>
        <TextField
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          inputRef={phoneRef}
          error={!!errors.phone}
          helperText={errors.phone || 'Include country code, e.g. +2547...'}
          fullWidth
          // Safer pattern: avoid \s in HTML `pattern` and keep '-' at the end of the class
          inputProps={{ pattern: '\\+?[0-9 -]{7,15}', inputMode: 'tel' }}
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          inputRef={emailRef}
          error={!!errors.email}
          helperText={errors.email || ''}
          fullWidth
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={e => setPassword(e.target.value)}
          inputRef={passwordRef}
          error={!!errors.password}
          helperText={errors.password || '8-15 chars, upper/lower and a number'}
          fullWidth
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <LinearProgress variant="determinate" value={(passwordStrength(password) / 5) * 100} sx={{ height: 6, borderRadius: 2 }} />
          </Box>
          <Typography variant="caption" color="text.secondary">
            {password ? passwordStrengthLabel(passwordStrength(password)) : 'Very weak'}
          </Typography>
        </Box>
        <Button variant="contained" type="submit" fullWidth disabled={loading} startIcon={loading ? <CircularProgress color="inherit" size={18} /> : null}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flex: 1 }} />
          <Typography variant="body2" color="text.secondary">or</Typography>
          <Divider sx={{ flex: 1 }} />
        </Box>
            <Button
          variant="outlined"
          fullWidth
          startIcon={<FcGoogle />}
          onClick={() => (window.location.href = `${(import.meta.env.VITE_API_BASE as string) || 'http://localhost:4000/api'}/auth/google`)}
        >
          Sign up with Gmail
        </Button>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<AppleIcon />}
          onClick={() => alert('Apple OAuth not configured')}
        >
          Sign up with Apple
        </Button>
          </Box>
        </Container>
      </Grid>
      {/* Right side - Image */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          backgroundImage: 'url("https://images.pexels.com/photos/4065876/pexels-photo-4065876.jpeg")',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          bgcolor: '#f5f5f5', // Fallback background color
          display: 'flex',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)', // Slight overlay for better text contrast
          }
        }}
      />
    </Grid>
  );
}

