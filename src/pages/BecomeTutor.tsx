import React, { useState, useEffect } from 'react'
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  IconButton,
} from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import AppleIcon from '@mui/icons-material/Apple'
import DescriptionIcon from '@mui/icons-material/Description'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'

export default function BecomeTutor() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({
    firstName: null,
    lastName: null,
    email: null,
    specialization: null,
    password: null,
    bio: null,
  })

  const validate = () => {
    const e: any = {
      firstName: null,
      lastName: null,
      email: null,
      specialization: null,
      password: null,
      bio: null,
    }

    if (!firstName) e.firstName = 'First name is required'
    if (!lastName) e.lastName = 'Last name is required'
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Valid email is required'
    if (!specialization) e.specialization = 'Specialization is required'
    if (!password || password.length < 8) e.password = 'Password must be at least 8 characters'

    const wordCount = bio.trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 50) e.bio = 'Bio must be at least 50 words'

    setErrors(e)
    return !Object.values(e).some(Boolean)
  }

  // declare hooks so "user" is available to effects
    const navigate = useNavigate()
    const { user, register } = useAuth()
  
    // prefill when user exists
    useEffect(() => {
      if (user) {
        const parts = user.name ? user.name.split(' ') : []
        setFirstName(parts[0] || '')
        setLastName(parts.slice(1).join(' ') || '')
        setEmail(user.email || '')
      }
    }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    try {
      // If not logged in, register first and set role to TUTOR
      if (!user) {
        const name = `${firstName.trim()} ${lastName.trim()}`.trim()
        await register(name, email, password, 'TUTOR')
      }

      // Create tutor profile (minimal required fields)
      const body = {
        bio,
        subjects: specialization ? [specialization.trim().toLowerCase()] : [],
        hourlyRate: 0,
        availability: null,
      }

      const res = await api.post('/tutors', body)
      if (res && res.data && res.data.tutor) {
        // success: navigate to assignments/marketplace so tutors can see opportunities to bid
        navigate('/assignments')
      }
    } catch (err: any) {
      console.error('Become tutor error', err)
      setError(err?.message || (err?.response?.data?.error ?? 'Failed to create tutor profile'))
    }
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Grid container spacing={0}>
        {/* Left side - Image */}
        <Grid item xs={12} md={6} sx={{ p: 0 }}>
          <Box
            component="img"
            src="https://images.pexels.com/photos/4861395/pexels-photo-4861395.jpeg"
            alt="Tutor"
            sx={{
              width: '100%',
              height: { xs: '40vh', md: '100vh' },
              objectFit: 'cover',
              display: 'block',
            }}
          />
        </Grid>

        {/* Right side - Form (scrollable within viewport) */}
        <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 6 }, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: '100%', maxWidth: 720, maxHeight: '100vh', overflowY: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
              Become a Tutor
            </Typography>
            <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
              Sign up to join Excellent Tutors and help students achieve their goals.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              {error && <Typography color="error">{error}</Typography>}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth error={!!errors.firstName} helperText={errors.firstName || ''} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth error={!!errors.lastName} helperText={errors.lastName || ''} />
                </Grid>
              </Grid>

              <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth error={!!errors.email} helperText={errors.email || ''} />

              {/* Simplified form: fewer PII fields to reduce friction */}

              <TextField label="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} fullWidth error={!!errors.specialization} helperText={errors.specialization || ''} />

              <TextField
                label="Bio"
                multiline
                rows={6}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                fullWidth
                InputProps={{ startAdornment: <DescriptionIcon color="action" sx={{ mr: 1 }} /> }}
                helperText={errors.bio || 'Minimum 150 words'}
                error={!!errors.bio}
              />


              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
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

              <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
                Submit
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  or
                </Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>

              <Button variant="outlined" fullWidth startIcon={<FcGoogle />} onClick={() => (window.location.href = `${(import.meta.env.VITE_API_BASE as string) || 'http://localhost:4000/api'}/auth/google`)} sx={{ mb: 1 }}>
                Sign up with Gmail
              </Button>
              <Button variant="outlined" fullWidth startIcon={<AppleIcon />} onClick={() => alert('Apple OAuth not configured')}>
                Sign up with Apple
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
