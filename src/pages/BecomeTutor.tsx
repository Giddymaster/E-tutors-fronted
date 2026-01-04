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
  Stack,
  Paper,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Fade,
  Collapse,
  Link,
  Tooltip,
  Badge,
  Menu,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import SaveIcon from '@mui/icons-material/Save'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import StarIcon from '@mui/icons-material/Star'
import GroupIcon from '@mui/icons-material/Group'
import SchoolIcon from '@mui/icons-material/School'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import EditIcon from '@mui/icons-material/Edit'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'
import { SiPaypal, SiStripe } from 'react-icons/si'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import { useCountries } from '../hooks/useCountries'

const STEPS = [
  'Professional Profile',
  'Teaching Expertise',
  'Business Setup',
  'Verification',
  'Launch Ready',
]

export default function BecomeTutor() {
  const [activeStep, setActiveStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())

  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordVisible, setPasswordVisible] = useState(false)
  
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('')
  const [professionalHeadline, setProfessionalHeadline] = useState('')
  
  const [specialization, setSpecialization] = useState<string[]>([])
  const [subjectsOptions] = useState<string[]>([
    'Math',
    'Physics',
    'Chemistry',
    'Biology',
    'English',
    'History',
    'Computer Science',
    'Economics',
    'Psychology',
    'Spanish',
    'French',
  ])
  const [educationLevel, setEducationLevel] = useState('')
  const [degrees, setDegrees] = useState<string[]>([])
  const [experienceYears, setExperienceYears] = useState<number | ''>('')
  const [shortBio, setShortBio] = useState('')
  const [teachingStatement, setTeachingStatement] = useState('')
  
  const [weeklyHours, setWeeklyHours] = useState('')
  const [formatPreference, setFormatPreference] = useState<string[]>(['Online'])
  const [timeZone, setTimeZone] = useState('')
  const [hourlyRate, setHourlyRate] = useState<number | ''>('')
  const [currency, setCurrency] = useState('USD')
  const [recommendedRate, setRecommendedRate] = useState({ min: 0, max: 0, avg: 0 })
  
  const [idUpload, setIdUpload] = useState<File | null>(null)
  const [resumeUpload, setResumeUpload] = useState<File | null>(null)
  const [qualificationsUpload, setQualificationsUpload] = useState<File | null>(null)
  const [ssn, setSsn] = useState('')
  const [certify, setCertify] = useState(false)
  
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null)
  const [paymentCompleted, setPaymentCompleted] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  
  const [errors, setErrors] = useState<{ [k: string]: string | null }>({})
  const [error, setError] = useState('')
  const [creatingProfile, setCreatingProfile] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [profileQuality, setProfileQuality] = useState(0)
  const [availableCities, setAvailableCities] = useState<string[]>([])
  const [photoMenuAnchor, setPhotoMenuAnchor] = useState<{ left: number; top: number } | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoMetadata, setPhotoMetadata] = useState<{ name: string; size: number } | null>(null)

  const navigate = useNavigate()
  const { user, register, login } = useAuth()
  const { countries, loading: countriesLoading } = useCountries()
  const countryOptions = countries.map(c => c.country)

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

  // Update available cities when country changes
  useEffect(() => {
    if (country) {
      const selectedCountry = countries.find(c => c.country === country)
      if (selectedCountry) {
        setAvailableCities(selectedCountry.cities)
        setCity('') // Reset city selection when country changes
      }
    } else {
      setAvailableCities([])
      setCity('')
    }
  }, [country, countries])

  // Calculate profile quality score
  useEffect(() => {
    let score = 0
    if (firstName && lastName) score += 10
    if (email) score += 10
    if (profilePhoto) score += 15
    if (professionalHeadline && professionalHeadline.length > 20) score += 15
    if (specialization.length > 0) score += 10
    if (educationLevel) score += 10
    if (shortBio && shortBio.length >= 50) score += 15
    if (hourlyRate && hourlyRate > 0) score += 10
    if (weeklyHours) score += 5
    setProfileQuality(Math.min(100, score))
  }, [firstName, lastName, email, profilePhoto, professionalHeadline, specialization, educationLevel, shortBio, hourlyRate, weeklyHours])

  // Smart rate calculator
  useEffect(() => {
    if (educationLevel && experienceYears) {
      let baseRate = 25
      
      // Education multiplier
      if (educationLevel === 'PhD') baseRate = 75
      else if (educationLevel === 'Masters') baseRate = 55
      else if (educationLevel === 'Bachelors') baseRate = 35
      
      // Experience bonus
      const expBonus = Math.min(Number(experienceYears) * 5, 30)
      
      const avg = baseRate + expBonus
      setRecommendedRate({
        min: Math.round(avg * 0.85),
        max: Math.round(avg * 1.15),
        avg: Math.round(avg)
      })
      
      if (!hourlyRate) {
        setHourlyRate(Math.round(avg))
      }
    }
  }, [educationLevel, experienceYears])

  const getCompletionPercentage = () => {
    return Math.round(((activeStep + 1) / STEPS.length) * 100)
  }

  const validateStep = (step: number) => {
    const e: any = {}

    if (step === 0) {
      if (!firstName) e.firstName = 'First name is required'
      if (!lastName) e.lastName = 'Last name is required'
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Valid email is required'
      if (confirmEmail !== email) e.confirmEmail = 'Emails do not match'
      const pwRules = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}/
      if (!password || !pwRules.test(password)) e.password = 'Password must be 8+ chars with uppercase, lowercase, number, and symbol'
      if (confirmPassword !== password) e.confirmPassword = 'Passwords do not match'
      if (!country) e.country = 'Country is required'
      if (!phone) e.phone = 'Phone number is required'
    }

    if (step === 1) {
      if (!specialization || specialization.length === 0) e.specialization = 'Select at least one subject'
      if (!educationLevel) e.educationLevel = 'Education level is required'
      if (!shortBio || shortBio.length < 50) e.shortBio = 'Short bio must be at least 50 characters'
    }

    if (step === 2) {
      if (!hourlyRate || hourlyRate <= 0) e.hourlyRate = 'Hourly rate must be greater than 0'
      if (!weeklyHours) e.weeklyHours = 'Please select your weekly availability'
    }

    if (step === 3) {
      if (!certify) e.certify = 'You must certify that information is accurate'
      if (country === 'United States' && !ssn) e.ssn = 'SSN is required for US residents'
    }

    if (step === 4) {
      if (!paymentCompleted) e.payment = 'Complete the $30 registration fee to proceed'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setCompletedSteps((prev) => new Set(prev).add(activeStep))
      setActiveStep((prev) => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStepClick = (step: number) => {
    if (step < activeStep || completedSteps.has(step)) {
      setActiveStep(step)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Photo upload handler
  const handlePhotoUpload = async (file: File | Blob) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB')
      return
    }

    // Convert Blob to File if necessary (for camera captures)
    let photoFile: File
    if (file instanceof File) {
      photoFile = file
    } else {
      // Generate a timestamp-based filename for camera captures
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
      photoFile = new File([file], `profile_${timestamp}.jpg`, { type: 'image/jpeg' })
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(photoFile)
    setPhotoPreview(previewUrl)

    // Store metadata
    setPhotoMetadata({
      name: photoFile.name,
      size: photoFile.size,
    })

    // Set the photo
    setProfilePhoto(photoFile)
    setError('')
  }

  const handleRemovePhoto = () => {
    setProfilePhoto(null)
    setPhotoPreview(null)
    setPhotoMetadata(null)
  }

  const toggleFormat = (fmt: string) => {
    setFormatPreference((prev) => {
      if (prev.includes(fmt)) return prev.filter((p) => p !== fmt)
      return [...prev, fmt]
    })
  }

  const processPayment = async (method: string) => {
    if (!method) {
      setPaymentError('Select a payment method')
      return
    }
    setPaymentError(null)
    setProcessingPayment(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const paymentData = {
        method,
        amount: 30,
        currency: 'USD',
        email,
        timestamp: new Date().toISOString(),
      }

      try {
        await api.post('/payments/process', paymentData)
        setPaymentCompleted(true)
        setSuccessMessage(`Payment of $30 via ${method} processed successfully!`)
        setPaymentError(null)
      } catch (err: any) {
        if (err?.response?.status === 404) {
          setPaymentCompleted(true)
          setPaymentError('Payment backend not configured; proceeding in demo mode.')
          setSuccessMessage(`Payment processed locally (demo mode).`)
        } else {
          setPaymentError('Payment failed. Please try again.')
          throw err
        }
      }
    } catch (err) {
      if (import.meta.env.DEV) console.error('Payment error', err)
    } finally {
      setProcessingPayment(false)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) return

    try {
      setCreatingProfile(true)
      if (!user) {
        const name = `${firstName.trim()} ${lastName.trim()}`.trim()
        try {
          await register(name, email, password, 'TUTOR')
        } catch (regErr: any) {
          const msg = regErr?.response?.data?.error || regErr?.message || ''
          if (regErr?.response?.status === 400 && /email.*in use/i.test(String(msg))) {
            try {
              await login(email, password)
            } catch (loginErr: any) {
              setError('Email already in use. Please login or reset your password.')
              return
            }
          } else {
            throw regErr
          }
        }
      }

      const body = {
        firstName,
        lastName,
        email,
        bio: teachingStatement || shortBio,
        shortBio,
        subjects: specialization,
        hourlyRate: hourlyRate || 0,
        weeklyHours,
        country,
        city,
        phone,
        educationLevel,
        degrees,
        professionalHeadline,
      }

      const res = await api.post('/tutors', body)
      if (res && res.data && res.data.tutor) {
        setSuccessMessage('Profile created successfully! Redirecting...')
        setTimeout(() => navigate('/assignments?view=recommended'), 1500)
      }
    } catch (err: any) {
      if (import.meta.env.DEV) console.error('Become tutor error', err)
      setError(err?.response?.data?.error || err?.message || 'Failed to create tutor profile')
    } finally {
      setCreatingProfile(false)
    }
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Fade in timeout={500}>
            <Box>
              <Grid container spacing={3}>
                {/* Left Column - Profile Builder */}
                <Grid item xs={12} md={6}>
                  <Typography variant="h5" fontWeight={600} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SchoolIcon /> Build Your Professional Profile
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Create a compelling profile that attracts students
                  </Typography>

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: { xs: 'column', sm: 'row' },
                          alignItems: 'flex-start',
                          gap: 3,
                        }}
                      >
                        {/* Photo Upload Area */}
                        <Box sx={{ flexShrink: 0 }} className="profile-photo-area">
                          <Tooltip title={profilePhoto ? "Edit photo" : "Add profile photo"}>
                            <Box
                              sx={{
                                position: 'relative',
                                cursor: 'pointer',
                                '&:hover .profile-photo-overlay': {
                                  opacity: 1,
                                },
                              }}
                              onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                setPhotoMenuAnchor({ left: rect.left, top: rect.bottom })
                              }}
                            >
                              <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                  profilePhoto ? (
                                    <EditIcon
                                      sx={{
                                        fontSize: 16,
                                        color: 'white',
                                        bgcolor: 'primary.main',
                                        borderRadius: '50%',
                                        p: 0.5,
                                        border: '2px solid white',
                                      }}
                                    />
                                  ) : (
                                    <CameraAltIcon
                                      sx={{
                                        fontSize: 16,
                                        color: 'white',
                                        bgcolor: 'primary.main',
                                        borderRadius: '50%',
                                        p: 0.5,
                                        border: '2px solid white',
                                      }}
                                    />
                                  )
                                }
                              >
                                <Avatar
                                  sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: profilePhoto ? 'transparent' : '#f0f0f0',
                                    border: '2px dashed',
                                    borderColor: profilePhoto ? 'transparent' : '#bdbdbd',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      borderColor: 'primary.main',
                                    },
                                  }}
                                  src={photoPreview || undefined}
                                >
                                  {!profilePhoto && (
                                    <CameraAltIcon sx={{ fontSize: 40, color: '#9e9e9e' }} />
                                  )}
                                </Avatar>
                                
                                {/* Hover Overlay */}
                                <Box
                                  className="profile-photo-overlay"
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    opacity: 0,
                                    transition: 'opacity 0.3s ease',
                                  }}
                                >
                                  <CameraAltIcon sx={{ fontSize: 32, color: 'white' }} />
                                </Box>
                              </Badge>
                            </Box>
                          </Tooltip>
                        </Box>

                        {/* Photo Menu */}
                        <Menu
                          anchorReference="anchorPosition"
                          anchorPosition={photoMenuAnchor || undefined}
                          open={Boolean(photoMenuAnchor)}
                          onClose={() => setPhotoMenuAnchor(null)}
                          PaperProps={{
                            sx: { minWidth: 200 }
                          }}
                        >
                          <MenuItem
                            onClick={() => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) handlePhotoUpload(file)
                                setPhotoMenuAnchor(null)
                              }
                              input.click()
                            }}
                          >
                            <ListItemIcon>
                              <CloudUploadIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Upload from device</ListItemText>
                          </MenuItem>
                          <MenuItem
                            onClick={() => {
                              const input = document.createElement('input') as HTMLInputElement & { capture: string }
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.capture = 'user'
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) handlePhotoUpload(file)
                                setPhotoMenuAnchor(null)
                              }
                              input.click()
                            }}
                          >
                            <ListItemIcon>
                              <CameraAltIcon fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Take photo</ListItemText>
                          </MenuItem>
                          {profilePhoto && (
                            <MenuItem
                              onClick={() => {
                                handleRemovePhoto()
                                setPhotoMenuAnchor(null)
                              }}
                              sx={{ color: 'error.main' }}
                            >
                              <ListItemIcon>
                                <DeleteIcon fontSize="small" color="error" />
                              </ListItemIcon>
                              <ListItemText>Remove photo</ListItemText>
                            </MenuItem>
                          )}
                        </Menu>

                        {/* Info Section */}
                        <Box sx={{ flex: 1, pt: { xs: 1, sm: 0 } }}>
                          <Typography
                            variant="subtitle2"
                            fontWeight={600}
                            sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}
                          >
                            Profile Photo
                            {!profilePhoto && (
                              <Typography
                                component="span"
                                variant="caption"
                                sx={{ color: '#666', fontWeight: 400, ml: 0.5 }}
                              >
                                (Recommended)
                              </Typography>
                            )}
                          </Typography>

                          {profilePhoto && photoMetadata ? (
                            <Box>
                              <Box
                                sx={{
                                  p: 2,
                                  bgcolor: '#f8f9fa',
                                  border: '1px solid #e9ecef',
                                  borderRadius: 1,
                                  mb: 2,
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                  <CheckCircleIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                                  <Typography variant="body2" fontWeight={600} color="#2e7d32">
                                    Photo uploaded
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary">
                                  {photoMetadata.name} • {(photoMetadata.size / 1024).toFixed(1)} KB
                                </Typography>
                              </Box>

                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<EditIcon />}
                                onClick={(e) => {
                                  const rect = e.currentTarget.getBoundingClientRect()
                                  setPhotoMenuAnchor({ left: rect.left, top: rect.bottom })
                                }}
                                sx={{ textTransform: 'none' }}
                              >
                                Change photo
                              </Button>
                            </Box>
                          ) : (
                            <Box>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mb: 1.5,
                                  lineHeight: 1.5,
                                }}
                              >
                                Add a professional photo to build trust with students. A good photo can increase booking rates by up to 3×.
                              </Typography>
                              
                              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip
                                  icon={<CheckIcon fontSize="small" />}
                                  label="Clear lighting"
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  icon={<CheckIcon fontSize="small" />}
                                  label="Professional attire"
                                  size="small"
                                  variant="outlined"
                                />
                                <Chip
                                  icon={<CheckIcon fontSize="small" />}
                                  label="Face the camera"
                                  size="small"
                                  variant="outlined"
                                />
                              </Box>
                              
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block', mt: 2 }}
                              >
                                Click to upload or take a photo
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        fullWidth
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        fullWidth
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Professional Headline"
                        value={professionalHeadline}
                        onChange={(e) => setProfessionalHeadline(e.target.value)}
                        fullWidth
                        placeholder="e.g., Physics & Math Tutor | MIT PhD | 8+ Years Experience"
                        InputProps={{
                          endAdornment: professionalHeadline.length > 20 ? (
                            <Tooltip title="Strong headline!">
                              <CheckCircleIcon color="success" />
                            </Tooltip>
                          ) : null,
                        }}
                        helperText="Include credentials, subjects, and experience"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email || "We'll use this for account notifications"}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Confirm Email"
                        type="email"
                        value={confirmEmail}
                        onChange={(e) => setConfirmEmail(e.target.value)}
                        fullWidth
                        error={!!errors.confirmEmail}
                        helperText={errors.confirmEmail}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Password"
                        type={passwordVisible ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password || 'Must include uppercase, lowercase, number, and special character'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setPasswordVisible((s) => !s)}
                                edge="end"
                              >
                                {passwordVisible ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Password strength: {passwordStrengthLabel(password)}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={passwordStrengthPct(password)}
                          sx={{
                            height: 6,
                            borderRadius: 1,
                            mt: 0.5,
                            backgroundColor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: passwordStrengthColor(password),
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Confirm Password"
                        type={passwordVisible ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        fullWidth
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors.country} disabled={countriesLoading}>
                        <InputLabel>Country</InputLabel>
                        <Select
                          value={country}
                          label="Country"
                          onChange={(e) => setCountry(e.target.value)}
                        >
                          {countriesLoading ? (
                            <MenuItem disabled>Loading countries...</MenuItem>
                          ) : (
                            countryOptions.map((countryName) => (
                              <MenuItem key={countryName} value={countryName}>
                                {countryName}
                              </MenuItem>
                            ))
                          )}
                        </Select>
                        {errors.country && (
                          <Typography variant="caption" color="error">
                            {errors.country}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <Autocomplete
                        options={availableCities}
                        value={city}
                        onChange={(_, value) => setCity(value || '')}
                        disabled={!country || availableCities.length === 0}
                        freeSolo
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="City"
                            helperText={!country ? 'Select a country first' : 'Select or type a city'}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        label="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        fullWidth
                        error={!!errors.phone}
                        helperText={errors.phone || 'For account security'}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                {/* Right Column - Live Preview */}
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, height: '100%', bgcolor: '#f5f5f5', position: 'sticky', top: 120 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Visibility /> Live Student Preview
                    </Typography>
                    
                    <Card sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <Avatar
                            sx={{ width: 60, height: 60 }}
                            src={photoPreview || undefined}
                          />
                          <Box>
                            <Typography variant="h6">
                              {firstName && lastName ? `${firstName} ${lastName}` : 'Your Name'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {professionalHeadline || 'Your professional headline will appear here'}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                              <StarIcon sx={{ fontSize: 16, color: '#ff9800' }} />
                              <Typography variant="body2">New Tutor</Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
                          {shortBio || 'Your bio will appear here to help students understand your teaching approach...'}
                        </Typography>
                        
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Location</Typography>
                            <Typography variant="body2">{city || country || 'Not set'}</Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="caption" color="text.secondary">Subjects</Typography>
                            <Typography variant="body2">{specialization.length || 0} subjects</Typography>
                          </Grid>
                        </Grid>
                        
                        <Button variant="contained" fullWidth size="small" disabled>
                          Book Session
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Box sx={{ bgcolor: profileQuality >= 70 ? '#e8f5e9' : '#fff3e0', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <AutoAwesomeIcon fontSize="small" />
                        Profile Quality Score: <strong>{profileQuality}/100</strong>
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={profileQuality} 
                        sx={{ 
                          height: 8, 
                          borderRadius: 4,
                          backgroundColor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: profileQuality >= 70 ? '#4caf50' : '#ff9800'
                          }
                        }}
                      />
                      <Typography variant="caption" sx={{ mt: 1, display: 'block' }} color="text.secondary">
                        {profileQuality >= 85 ? '🎉 Excellent! Priority matching enabled' : 
                         profileQuality >= 70 ? '👍 Good! Add more details to reach 85+' :
                         '📝 Keep going! Complete your profile for better visibility'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )

      case 1:
        return (
          <Fade in timeout={500}>
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Your Teaching Expertise
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Share your qualifications to match with the right students
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    options={subjectsOptions}
                    freeSolo
                    value={specialization}
                    onChange={(_, v) => setSpecialization(v as string[])}
                    renderTags={(value: string[], getTagProps) =>
                      value.map((option, index) => {
                        const isHighDemand = ['Math', 'Physics', 'Computer Science'].includes(option)
                        return (
                          <Chip
                            variant="filled"
                            label={option}
                            {...getTagProps({ index })}
                            color="primary"
                            deleteIcon={isHighDemand ? <TrendingUpIcon /> : undefined}
                          />
                        )
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Subjects You Teach"
                        error={!!errors.specialization}
                        helperText={errors.specialization || 'Select or type subjects you specialize in'}
                      />
                    )}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    💡 High demand subjects (Math, Physics, CS) typically command 25% higher rates
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth error={!!errors.educationLevel}>
                    <InputLabel>Highest Education Level</InputLabel>
                    <Select
                      value={educationLevel}
                      label="Highest Education Level"
                      onChange={(e) => setEducationLevel(e.target.value)}
                    >
                      <MenuItem value="High School">High School</MenuItem>
                      <MenuItem value="Bachelors">Bachelor's Degree</MenuItem>
                      <MenuItem value="Masters">Master's Degree</MenuItem>
                      <MenuItem value="PhD">PhD</MenuItem>
                      <MenuItem value="Professional">Professional Certification</MenuItem>
                    </Select>
                    {errors.educationLevel && (
                      <Typography variant="caption" color="error">
                        {errors.educationLevel}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Years of Teaching Experience"
                    type="number"
                    value={experienceYears}
                    onChange={(e) => setExperienceYears(Number(e.target.value || ''))}
                    fullWidth
                    helperText="Include both formal and informal tutoring"
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete
                    options={[] as string[]}
                    multiple
                    freeSolo
                    value={degrees}
                    onChange={(_, v) => setDegrees(v as string[])}
                    renderTags={(value: string[], getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Degrees & Certifications (Optional)"
                        helperText="e.g., B.S. in Mathematics, Teaching Certificate"
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Short Bio"
                    multiline
                    rows={4}
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value.slice(0, 600))}
                    fullWidth
                    error={!!errors.shortBio}
                    helperText={
                      errors.shortBio ||
                      `${shortBio.length}/600 - Brief introduction students will see on your profile`
                    }
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="text"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    sx={{ mb: 1 }}
                  >
                    {showAdvanced ? '− Hide' : '+ Add'} detailed teaching statement (Optional)
                  </Button>
                  <Collapse in={showAdvanced}>
                    <TextField
                      label="Detailed Teaching Philosophy"
                      multiline
                      rows={6}
                      value={teachingStatement}
                      onChange={(e) => setTeachingStatement(e.target.value)}
                      fullWidth
                      helperText="Explain your teaching approach, methods, and what makes you unique"
                    />
                  </Collapse>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )

      case 2:
        return (
          <Fade in timeout={500}>
            <Box>
              <Grid container spacing={3}>
                {/* Left Column - Business Setup */}
                <Grid item xs={12} md={7}>
                  <Typography variant="h5" fontWeight={600} gutterBottom>
                    Business Setup
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Set your rates and availability
                  </Typography>

                  {/* Smart Rate Calculator */}
                  {recommendedRate.avg > 0 && (
                    <Paper sx={{ p: 3, bgcolor: '#f0f4ff', mb: 3 }}>
                      <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AutoAwesomeIcon /> Smart Rate Recommendation
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }} color="text.secondary">
                        Based on your {educationLevel} degree and {experienceYears} years experience:
                      </Typography>
                      <Typography variant="h5" color="primary" sx={{ mb: 1 }}>
                        ${recommendedRate.min} - ${recommendedRate.max}/hour
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Market average for your qualifications: <strong>${recommendedRate.avg}/hour</strong>
                      </Typography>
                    </Paper>
                  )}

                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Your Hourly Rate"
                        type="number"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(Number(e.target.value || ''))}
                        fullWidth
                        error={!!errors.hourlyRate}
                        helperText={errors.hourlyRate || `Suggested: $${recommendedRate.avg}/hour`}
                        InputProps={{
                          startAdornment: <InputAdornment position="start">$</InputAdornment>,
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Currency</InputLabel>
                        <Select
                          value={currency}
                          label="Currency"
                          onChange={(e) => setCurrency(e.target.value)}
                        >
                          <MenuItem value="USD">USD ($)</MenuItem>
                          <MenuItem value="GBP">GBP (£)</MenuItem>
                          <MenuItem value="EUR">EUR (€)</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth error={!!errors.weeklyHours}>
                        <InputLabel>Weekly Availability</InputLabel>
                        <Select
                          value={weeklyHours}
                          label="Weekly Availability"
                          onChange={(e) => setWeeklyHours(e.target.value)}
                        >
                          <MenuItem value="<20">Less than 20 hrs/week (Part-time)</MenuItem>
                          <MenuItem value="20-40">20-40 hrs/week (Regular)</MenuItem>
                          <MenuItem value="40+">40+ hrs/week (Full-time)</MenuItem>
                        </Select>
                        {errors.weeklyHours && (
                          <Typography variant="caption" color="error">
                            {errors.weeklyHours}
                          </Typography>
                        )}
                      </FormControl>
                      {hourlyRate && weeklyHours && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          💰 Estimated monthly income: 
                          {weeklyHours === '<20' && ` $${Math.round(Number(hourlyRate) * 15 * 4)}`}
                          {weeklyHours === '20-40' && ` $${Math.round(Number(hourlyRate) * 30 * 4)}`}
                          {weeklyHours === '40+' && ` $${Math.round(Number(hourlyRate) * 40 * 4)}+`}
                        </Typography>
                      )}
                    </Grid>

                    <Grid item xs={12}>
                      <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                        Preferred Format
                      </Typography>
                      <Stack direction="row" spacing={2} flexWrap="wrap">
                        {['Online', 'In-person', 'Hybrid'].map((fmt) => (
                          <Chip
                            key={fmt}
                            label={fmt}
                            onClick={() => toggleFormat(fmt)}
                            color={formatPreference.includes(fmt) ? 'primary' : 'default'}
                            variant={formatPreference.includes(fmt) ? 'filled' : 'outlined'}
                          />
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>

                {/* Right Column - Match Prediction */}
                <Grid item xs={12} md={5}>
                  <Paper sx={{ p: 3, height: '100%', position: 'sticky', top: 120 }}>
                    <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupIcon /> Student Match Prediction
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Avatar sx={{ bgcolor: '#4caf50', width: 56, height: 56 }}>
                          <TrendingUpIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight={600}>High Match Potential</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Based on your profile
                          </Typography>
                        </Box>
                      </Box>
                      
                      <Box sx={{ p: 2, bgcolor: '#e8f5e9', borderRadius: 1, mb: 2 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                          Estimated time to first student:
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          2-7 days
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Based on demand for {specialization[0] || 'your subjects'} in {timeZone}
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" sx={{ mb: 2 }}>
                      Your Profile Highlights
                    </Typography>
                    <Stack spacing={1}>
                      {educationLevel && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                          <Typography variant="body2">{educationLevel} Education</Typography>
                        </Box>
                      )}
                      {experienceYears && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                          <Typography variant="body2">{experienceYears}+ Years Experience</Typography>
                        </Box>
                      )}
                      {specialization.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                          <Typography variant="body2">{specialization.length} Subject{specialization.length > 1 ? 's' : ''}</Typography>
                        </Box>
                      )}
                      {hourlyRate && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CheckCircleIcon sx={{ fontSize: 18, color: '#4caf50' }} />
                          <Typography variant="body2">Competitive Rate (${hourlyRate}/hr)</Typography>
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )

      case 3:
        return (
          <Fade in timeout={500}>
            <Box>
              <Typography variant="h5" fontWeight={600} gutterBottom>
                Verification & Documents
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Verified tutors are trusted more by students and receive 2x more bookings
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Identity Verification (Optional but recommended)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Upload a government-issued ID to verify your identity
                    </Typography>
                    <Button variant="outlined" component="label">
                      {idUpload ? 'Change Document' : 'Upload ID / Passport'}
                      <input
                        hidden
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) => setIdUpload(e.target.files?.[0] || null)}
                      />
                    </Button>
                    {idUpload && (
                      <Typography variant="body2" sx={{ mt: 1 }} color="success.main">
                        ✓ {idUpload.name}
                      </Typography>
                    )}
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                      Professional Documents (Optional)
                    </Typography>
                    <Stack spacing={2}>
                      <Box>
                        <Button variant="outlined" component="label" size="small">
                          {resumeUpload ? 'Change Resume' : 'Upload Resume/CV'}
                          <input
                            hidden
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => setResumeUpload(e.target.files?.[0] || null)}
                          />
                        </Button>
                        {resumeUpload && (
                          <Typography variant="caption" sx={{ ml: 2 }} color="success.main">
                            ✓ {resumeUpload.name}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Button variant="outlined" component="label" size="small">
                          {qualificationsUpload ? 'Change Certificates' : 'Upload Certificates'}
                          <input
                            hidden
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={(e) => setQualificationsUpload(e.target.files?.[0] || null)}
                          />
                        </Button>
                        {qualificationsUpload && (
                          <Typography variant="caption" sx={{ ml: 2 }} color="success.main">
                            ✓ {qualificationsUpload.name}
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                {country === 'United States' && (
                  <Grid item xs={12}>
                    <TextField
                      label="Social Security Number (SSN)"
                      value={ssn}
                      onChange={(e) => setSsn(e.target.value)}
                      fullWidth
                      error={!!errors.ssn}
                      helperText={errors.ssn || 'Required for US tax compliance (encrypted & secure)'}
                      type="password"
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={certify}
                        onChange={(e) => setCertify(e.target.checked)}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        I certify that all information provided is accurate and I agree to the{' '}
                        <Link href="#" underline="hover">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="#" underline="hover">
                          Tutor Agreement
                        </Link>
                      </Typography>
                    }
                  />
                  {errors.certify && (
                    <Typography color="error" variant="caption">
                      {errors.certify}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )

      case 4:
        return (
          <Fade in timeout={500}>
            <Box>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <AutoAwesomeIcon sx={{ fontSize: 60, color: '#7b1fa2', mb: 2 }} />
                <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: '#7b1fa2' }}>
                  Launch Ready! 🎉
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  One final step — complete your registration to start teaching
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                  { label: 'Profile Quality', value: `${profileQuality}/100`, color: profileQuality >= 70 ? '#4caf50' : '#ff9800' },
                  { label: 'Subjects', value: specialization.length || 0, color: '#2196f3' },
                  { label: 'Hourly Rate', value: `$${hourlyRate || 0}`, color: '#9c27b0' },
                  { label: 'Weekly Hours', value: weeklyHours || 'Not set', color: '#ff9800' }
                ].map((metric, i) => (
                  <Grid item xs={6} md={3} key={i}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {metric.label}
                      </Typography>
                      <Typography variant="h6" sx={{ color: metric.color, fontWeight: 600 }}>
                        {metric.value}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  mb: 4,
                }}
              >
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  💳 Registration Fee
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  A one-time fee of <strong>$30 USD</strong> activates your professional tutor profile:
                </Typography>
                <Stack spacing={1} sx={{ pl: 2 }}>
                  <Typography variant="body2">✓ Unlimited student connections</Typography>
                  <Typography variant="body2">✓ Professional profile page</Typography>
                  <Typography variant="body2">✓ Secure payment processing</Typography>
                  <Typography variant="body2">✓ Priority customer support</Typography>
                </Stack>
              </Paper>

              {!paymentCompleted ? (
                <Box>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 2 }}>
                    Select Payment Method:
                  </Typography>
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {[
                      { name: 'PayPal', icon: <SiPaypal size={28} color="#0070ba" />, color: '#0070ba' },
                      { name: 'Credit Card', icon: <CreditCardIcon sx={{ fontSize: 28, color: '#1976d2' }} />, color: '#1976d2' },
                      { name: 'Stripe', icon: <SiStripe size={28} color="#6772e5" />, color: '#6772e5' },
                    ].map((method) => (
                      <Grid item xs={12} sm={4} key={method.name}>
                        <Card
                          onClick={() => !processingPayment && setPaymentMethod(method.name)}
                          sx={{
                            cursor: processingPayment ? 'not-allowed' : 'pointer',
                            opacity: processingPayment ? 0.6 : 1,
                            border: paymentMethod === method.name ? `3px solid ${method.color}` : '2px solid #e0e0e0',
                            backgroundColor: paymentMethod === method.name ? `${method.color}08` : 'white',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: 3,
                              borderColor: method.color,
                            },
                          }}
                        >
                          <CardContent sx={{ textAlign: 'center', py: 3 }}>
                            <Box sx={{ mb: 1 }}>{method.icon}</Box>
                            <Typography variant="body2" fontWeight={600}>
                              {method.name}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>

                  {paymentError && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                      {paymentError}
                    </Alert>
                  )}
                  {successMessage && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                      {successMessage}
                    </Alert>
                  )}
                  {errors.payment && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {errors.payment}
                    </Alert>
                  )}

                  {paymentMethod && (
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      size="large"
                      onClick={() => processPayment(paymentMethod)}
                      disabled={processingPayment}
                      startIcon={processingPayment ? <CircularProgress color="inherit" size={20} /> : null}
                      sx={{ py: 1.5, fontSize: '1rem', fontWeight: 600 }}
                    >
                      {processingPayment ? 'Processing...' : `Pay $30 with ${paymentMethod}`}
                    </Button>
                  )}
                </Box>
              ) : (
                <Paper
                  sx={{
                    p: 3,
                    backgroundColor: '#e8f5e9',
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 3,
                  }}
                >
                  <CheckCircleIcon sx={{ fontSize: 48, color: '#2e7d32' }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: '#2e7d32', fontWeight: 600 }}>
                      Payment Successful!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your registration is complete. Click below to launch your profile.
                    </Typography>
                  </Box>
                </Paper>
              )}
            </Box>
          </Fade>
        )

      default:
        return null
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Sticky Progress Header */}
      <Paper
        elevation={2}
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          py: 2,
          px: 4,
          backgroundColor: 'white',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              Professional Tutor Registration
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Step {activeStep + 1} of {STEPS.length}
              </Typography>
              <Chip
                label={`${getCompletionPercentage()}% Complete`}
                color="primary"
                size="small"
                icon={<CheckCircleIcon />}
              />
            </Box>
          </Box>
          <LinearProgress
            variant="determinate"
            value={getCompletionPercentage()}
            sx={{
              height: 8,
              borderRadius: 1,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              },
            }}
          />
        </Box>
      </Paper>

      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, py: 6 }}>
        <Grid container spacing={4}>
          {/* Stepper Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                position: { md: 'sticky' },
                top: 120,
                borderRadius: 2,
                border: '1px solid #e0e0e0',
              }}
            >
              <Stepper activeStep={activeStep} orientation="vertical">
                {STEPS.map((label, index) => (
                  <Step key={label} completed={completedSteps.has(index)}>
                    <StepLabel
                      sx={{
                        cursor: index < activeStep || completedSteps.has(index) ? 'pointer' : 'default',
                        '& .MuiStepLabel-label': {
                          fontSize: '0.875rem',
                          fontWeight: index === activeStep ? 600 : 400,
                        },
                      }}
                      onClick={() => handleStepClick(index)}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              {successMessage && activeStep === 4 && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {successMessage}
                </Alert>
              )}

              {renderStepContent()}

              <Divider sx={{ my: 4 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ArrowBackIcon />}
                >
                  Back
                </Button>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="text"
                    startIcon={<SaveIcon />}
                    sx={{ display: { xs: 'none', sm: 'flex' } }}
                  >
                    Save & Exit
                  </Button>
                  {activeStep < STEPS.length - 1 ? (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      endIcon={<ArrowForwardIcon />}
                      size="large"
                    >
                      Continue
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={creatingProfile || !paymentCompleted}
                      startIcon={creatingProfile ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
                      size="large"
                      sx={{
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      {creatingProfile ? 'Creating Profile...' : 'Launch Your Tutor Profile'}
                    </Button>
                  )}
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
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