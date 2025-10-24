import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Container, TextField, Button, Typography, Box, Alert, Divider, Grid } from '@mui/material';
import AppleIcon from '@mui/icons-material/Apple';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'


export default function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth()

  const [errors, setErrors] = useState<{ [k: string]: string | null }>({
    firstName: null,
    lastName: null,
    phone: null,
    email: null,
    password: null,
  })
  const [serverError, setServerError] = useState<string | null>(null)

  const validate = () => {
    const e: any = { firstName: null, lastName: null, phone: null, email: null, password: null }
    if (!firstName) e.firstName = 'First name is required'
    if (!lastName) e.lastName = 'Last name is required'
    if (!phone) e.phone = 'Phone is required'
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Valid email is required'
    if (!password) e.password = 'Password is required'
    // Note: server enforces stronger password rules (8-15 chars, upper/lower/number)
    setErrors(e)
    return !Object.values(e).some(Boolean)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null)
    if (!validate()) return

    try {
      const name = `${firstName.trim()} ${lastName.trim()}`
      const user = await register(name, email, password)
      // register returns the user (AuthContext sets token and user)
      const role = (user && (user.role)) || null
      if (role === 'STUDENT') navigate('/student')
      else if (role === 'TUTOR') navigate('/dashboard')
      else navigate('/login')
    } catch (err) {
      console.error(err)
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
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>
        <TextField
          label="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          fullWidth
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          fullWidth
        />
        <Button variant="contained" type="submit" fullWidth>
          Sign Up
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

