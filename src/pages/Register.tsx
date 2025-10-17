import React, { useState } from 'react'
import { Container, Typography, Box, Button, Paper, TextField, Grid } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import Testimonials from '../components/Testimonials'

// const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'English', 'Biology', 'Computer Science', 'Economics']

export default function Home() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [selectedSubject, setSelectedSubject] = useState(null)
  const navigate = useNavigate()

  const doSearch = () => {
    const params = new URLSearchParams()
    if (selectedSubject) params.set('subject', selectedSubject)
    if (query) params.set('q', query)
    if (location) params.set('location', location)
    navigate(`/tutors?${params.toString()}`)
  }

  return (
    <>
      {/* ✅ Hero Section with clear background image */}
      <Box
        sx={{
          position: 'relative',
          pb: 10,
          backgroundImage:
            'url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwzKEaVaKLO2XlD7yUFTAGHPS5uZ8HXo3XFA&s")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#169b73ff',
        }}
      >
        <Container sx={{ textAlign: 'center', zIndex: 2 }}>
          {/* ✅ Marquee title (black, 30s, left → right) */}
          <Box
            sx={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              mb: 4,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                display: 'inline-block',
                fontWeight: 900,
                color: '#000000', // Black color
                letterSpacing: '-0.02em',
                textShadow: '2px 2px 6px rgba(255,255,255,0.4)',
                animation: 'marquee 30s linear infinite',
                '@keyframes marquee': {
                  '0%': { transform: 'translateX(-100%)' },
                  '100%': { transform: 'translateX(100%)' },
                },
                '&:hover': { animationPlayState: 'paused' },
              }}
            >
              Find the right tutor for your goals
            </Typography>
          </Box>

          {/* ✅ Subtitle (static text now) */}
          <Typography
            variant="h6"
            sx={{
              mb: 4,
              color: '#ffffff',
              textShadow: '1px 1px 4px rgba(0,0,0,0.5)',
            }}
          >
            Personalized lessons, verified tutors, and transparent hourly rates. Get the help you
            need — online or in person.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper
              elevation={6}
              sx={{
                p: { xs: 2, md: 3 },
                display: 'flex',
                gap: 2,
                alignItems: 'center',
                width: '100%',
                maxWidth: 980,
                borderRadius: 3,
                backdropFilter: 'blur(8px)',
                backgroundColor: 'rgba(255,255,255,0.15)',
              }}
            >
              <TextField
                placeholder="Subject or skill (e.g. Calculus)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                sx={{ flex: 1, input: { color: '#fff' } }}
                InputLabelProps={{ style: { color: '#fff' } }}
                size="medium"
              />
              <TextField
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{ width: 240, input: { color: '#fff' } }}
                InputLabelProps={{ style: { color: '#fff' } }}
                size="medium"
              />
              <Button
                variant="contained"
                size="large"
                onClick={doSearch}
                sx={{
                  px: 4,
                  background: 'linear-gradient(90deg,#2b7cff,#1a5ed8)',
                  color: '#fff',
                }}
              >
                Search tutors
              </Button>
            </Paper>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              component={Link}
              to="/tutors"
              size="large"
              sx={{
                px: 4,
                background: 'linear-gradient(90deg,#2b7cff,#1a5ed8)',
                color: '#fff',
              }}
            >
              Find a tutor
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/register"
              sx={{ color: '#fff', borderColor: '#fff' }}
            >
              Sign up
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ✅ “Recommended tutors” section removed */}

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
          <Button variant="contained" size="large" component={Link} to="/tutors">
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

      <Box component="footer" sx={{ mt: 6, py: 6, backgroundColor: '#f7f9fc' }}>
        <Container>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6">For students — your learning matters</Typography>
              <Typography variant="body2" color="text.secondary">
                Share your goals and areas you'd like help with. We'll recommend vetted tutors and
                show hourly rates and ratings to help you decide.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button variant="outlined" component={Link} to="/register?role=TUTOR">
                Become a tutor
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                © {new Date().getFullYear()} Excellent Tutors
              </Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
