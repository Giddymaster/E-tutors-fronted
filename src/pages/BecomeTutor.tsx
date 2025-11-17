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
  Avatar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  Autocomplete,
  FormLabel,
  Stack,
  Paper,
  Card,
  CardContent,
} from '@mui/material'
import { FcGoogle } from 'react-icons/fc'
import AppleIcon from '@mui/icons-material/Apple'
import DescriptionIcon from '@mui/icons-material/Description'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import AccountBalanceIcon from '@mui/icons-material/AccountBalance'
import { SiPaypal, SiStripe } from 'react-icons/si'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'

export default function BecomeTutor() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [specialization, setSpecialization] = useState<string[]>([])
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [bio, setBio] = useState('')
  const [shortBio, setShortBio] = useState('')
  const [error, setError] = useState('')
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [subjectsOptions] = useState<string[]>([
    'Math',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Computer Science',
  ])
  const [educationLevel, setEducationLevel] = useState('')
  const [degrees, setDegrees] = useState<string[]>([])
  const [experienceYears, setExperienceYears] = useState<number | ''>('')
  const [teachingStatement, setTeachingStatement] = useState('')
  const [idUpload, setIdUpload] = useState<File | null>(null)
  const [resumeUpload, setResumeUpload] = useState<File | null>(null)
  const [qualificationsUpload, setQualificationsUpload] = useState<File | null>(null)
  const [ssn, setSsn] = useState('')
  const [certify, setCertify] = useState(false)
  const [availability, setAvailability] = useState<Record<string, string[]>>({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  })
  const [formatPreference, setFormatPreference] = useState<string[]>(['Online'])
  const [timeZone, setTimeZone] = useState('')
  const [hourlyRate, setHourlyRate] = useState<number | ''>('')
  const [payoutMethod, setPayoutMethod] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [taxFormUpload, setTaxFormUpload] = useState<File | null>(null)
  const [emailVerified, setEmailVerified] = useState(false)
  const [phoneVerified, setPhoneVerified] = useState(false)
  const [otp, setOtp] = useState('')
  const [sentOtp, setSentOtp] = useState<string | null>(null)
  const [twoFactor, setTwoFactor] = useState(false)
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({})
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)

  const navigate = useNavigate()
  const { user, register } = useAuth()

  useEffect(() => {
    if (user) {
      const parts = user.name ? user.name.split(' ') : []
      setFirstName(parts[0] || '')
      setLastName(parts.slice(1).join(' ') || '')
      setEmail(user.email || '')
      setConfirmEmail(user.email || '')
    }
  }, [user])

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
      setTimeZone(tz || 'America/New_York')
    } catch (e) {
      setTimeZone('America/New_York')
    }
  }, [])

  const validate = () => {
    const e: any = {}

    if (!firstName) e.firstName = 'First name is required'
    if (!lastName) e.lastName = 'Last name is required'
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Valid email is required'
    if (confirmEmail !== email) e.confirmEmail = 'Emails do not match'

    const pwRules = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/
    if (!password || !pwRules.test(password)) e.password = 'Password must be 8+ chars and include uppercase, lowercase, number, and symbol'
    if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match'

    if (!specialization || specialization.length === 0) e.specialization = 'Select at least one subject'
    if (!shortBio || shortBio.length < 50) e.shortBio = 'Short bio must be at least 50 characters'
    if (!certify) e.certify = 'You must certify that information is accurate'
    if (country === 'United States' && !ssn) e.ssn = 'SSN is required for US residents'
    if (!paymentCompleted) e.payment = 'You must complete the $30 registration fee to submit your profile'

    setErrors(e)
    return !Object.values(e).some(Boolean)
  }

  const toggleAvailability = (day: string, slot: string) => {
    setAvailability((prev) => {
      const current = new Set(prev[day] || [])
      if (current.has(slot)) current.delete(slot)
      else current.add(slot)
      return { ...prev, [day]: Array.from(current) }
    })
  }

  const toggleFormat = (fmt: string) => {
    setFormatPreference((prev) => {
      if (prev.includes(fmt)) return prev.filter((p) => p !== fmt)
      return [...prev, fmt]
    })
  }

  const sendOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setSentOtp(code)
    alert(`Simulated OTP sent: ${code}`)
  }

  const verifyOtp = () => {
    if (!sentOtp) return alert('Send OTP first')
    if (otp === sentOtp) {
      setPhoneVerified(true)
      alert('Phone verified')
      setSentOtp(null)
      setOtp('')
    } else {
      alert('Invalid OTP')
    }
  }

  const processPayment = async (method: string) => {
    setProcessingPayment(true)
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In production, you would integrate with actual payment gateway
      const paymentData = {
        method,
        amount: 30,
        currency: 'USD',
        email,
        timestamp: new Date().toISOString(),
      }

      // Try to send to backend, but don't fail if it errors (for demo)
      try {
        await api.post('/payments/process', paymentData)
      } catch {
        // Fallback for demo - just mark as completed locally
      }

      setPaymentCompleted(true)
      alert(`Payment of $30 via ${method} processed successfully!`)
    } catch (err) {
      console.error('Payment error', err)
      alert(`Payment failed. Please try again.`)
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!validate()) return

    try {
      if (!user) {
        const name = `${firstName.trim()} ${lastName.trim()}`.trim()
        await register(name, email, password, 'TUTOR')
      }

      const body = {
        firstName,
        lastName,
        email,
        bio: teachingStatement || bio,
        shortBio,
        subjects: specialization,
        hourlyRate: hourlyRate || 0,
        availability,
        country,
        city,
        phone,
        educationLevel,
        degrees,
      }

      const res = await api.post('/tutors', body)
      if (res && res.data && res.data.tutor) navigate('/assignments')
    } catch (err: any) {
      console.error('Become tutor error', err)
      setError(err?.message || (err?.response?.data?.error ?? 'Failed to create tutor profile'))
    }
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Grid container spacing={0}>
        <Grid item xs={12} md={6} sx={{ p: 0 }}>
          <Box
            component="img"
            src="https://images.pexels.com/photos/4861395/pexels-photo-4861395.jpeg"
            alt="Tutor"
            sx={{ width: '100%', height: { xs: '40vh', md: '100vh' }, objectFit: 'cover', display: 'block' }}
          />
        </Grid>

        <Grid item xs={12} md={6} sx={{ p: { xs: 3, md: 6 }, display: 'flex', alignItems: 'flex-start' }}>
          <Box sx={{ width: '100%', maxWidth: 880, maxHeight: '100vh', overflowY: 'auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
              Become a Tutor
            </Typography>
            <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
              Create your tutor profile — students will see your experience, availability, and rates.
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              {error && <Typography color="error">{error}</Typography>}

              {/* Account Information */}
              <Typography variant="h6">Account Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth error={!!errors.firstName} helperText={errors.firstName || ''} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth error={!!errors.lastName} helperText={errors.lastName || ''} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth error={!!errors.email} helperText={errors.email || ''} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Confirm Email" type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} fullWidth error={!!errors.confirmEmail} helperText={errors.confirmEmail || ''} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Password" type={passwordVisible ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} fullWidth error={!!errors.password} helperText={errors.password || ''} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton aria-label="toggle password" onClick={() => setPasswordVisible((s) => !s)} edge="end">{passwordVisible ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Confirm Password" type={passwordVisible ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} fullWidth error={!!errors.confirmPassword} helperText={errors.confirmPassword || ''} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2">Password strength: {passwordStrengthLabel(password)}</Typography>
                  <Box sx={{ height: 8, background: '#eee', borderRadius: 1, overflow: 'hidden', mt: 1 }}>
                    <Box sx={{ width: `${passwordStrengthPct(password)}%`, height: '100%', background: passwordStrengthColor(password) }} />
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Personal Details */}
              <Typography variant="h6">Personal Details</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item>
                  <Avatar sx={{ width: 72, height: 72 }} src={profilePhoto ? URL.createObjectURL(profilePhoto) : undefined} />
                </Grid>
                <Grid item xs>
                  <Button variant="outlined" component="label">Upload Profile Photo<input hidden accept="image/*" type="file" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} /></Button>
                  {profilePhoto && <Typography variant="body2" sx={{ mt: 1 }}>{profilePhoto.name}</Typography>}
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Country</InputLabel>
                    <Select value={country} label="Country" onChange={(e) => setCountry(e.target.value)}>
                      <MenuItem value="United States">United States</MenuItem>
                      <MenuItem value="United Kingdom">United Kingdom</MenuItem>
                      <MenuItem value="Kenya">Kenya</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Date of Birth" type="date" value={dob} onChange={(e) => setDob(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select value={gender} label="Gender" onChange={(e) => setGender(e.target.value)}>
                      <MenuItem value="">Prefer not to say</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Subjects & Experience */}
              <Typography variant="h6">Tutoring Subjects & Experience</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Autocomplete multiple options={subjectsOptions} freeSolo value={specialization} onChange={(_, v) => setSpecialization(v as string[])} renderTags={(value: string[], getTagProps) => value.map((option, index) => (<Chip variant="outlined" label={option} {...getTagProps({ index })} />))} renderInput={(params) => <TextField {...params} label="Subjects (search & add)" />} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Highest Level of Education</InputLabel>
                    <Select value={educationLevel} label="Highest Level of Education" onChange={(e) => setEducationLevel(e.target.value)}>
                      <MenuItem value="High School">High School</MenuItem>
                      <MenuItem value="Bachelors">Bachelor's</MenuItem>
                      <MenuItem value="Masters">Master's</MenuItem>
                      <MenuItem value="PhD">PhD</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Autocomplete options={[] as string[]} multiple freeSolo value={degrees} onChange={(_, v) => setDegrees(v as string[])} renderTags={(value: string[], getTagProps) => value.map((option, index) => (<Chip variant="outlined" label={option} {...getTagProps({ index })} />))} renderInput={(params) => <TextField {...params} label="Degrees / Certifications" />} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Years of Tutoring Experience" type="number" value={experienceYears} onChange={(e) => setExperienceYears(Number(e.target.value || ''))} fullWidth />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Short Bio (max 600 chars)" multiline rows={4} value={shortBio} onChange={(e) => setShortBio(e.target.value.slice(0, 600))} fullWidth helperText={`${shortBio.length}/600`} error={!!errors.shortBio} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Detailed Teaching Statement" multiline rows={6} value={teachingStatement} onChange={(e) => setTeachingStatement(e.target.value)} fullWidth helperText="Explain your teaching approach, assessment methods, and strengths." />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Identity & Eligibility */}
              <Typography variant="h6">Identity & Eligibility</Typography>
              <Grid container spacing={2}>
                <Grid item>
                  <Button variant="outlined" component="label">Upload National ID / Passport<input hidden type="file" accept="image/*,application/pdf" onChange={(e) => setIdUpload(e.target.files?.[0] || null)} /></Button>
                  {idUpload && <Typography variant="body2">{idUpload.name}</Typography>}
                </Grid>
                <Grid item>
                  <Button variant="outlined" component="label">Upload Resume/CV<input hidden type="file" accept="application/pdf" onChange={(e) => setResumeUpload(e.target.files?.[0] || null)} /></Button>
                  {resumeUpload && <Typography variant="body2">{resumeUpload.name}</Typography>}
                </Grid>
                <Grid item>
                  <Button variant="outlined" component="label">Upload Proof of Qualifications<input hidden type="file" accept="image/*,application/pdf" onChange={(e) => setQualificationsUpload(e.target.files?.[0] || null)} /></Button>
                  {qualificationsUpload && <Typography variant="body2">{qualificationsUpload.name}</Typography>}
                </Grid>

                {country === 'United States' && (
                  <Grid item xs={12} sm={6}>
                    <TextField label="SSN" value={ssn} onChange={(e) => setSsn(e.target.value)} fullWidth error={!!errors.ssn} helperText={errors.ssn || ''} />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormControlLabel control={<Checkbox checked={certify} onChange={(e) => setCertify(e.target.checked)} />} label="I certify that all information provided is accurate." />
                  {errors.certify && <Typography color="error" variant="body2">{errors.certify}</Typography>}
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Availability & Schedule */}
              <Typography variant="h6">Availability & Schedule</Typography>
              <Typography variant="body2">Timezone: America/New_York (US Eastern Time)</Typography>
              <Grid container spacing={1} sx={{ mb: 1 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <Grid item xs={12} sm={6} md={4} key={day}>
                    <Box sx={{ border: '1px solid #eee', p: 1, borderRadius: 1 }}>
                      <Typography variant="subtitle2">{day}</Typography>
                      <FormControlLabel control={<Checkbox checked={availability[day].includes('Morning')} onChange={() => toggleAvailability(day, 'Morning')} />} label="Morning" />
                      <FormControlLabel control={<Checkbox checked={availability[day].includes('Afternoon')} onChange={() => toggleAvailability(day, 'Afternoon')} />} label="Afternoon" />
                      <FormControlLabel control={<Checkbox checked={availability[day].includes('Evening')} onChange={() => toggleAvailability(day, 'Evening')} />} label="Evening" />
                    </Box>
                  </Grid>
                ))}
              </Grid>
              <FormLabel component="legend">Preferred tutoring format</FormLabel>
              <FormControlLabel control={<Checkbox checked={formatPreference.includes('Online')} onChange={() => toggleFormat('Online')} />} label="Online" />
              <FormControlLabel control={<Checkbox checked={formatPreference.includes('In-person')} onChange={() => toggleFormat('In-person')} />} label="In-person" />
              <FormControlLabel control={<Checkbox checked={formatPreference.includes('Hybrid')} onChange={() => toggleFormat('Hybrid')} />} label="Hybrid" />

              <Divider sx={{ my: 2 }} />

              {/* Rate & Payment Setup */}
              <Typography variant="h6">Rate & Payment Setup</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <TextField label="Hourly Rate" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value || ''))} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Payout Method</InputLabel>
                    <Select value={payoutMethod} label="Payout Method" onChange={(e) => setPayoutMethod(e.target.value)}>
                      <MenuItem value="Bank">Bank</MenuItem>
                      <MenuItem value="PayPal">PayPal</MenuItem>
                      <MenuItem value="Stripe">Stripe</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <InputLabel>Currency</InputLabel>
                    <Select value={currency} label="Currency" onChange={(e) => setCurrency(e.target.value)}>
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="GBP">GBP</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Registration Fee & Payment */}
              <Paper sx={{ p: 3, mb: 3, backgroundColor: '#f0f4ff', border: '2px solid #1976d2' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  💳 Registration Fee
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  A one-time registration fee of <strong>$30 USD</strong> is required to activate your tutor account and start accepting students.
                </Typography>

                {!paymentCompleted ? (
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Select a Payment Method:
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      {/* PayPal */}
                      <Grid item xs={12} sm={6} md={3}>
                        <Card
                          onClick={() => setPaymentMethod('PayPal')}
                          sx={{
                            cursor: 'pointer',
                            border: paymentMethod === 'PayPal' ? '3px solid #0070ba' : '2px solid #ddd',
                            backgroundColor: paymentMethod === 'PayPal' ? '#f0f7ff' : 'white',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: 2,
                              borderColor: '#0070ba',
                            },
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                              <SiPaypal size={32} color="#0070ba" />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              PayPal
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Credit Card */}
                      <Grid item xs={12} sm={6} md={3}>
                        <Card
                          onClick={() => setPaymentMethod('Credit Card')}
                          sx={{
                            cursor: 'pointer',
                            border: paymentMethod === 'Credit Card' ? '3px solid #1976d2' : '2px solid #ddd',
                            backgroundColor: paymentMethod === 'Credit Card' ? '#f0f7ff' : 'white',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: 2,
                              borderColor: '#1976d2',
                            },
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                              <CreditCardIcon sx={{ fontSize: 32, color: '#1976d2' }} />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              Credit Card
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      {/* Stripe */}
                      <Grid item xs={12} sm={6} md={4}>
                        <Card
                          onClick={() => setPaymentMethod('Stripe')}
                          sx={{
                            cursor: 'pointer',
                            border: paymentMethod === 'Stripe' ? '3px solid #6772e5' : '2px solid #ddd',
                            backgroundColor: paymentMethod === 'Stripe' ? '#f5f3ff' : 'white',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: 2,
                              borderColor: '#6772e5',
                            },
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center', py: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                              <SiStripe size={32} color="#6772e5" />
                            </Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              Stripe
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>

                    {paymentMethod && (
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        size="large"
                        onClick={() => processPayment(paymentMethod)}
                        disabled={processingPayment}
                        sx={{ mt: 2 }}
                      >
                        {processingPayment ? 'Processing Payment...' : `Pay $30 with ${paymentMethod}`}
                      </Button>
                    )}
                    {errors.payment && (
                      <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                        {errors.payment}
                      </Typography>
                    )}
                  </Box>
                ) : (
                  <Box sx={{ p: 2, backgroundColor: '#e8f5e9', borderRadius: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6" sx={{ color: '#2e7d32' }}>
                      ✓
                    </Typography>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        Payment Completed!
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Your registration fee of $30 has been successfully processed.
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Paper>

              <Divider sx={{ my: 2 }} />

              {/* Security & Verification */}
              <Typography variant="h6">Security & Verification</Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Button variant="outlined" onClick={() => setEmailVerified(true)} startIcon={<VerifiedUserIcon />}>Send Email Verification</Button>
                  {emailVerified && <Typography variant="body2" color="success.main">Email verified</Typography>}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <TextField label="Phone OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    <Button variant="outlined" onClick={sendOtp}>Send OTP</Button>
                    <Button variant="contained" onClick={verifyOtp}>Verify</Button>
                  </Stack>
                  {phoneVerified && <Typography variant="body2" color="success.main">Phone verified</Typography>}
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel control={<Checkbox checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />} label="Enable two-factor authentication (optional)" />
                </Grid>
              </Grid>

              <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>Create Profile</Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

// Password helper functions
function passwordStrengthPct(pw: string) {
  let score = 0
  if (!pw) return 0
  if (pw.length >= 8) score += 25
  if (/[A-Z]/.test(pw)) score += 25
  if (/[a-z]/.test(pw)) score += 20
  if (/\d/.test(pw)) score += 15
  if (/[^A-Za-z0-9]/.test(pw)) score += 15
  return Math.min(100, score)
}

function passwordStrengthLabel(pw: string) {
  const pct = passwordStrengthPct(pw)
  if (pct === 0) return 'None'
  if (pct < 40) return 'Weak'
  if (pct < 70) return 'Medium'
  return 'Strong'
}

function passwordStrengthColor(pw: string) {
  const pct = passwordStrengthPct(pw)
  if (pct < 40) return '#f44336'
  if (pct < 70) return '#ff9800'
  return '#4caf50'
}

