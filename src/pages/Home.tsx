import React, { useState, useEffect, useRef } from 'react'
import { Container, Typography, Box, Button, Paper, TextField, Grid, CircularProgress, Alert } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import Testimonials from '../components/Testimonials'
import TutorCard from '../components/TutorCard'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

// const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'English', 'Biology', 'Computer Science', 'Economics']

interface Job {
  id: string
  title: string
  subject: string
  description: string
  budget: number
  studentName: string
  createdAt: string
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [results, setResults] = useState<any[]>([])
  const [loadingResults, setLoadingResults] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [inputError, setInputError] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(true)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // If a tutor is already logged in and visits the public homepage, redirect
    // them to their private tutor landing so they get a tailored experience.
    if (user && user.role === 'TUTOR') {
      navigate('/available-jobs')
    }
    // only run when user changes
  }, [user, navigate])

  const fetchJobs = async () => {
    try {
      // Try to fetch from API first, fallback to localStorage mock data
      try {
        const res = await api.get('/assignments')
        const availableJobs = (res.data.assignments || [])
          .filter((a: any) => !a.acceptedBidId)
          .slice(0, 3) // Show only first 3 jobs on home page
          .map((a: any) => ({
            id: a.id,
            title: a.title,
            subject: a.subject,
            description: a.description,
            budget: a.budget,
            studentName: a.createdBy || 'Anonymous',
            createdAt: new Date().toISOString(),
          }))
        setJobs(availableJobs)
      } catch {
        // Fallback to localStorage for demo purposes
        const stored = localStorage.getItem('et_assignments_v1')
        if (stored) {
          const assignments = JSON.parse(stored)
          const availableJobs = assignments
            .filter((a: any) => !a.acceptedBidId)
            .slice(0, 3)
            .map((a: any) => ({
              id: a.id,
              title: a.title,
              subject: a.subject,
              description: a.description,
              budget: a.budget,
              studentName: a.createdBy || 'Anonymous',
              createdAt: new Date().toISOString(),
            }))
          setJobs(availableJobs)
        }
      }
    } catch (err) {
      console.error('Error fetching jobs:', err)
    } finally {
      setLoadingJobs(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [])

  const doSearch = async () => {
    // Validate input: require subject/query
    setInputError(null)
    setSearchError(null)
    const qTrim = query.trim()
    if (!qTrim) {
      setInputError('Please enter a subject or skill')
      return
    }
    // Fetch tutors from the server (we include q & subject as params so backend
    // can support server-side filtering later). We still perform client-side
    // filtering for compatibility with current backend behavior.
    setLoadingResults(true)
    setSearchError(null)
    try {
      const res = await api.get('/tutors', { params: { q: qTrim, subject: selectedSubject } })
      const tutors = res.data.tutors || []

  const q = qTrim.toLowerCase()
      const filtered = tutors.filter((t: any) => {
        // name from included user object
        const name = (t.user && t.user.name) || t.name || ''
        const bio = t.bio || ''
        const subjects: string[] = Array.isArray(t.subjects) ? t.subjects : (t.subjects || [])

        const matchesQuery = !q || name.toLowerCase().includes(q) || bio.toLowerCase().includes(q) || subjects.join(' ').toLowerCase().includes(q)
        const matchesSubject = !selectedSubject || subjects.map(s => s.toLowerCase()).includes(String(selectedSubject).toLowerCase())
        return matchesQuery && matchesSubject
      })

      // map to shape expected by TutorCard (tutor.name, tutor.bio, tutor.id)
      const shaped = filtered.map((t: any) => ({ id: t.id, name: (t.user && t.user.name) || t.name, bio: t.bio || '', raw: t }))
      setResults(shaped)
    } catch (err: any) {
      console.error('Search error', err)
      // show API errors inline on the input like the validation message
      setInputError(err?.message || 'Failed to fetch tutors')
    } finally {
      setLoadingResults(false)
    }
  }

  // Debounce searches when typing. The Search button still triggers immediate search.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    // if query is empty, clear results and don't search
    const qTrim = query.trim()
    if (!qTrim) {
      setResults([])
      setInputError(null)
      return
    }

    // debounce
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      doSearch()
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, selectedSubject])

  return (
    <>
      {/* ✅ Hero Section with Grid layout */}
      <Box sx={{ 
        position: 'relative',
        minHeight: '100vh'
      }}>
        {/* Mobile Background Image */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            display: { xs: 'block', md: 'none' },
            overflow: 'hidden'
          }}
        >
          <Box
            component="img"
            src="https://images.pexels.com/photos/6326370/pexels-photo-6326370.jpeg"
            alt="Woman tutoring young boy"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          {/* Dark overlay for better text visibility on mobile */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.3)'
            }}
          />
        </Box>

        {/* Desktop Layout */}
        <Grid container sx={{ minHeight: '100vh' }}>
          {/* Left side - Content */}
          <Grid item xs={12} md={6} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: { xs: 3, md: 6 },
            backgroundColor: '#f1dbb9ff',
            position: 'relative',
            zIndex: 1,
            boxShadow: '4px 0 15px rgba(0, 0, 0, 0.1)',
            minHeight: '100vh'
          }}>
            <Container maxWidth="sm">
              <Box sx={{ 
                textAlign: { xs: 'center', md: 'left' },
                maxWidth: '500px',
                mx: 'auto'
              }}>
                {/* ✅ Title */}
                <Box 
                  sx={{ 
                    mb: 4,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    width: '100%'
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 900,
                      color: '#13aa05ff',
                      letterSpacing: '-0.02em',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2,
                      mb: 2,
                      display: 'inline-block',
                      animation: 'marquee 30s linear infinite',
                      '@keyframes marquee': {
                        '0%': { transform: 'translateX(100%)' },
                        '100%': { transform: 'translateX(-100%)' }
                      },
                      '&:hover': {
                        animationPlayState: 'paused'
                      }
                    }}
                  >
                    Find The Right Tutors
                  </Typography>
                </Box>

                {/* ✅ Subtitle */}
                <Typography
                  variant="h6"
                  sx={{
                    mb: 4,
                    color: '#555555',
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    lineHeight: 1.6,
                    fontWeight: 'normal'
                  }}
                >
                  Personalized lessons, verified tutors, and transparent hourly rates. Get the help you
                  need — online or in person.
                </Typography>

          {/* ✅ Search Section */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={3}
              sx={{
                p: { xs: 2, md: 3 },
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2,
                alignItems: 'center',
                width: '100%',
                maxWidth: 980,
                borderRadius: 2,
                backgroundColor: '#ffffff',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }}
            >
              <TextField
                placeholder="Subject or skill (e.g. Calculus)"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  if (inputError) setInputError(null)
                }}
                error={!!inputError}
                helperText={inputError || ''}
                sx={{ 
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f8f8ff'
                  }
                }}
                size="medium"
                fullWidth
              />
              <Button
                variant="contained"
                size="large"
                onClick={doSearch}
                sx={{
                  px: { xs: 2, sm: 4 },
                  py: 1.5,
                  width: { xs: '100%', sm: 'auto' },
                  backgroundColor: '#13aa05ff',
                  color: '#fff',
                  fontWeight: 600,
                  '&:hover': {
                    backgroundColor: '#118c04',
                  }
                }}
              >
                Search tutor
              </Button>
            </Paper>
          </Box>
              </Box>
            </Container>
          </Grid>

          {/* Desktop Right side - Image */}
          <Grid item xs={12} md={6} sx={{ 
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            minHeight: '100vh',
            overflow: 'hidden'
          }}>
            <style>{`
              .carousel-image {
                display: none;
              }
            `}</style>
            <Box
              component="img"
              src="https://images.pexels.com/photos/6326370/pexels-photo-6326370.jpeg"
              alt="Man discussing via smartphone"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '75% center',
                transformOrigin: 'right center',
                position: 'absolute',
                top: 0,
                right: 0,
                '&:hover': {
                  filter: 'brightness(1.05)'
                }
              }}
            />
            <Box
              component="img"
              src="https://images.pexels.com/photos/7713994/pexels-photo-7713994.jpeg"
              alt="Man with sheet music at computer"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: '75% center',
                transformOrigin: 'right center',
                position: 'absolute',
                top: 0,
                right: 0,
                '&:hover': {
                  filter: 'brightness(1.05)'
                }
              }}
            />
            <Box
              component="img"
              src="https://images.istockphoto.com/photo/young-beautiful-woman-in-headphones-working-with-laptop-inside-office-at-workplace-gm1963249822-557964692?utm_source=pexels&utm_medium=affiliate&utm_campaign=sponsored_photo&utm_content=srp_inline_media&utm_term=online%20tutoring"
              alt="Woman with headphones working at laptop"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center center',
                transformOrigin: 'right center',
                position: 'absolute',
                top: 0,
                right: 0,
                clipPath: 'inset(15% 0 15% 0)',
                '&:hover': {
                  filter: 'brightness(1.05)'
                }
              }}
            />
          </Grid>
        </Grid>

        {/* Mobile Content Overlay */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            p: { xs: 3, md: 6 }
          }}
        >
          <Container maxWidth="sm">
            <Box sx={{ 
              textAlign: 'center',
              maxWidth: '500px',
              mx: 'auto'
            }}>
              {/* ✅ Title */}
              <Box 
                sx={{ 
                  mb: 4,
                  overflow: 'visible',
                  width: '100%'
                }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    color: '#13aa05ff',
                    letterSpacing: '-0.02em',
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                    mb: 2,
                    animation: 'marquee 30s linear infinite',
                    '@keyframes marquee': {
                      '0%': { transform: 'translateX(0)' },
                      '100%': { transform: 'translateX(0)' }
                    },
                    '&:hover': {
                      animationPlayState: 'paused'
                    }
                  }}
                >
                  Find The Right Tutors
                </Typography>
              </Box>

              {/* ✅ Subtitle */}
              <Typography
                variant="h6"
                sx={{
                  mb: 4,
                  color: '#555555',
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                  lineHeight: 1.6,
                  fontWeight: 'normal'
                }}
              >
                Personalized lessons, verified tutors, and transparent hourly rates. Get the help you
                need — online or in person.
              </Typography>

              {/* ✅ Search Section */}
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Paper
                  elevation={3}
                  sx={{
                    p: { xs: 2, md: 3 },
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: 980,
                    borderRadius: 2,
                    backgroundColor: '#ffffff',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <TextField
                    placeholder="Subject or skill (e.g. Calculus)"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      if (inputError) setInputError(null)
                    }}
                    error={!!inputError}
                    helperText={inputError || ''}
                    sx={{ 
                      flex: 1,
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f8f8f8ff'
                      }
                    }}
                    size="medium"
                    fullWidth
                  />
                  <Button
                    variant="contained"
                    size="large"
                    onClick={doSearch}
                    sx={{
                      px: { xs: 2, sm: 4 },
                      py: 1.5,
                      width: { xs: '100%', sm: 'auto' },
                      backgroundColor: '#13aa05ff',
                      color: '#fff',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#118c04',
                      }
                    }}
                  >
                    Search tutor
                  </Button>
                </Paper>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>

      {/* ✅ Search results (visible when logged in) */}
      <Container sx={{ mt: 4 }}>
        {loadingResults && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* API errors are shown inline on the search input via helperText */}

        {/* Show results or a friendly no-results message when search completed */}
        {!loadingResults && results && results.length > 0 && (
          <Box sx={{ my: 4 }}>
            <Typography variant="h5" gutterBottom>
              Search results
            </Typography>
            <Grid container spacing={2}>
              {results.map((t) => (
                <Grid item xs={12} sm={6} md={4} key={t.id}>
                  <TutorCard tutor={t} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {!loadingResults && query.trim() && results && results.length === 0 && (
          <Box sx={{ my: 4 }}>
            <Typography variant="h6" color="text.secondary">No tutors found for "{query.trim()}".</Typography>
          </Box>
        )}
      </Container>

      {/* ✅ Available Jobs Section */}
      <Container sx={{ mt: 8, mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
            💼 Available Tutoring Jobs
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Students are looking for tutors! Browse available opportunities and bid on jobs that match your expertise.
          </Typography>
        </Box>

        {loadingJobs ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : jobs.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', backgroundColor: '#f5f5f5' }}>
            <Typography variant="body1" color="text.secondary">
              No available jobs yet. Check back soon!
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {jobs.map((job) => (
              <Grid item xs={12} md={4} key={job.id}>
                <Paper
                  sx={{
                    p: 2,
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
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {job.title}
                  </Typography>
                  <Box sx={{ mb: 1 }}>
                    <Typography variant="caption" sx={{ backgroundColor: '#e3f2fd', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                      {job.subject}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                    {job.description.length > 80 ? `${job.description.substring(0, 80)}...` : job.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                      ${job.budget}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {job.studentName}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={() => {
              if (user && user.role === 'TUTOR') {
                navigate('/available-jobs')
              } else {
                navigate('/login')
              }
            }}
          >
            {user && user.role === 'TUTOR' ? 'View All Available Jobs' : 'Login to Bid on Jobs'}
          </Button>
        </Box>
      </Container>

      {/* ✅ Recommended Tutors Section Removed */}

      <Container sx={{ mt: 8 }}>
        <Box sx={{ my: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">1. Tell us your goal</Typography>
              <Typography>
                Share the subject and what you want to improve — we’ll suggest good matches.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">2. Compare tutors</Typography>
              <Typography>
                See hourly rates, ratings, and specialties to pick the right tutor.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">3. Book & learn</Typography>
              <Typography>
                Schedule a lesson, review your session, and continue progress with the same tutor.
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ textAlign: 'center', my: 6 }}>
          <Typography variant="h5" gutterBottom>
            Ready to find a tutor?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              // if user is logged in, send them to the tutors listing (Find a Tutor); otherwise go to login
              if (user) navigate('/tutors')
              else navigate('/login')
            }}
          >
            Find a tutor
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            What students say
          </Typography>
          <Testimonials />
        </Box>
      </Container>
    </>
  )
}
