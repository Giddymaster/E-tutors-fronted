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
  bids?: any[]
  bidsCount?: number
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
        // assignments may include bids; filter accepted and map
        const apiJobs = (res.data.assignments || [])
          .filter((a: any) => !a.acceptedBidId && ((a.bids || []).length < 5))
          .map((a: any) => ({
            ...a,
            bids: a.bids || [],
            bidsCount: (a.bids || []).length,
            createdAt: a.createdAt || new Date().toISOString(),
        }))
        setJobs(apiJobs)
        // compute applied if user is a tutor
        if (user) {
          const appliedIds = (apiJobs as any[])
            .filter(j => (j.bids || []).some((b: any) => b.tutorId === user.id))
            .map(j => String(j.id))
          setAppliedJobs(new Set<string>(appliedIds))
        }
      } catch {
        // Fallback to localStorage for demo purposes
        const stored = localStorage.getItem('et_assignments_v1')
        if (stored) {
          const assignments = JSON.parse(stored)
          // Filter to show only assignments without accepted bids and with fewer than 5 bids
          const availableJobs = assignments
            .filter((a: any) => !a.acceptedBidId && ((a.bids || []).length < 5))
            .map((a: any) => ({
              id: a.id,
              title: a.title,
              subject: a.subject,
              description: a.description,
              budget: a.budget,
              studentName: a.createdBy || 'Anonymous',
              createdAt: a.createdAt || new Date().toISOString(),
              bids: a.bids || [],
              bidsCount: a.bids?.length || 0,
            }))
          setJobs(availableJobs)
          if (user) {
            const appliedIds = availableJobs.filter((j: any) => (j.bids || []).some((b: any) => b.tutorId === user.id)).map((j: any) => String(j.id))
            setAppliedJobs(new Set<string>(appliedIds))
          }
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleApplyJob = (jobId: string) => {
    if (!user) return navigate('/login')
    // Navigate to bid page with job ID
    navigate(`/bid/${jobId}`)
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
          {filteredJobs.map((job) => (
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
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="caption" color="text.secondary" display="block">
                        Posted by {job.studentName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {(() => {
                          try {
                            const minutes = Math.max(0, Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 60000))
                            return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
                          } catch (e) {
                            return ''
                          }
                        })()}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ pt: 1 }}>
                  {appliedJobs.has(job.id) ? (
                    <Button fullWidth variant="outlined" color="success" disabled>
                      ✓ Bid Submitted
                    </Button>
                  ) : (
                    <Button fullWidth variant="contained" color="primary" onClick={() => handleApplyJob(job.id)}>
                      Place Bid
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}
