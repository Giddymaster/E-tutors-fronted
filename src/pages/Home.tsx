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
      {/* ✅ Hero Section with background image */}
      <Box
        sx={{
          position: 'relative',
          pb: 10,
          backgroundImage:
            'url("https://blogs.unb.ca/newsroom/_media/images/2017/01/e1574fb983ca061524d768e5b0285556history_class-2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container sx={{ textAlign: 'center', zIndex: 2 }}>
          {/* ✅ Marquee Title */}
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
                color: '#13aa05ff', // black color
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
              Find The Right Tutor For Your Goals!
            </Typography>
          </Box>

          {/* ✅ Subtitle remains static */}
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

          {/* ✅ Search Section */}
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

          {/* ✅ Action Buttons */}
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

      {/* Footer removed. Use <Footer /> component where needed. */}
    </>
  )
}
