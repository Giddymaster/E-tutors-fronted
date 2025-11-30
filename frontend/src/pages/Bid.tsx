import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  Card,
  CardContent,
  CircularProgress,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

interface Job {
  id: string
  title: string
  subject: string
  description: string
  budget: number
  studentName: string
}

export default function Bid() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { jobId } = useParams<{ jobId: string }>()

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [bidMessage, setBidMessage] = useState('')
  const [hourlyRate, setHourlyRate] = useState<number | ''>('')
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})

  // Redirect if not a tutor
  useEffect(() => {
    if (user && user.role !== 'TUTOR') {
      navigate('/login')
    }
  }, [user, navigate])

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        // Try to fetch from API first
        try {
          const res = await api.get(`/assignments/${jobId}`)
          setJob(res.data.assignment)
        } catch {
          // Fallback to localStorage
          const stored = localStorage.getItem('et_assignments_v1')
          if (stored) {
            const assignments = JSON.parse(stored)
            const foundJob = assignments.find((a: any) => a.id === jobId)
            if (foundJob) {
              setJob({
                id: foundJob.id,
                title: foundJob.title,
                subject: foundJob.subject,
                description: foundJob.description,
                budget: foundJob.budget,
                studentName: foundJob.createdBy || 'Anonymous',
              })
            } else {
              setError('Job not found')
            }
          } else {
            setError('Job not found')
          }
        }
      } catch (err) {
        console.error('Error fetching job:', err)
        setError('Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      fetchJob()
    }
  }, [jobId])

  const validate = () => {
    const errors: { [key: string]: string } = {}

    if (!bidMessage.trim()) {
      errors.bidMessage = 'Please provide a bidding message'
    } else if (bidMessage.trim().length < 20) {
      errors.bidMessage = 'Message must be at least 20 characters'
    }

    if (hourlyRate === '' || hourlyRate === 0) {
      errors.hourlyRate = 'Please enter your hourly rate'
    } else if (Number(hourlyRate) <= 0) {
      errors.hourlyRate = 'Rate must be greater than $0'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validate()) return
    if (!user) {
      setError('You must be logged in to place a bid')
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      const bidData = {
        jobId,
        tutorId: user.id,
        tutorName: user.name,
        message: bidMessage,
        rate: Number(hourlyRate),
        amount: job?.budget,
      }

      // Try to submit via API
      try {
        await api.post(`/assignments/${jobId}/bid`, {
          message: bidMessage,
          rate: Number(hourlyRate),
        })
      } catch {
        // Fallback: update localStorage
        const stored = localStorage.getItem('et_assignments_v1')
        if (stored) {
          const assignments = JSON.parse(stored)
          const updated = assignments.map((a: any) => {
            if (a.id === jobId) {
              return {
                ...a,
                bids: [
                  ...(a.bids || []),
                  {
                    id: Date.now().toString(),
                    tutorId: user.id,
                    tutorName: user.name,
                    message: bidMessage,
                    amount: Number(hourlyRate),
                    createdAt: new Date().toISOString(),
                  },
                ],
              }
            }
            return a
          })
          localStorage.setItem('et_assignments_v1', JSON.stringify(updated))
        }
      }

      setSuccess(true)
      setTimeout(() => {
        navigate('/available-jobs')
      }, 2000)
    } catch (err) {
      console.error('Error submitting bid:', err)
      setError('Failed to submit bid. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Container sx={{ py: 6, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!job) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Job not found</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/available-jobs')} sx={{ mt: 2 }}>
          Back to Available Jobs
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/available-jobs')}
        sx={{ mb: 3 }}
      >
        Back to Available Jobs
      </Button>

      <Grid container spacing={4}>
        {/* Job Details Card */}
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                Job Details
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Title
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {job.title}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Subject
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {job.subject}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Description
                </Typography>
                <Typography variant="body2">{job.description}</Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Student Budget
                </Typography>
                <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                  ${job.budget}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Posted by
                </Typography>
                <Typography variant="body1">{job.studentName}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Bid Form */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              Place Your Bid
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                ✓ Bid submitted successfully! Redirecting...
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              {/* Bidding Message */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Bidding Message
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Tell the student why you're the best fit for this job. Highlight your relevant experience and teaching approach.
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={5}
                  placeholder="Example: I have 5 years of Math tutoring experience and specialize in helping students understand complex concepts..."
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  error={!!formErrors.bidMessage}
                  helperText={formErrors.bidMessage || `${bidMessage.length}/500 characters`}
                  inputProps={{ maxLength: 500 }}
                />
              </Box>

              {/* Hourly Rate */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Your Hourly Rate (USD/hour)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Set the price you want to charge per hour for this tutoring job.
                </Typography>
                <TextField
                  fullWidth
                  type="number"
                  placeholder="e.g., 25"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value === '' ? '' : Number(e.target.value))}
                  error={!!formErrors.hourlyRate}
                  helperText={formErrors.hourlyRate}
                  inputProps={{
                    min: 0.01,
                    step: 0.01,
                  }}
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Box>

              {/* Summary */}
              <Paper sx={{ p: 2, backgroundColor: '#f5f5f5', mt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Student's Budget
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                  ${job.budget}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Your rate is shown as a reference. The final payment will depend on the actual hours worked and accepted terms.
                </Typography>
              </Paper>

              {/* Submit Button */}
              <Button
                variant="contained"
                size="large"
                type="submit"
                disabled={submitting || success}
                sx={{ mt: 3 }}
              >
                {submitting ? 'Submitting Bid...' : 'Submit Bid'}
              </Button>

              <Button
                variant="outlined"
                onClick={() => navigate('/available-jobs')}
                disabled={submitting}
              >
                Cancel
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
