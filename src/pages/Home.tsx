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
    navigate(`/login?${params.toString()}`)
  }

  return (
    <>
      {/* ✅ Hero Section with Grid layout */}
      <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
        <Grid container sx={{ minHeight: '100vh' }}>
          {/* Left side - Content */}
          <Grid item xs={12} md={6} sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: { xs: 3, md: 6 },
            backgroundColor: '#ffffff',
            position: 'relative',
            zIndex: 1,
            boxShadow: { md: '4px 0 15px rgba(0, 0, 0, 0.1)' }
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
                    Find The Right Tutor For Your Goals!
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
                onChange={(e) => setQuery(e.target.value)}
                sx={{ 
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f8f8'
                  }
                }}
                size="medium"
                fullWidth
              />
              <TextField
                placeholder="Location (optional)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                sx={{ 
                  width: { xs: '100%', sm: 240 },
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f8f8f8'
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
                Search tutors
              </Button>
            </Paper>
          </Box>
              </Box>
            </Container>
          </Grid>

          {/* Right side - Image */}
          <Grid item xs={12} md={6} sx={{ 
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            minHeight: '100vh',
            overflow: 'hidden'
          }}>
            <Box
              component="img"
              src="https://images.pexels.com/photos/6929168/pexels-photo-6929168.jpeg"
              alt="Student writing"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                position: 'absolute',
                top: 0,
                right: 0,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            />
          </Grid>
        </Grid>
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
          <Button variant="contained" size="large" component={Link} to="/login">
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
