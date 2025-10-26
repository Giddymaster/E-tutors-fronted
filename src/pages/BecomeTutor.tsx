import React, { useState } from 'react'
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Divider,
  FormControlLabel,
  Checkbox,
} from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import { FaPaypal } from 'react-icons/fa'
import AppleIcon from '@mui/icons-material/Apple'
import PaymentIcon from '@mui/icons-material/Payment'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DescriptionIcon from '@mui/icons-material/Description'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'

export default function BecomeTutor() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [age, setAge] = useState('')
  const [location, setLocation] = useState('')
  const [phone, setPhone] = useState('')
  const [ssn, setSSN] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [backgroundCheck, setBackgroundCheck] = useState(false)
  const [backgroundPaid, setBackgroundPaid] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({
    firstName: null,
    lastName: null,
    email: null,
    age: null,
    location: null,
    phone: null,
    ssn: null,
    specialization: null,
    password: null,
    bio: null,
  })

  const validate = () => {
    const e: any = {
      firstName: null,
      lastName: null,
      email: null,
      age: null,
      location: null,
      phone: null,
      ssn: null,
      specialization: null,
      password: null,
      bio: null,
    }

    if (!firstName) e.firstName = 'First name is required'
    if (!lastName) e.lastName = 'Last name is required'
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Valid email is required'

    const ageNum = Number(age)
    if (!age || isNaN(ageNum) || ageNum < 18 || ageNum > 120) e.age = 'Enter a valid age (18-120)'

    if (!location) e.location = 'Location is required'
    if (!phone || phone.length < 7) e.phone = 'Enter a valid phone number'
    if (!ssn || ssn.length < 4) e.ssn = 'Enter a valid SSN'
    if (!specialization) e.specialization = 'Specialization is required'
    if (!password || password.length < 8) e.password = 'Password must be at least 8 characters'

    const wordCount = bio.trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 150) e.bio = 'Bio must be at least 150 words'

    setErrors(e)
    return !Object.values(e).some(Boolean)
  }

  const handlePay = (method: 'paypal' | 'card') => {
    // simulate payment success
    if (method === 'paypal') {
      alert('Simulated PayPal payment complete ($10)')
    } else {
      alert('Simulated card payment complete ($10)')
    }
    setBackgroundPaid(true)
    setError('')
  }

  const navigate = useNavigate()
  const { user, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return
    if (backgroundCheck && !backgroundPaid) {
      setError('Please complete the $10 background check payment.')
      return
    }

    try {
      // If not logged in, register first and set role to TUTOR
      if (!user) {
        const name = `${firstName.trim()} ${lastName.trim()}`.trim()
        await register(name, email, password, 'TUTOR')
      }

      // Create tutor profile
      const body = {
        bio,
        subjects: specialization ? [specialization] : [],
        hourlyRate: 0,
        availability: location,
      }

      const res = await api.post('/tutors', body)
      if (res && res.data && res.data.tutor) {
        // success: navigate to assignments/marketplace so tutors can see opportunites to bid
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

              <TextField
                label="Age"
                type="number"
                inputProps={{ min: 18, max: 120 }}
                value={age}
                onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                fullWidth
                error={!!errors.age}
                helperText={errors.age || ''}
              />

              <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth error={!!errors.location} helperText={errors.location || ''} />

              <TextField
                label="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
                fullWidth
                inputProps={{ inputMode: 'numeric', maxLength: 15 }}
                error={!!errors.phone}
                helperText={errors.phone || ''}
              />

              <TextField
                label="SSN/ID"
                value={ssn}
                onChange={(e) => setSSN(e.target.value.replace(/\D/g, '').slice(0, 11))}
                fullWidth
                inputProps={{ inputMode: 'numeric', maxLength: 11 }}
                error={!!errors.ssn}
                helperText={errors.ssn || ''}
              />

              <TextField label="Specialization" value={specialization} onChange={(e) => setSpecialization(e.target.value)} fullWidth error={!!errors.specialization} helperText={errors.specialization || ''} />

              <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth error={!!errors.password} helperText={errors.password || ''} />

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

              <FormControlLabel
                control={
                  <Checkbox
                    checked={backgroundCheck}
                    onChange={(e) => {
                      setBackgroundCheck(e.target.checked)
                      if (!e.target.checked) {
                        setBackgroundPaid(false)
                        setError('')
                      }
                    }}
                    icon={<VerifiedUserIcon />}
                    checkedIcon={<VerifiedUserIcon color="primary" />}
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    <PaymentIcon sx={{ mr: 1 }} />
                    <Typography>Background Check</Typography>
                    <Typography color="text.secondary" sx={{ ml: 1 }}>
                      ($10)
                    </Typography>
                  </Box>
                }
              />

              {backgroundCheck && (
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Complete $10 background check - choose payment method
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Button variant="contained" color="primary" startIcon={<FaPaypal />} fullWidth onClick={() => handlePay('paypal')} disabled={backgroundPaid}>
                        Pay with PayPal
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button variant="outlined" startIcon={<CreditCardIcon />} fullWidth onClick={() => handlePay('card')} disabled={backgroundPaid}>
                        Pay with Card
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color={backgroundPaid ? 'success.main' : 'text.secondary'}>
                        {backgroundPaid ? 'Payment completed ✓' : 'No payment made yet'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }} disabled={backgroundCheck && !backgroundPaid}>
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
