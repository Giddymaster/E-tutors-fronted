import React, { useEffect, useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

interface Job {
  id: string
  title: string
  subject: string
  description: string
  budget: number
  studentName: string
  createdAt: string
  status?: string
}

export default function AvailableJobs() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      // Try to fetch from API first, fallback to localStorage mock data
      try {
        const res = await api.get('/assignments')
        setJobs(res.data.assignments || [])
      } catch {
        // Fallback to localStorage for demo purposes
        const stored = localStorage.getItem('et_assignments_v1')
        if (stored) {
          const assignments = JSON.parse(stored)
          // Filter to show only assignments without accepted bids
          const availableJobs = assignments
            .filter((a: any) => !a.acceptedBidId)
            .map((a: any) => ({
              id: a.id,
              title: a.title,
              subject: a.subject,
              description: a.description,
              budget: a.budget,
              studentName: a.createdBy || 'Anonymous',
              createdAt: new Date().toISOString(),
              bidsCount: a.bids?.length || 0,
            }))
          setJobs(availableJobs)
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyJob = async (jobId: string) => {
    if (!user) return navigate('/login')

    const bidAmount = prompt('Enter your bid amount (USD):')
    if (!bidAmount) return

    const amount = Number(bidAmount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount')
      return
    }

    try {
      // Try to submit via API
      try {
        await api.post(`/assignments/${jobId}/bid`, { amount })
        setAppliedJobs((prev) => new Set(prev).add(jobId))
        alert('Bid submitted successfully!')
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
                  ...a.bids,
                  {
                    id: Date.now().toString(),
                    tutorId: user.id,
                    tutorName: user.name,
                    amount,
                    message: '',
                  },
                ],
              }
            }
            return a
          })
          localStorage.setItem('et_assignments_v1', JSON.stringify(updated))
          setAppliedJobs((prev) => new Set(prev).add(jobId))
          alert('Bid submitted successfully!')
        }
      }
    } catch (err) {
      console.error('Error applying for job:', err)
      alert('Failed to submit bid')
    }
  }

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
          Available Jobs
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Browse and bid on available tutoring opportunities from students.
        </Typography>

        <TextField
          fullWidth
          placeholder="Search by title, subject, or description..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredJobs.length === 0 ? (
        <Card sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            {jobs.length === 0 ? 'No jobs available yet' : 'No jobs match your search'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Check back later for more opportunities or refine your search.
          </Typography>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => {
            const hasApplied = appliedJobs.has(job.id)

            return (
              <Grid item xs={12} md={6} lg={4} key={job.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 3,
                      transform: 'translateY(-4px)',
                    },
                  }}
                >
                  <CardContent sx={{ pb: 1, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {job.title}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={job.subject}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '3em' }}>
                      {job.description.length > 100
                        ? `${job.description.substring(0, 100)}...`
                        : job.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        ${job.budget}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Posted by {job.studentName}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ pt: 1 }}>
                    <Button
                      fullWidth
                      variant={hasApplied ? 'outlined' : 'contained'}
                      color={hasApplied ? 'success' : 'primary'}
                      onClick={() => handleApplyJob(job.id)}
                      disabled={hasApplied}
                    >
                      {hasApplied ? '✓ Bid Submitted' : 'Place Bid'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}
    </Container>
  )
}
