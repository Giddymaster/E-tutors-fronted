import React, { useState } from 'react'
import { Container, Typography, Box, Button, Paper, TextField, Chip, Grid } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import FeaturedTutors from '../components/FeaturedTutors'
import Testimonials from '../components/Testimonials'
import HeroIllustration from '../components/HeroIllustration'

const SUBJECTS = ['Math', 'Physics', 'Chemistry', 'English', 'Biology', 'Computer Science', 'Economics']

export default function Home() {
  const [query, setQuery] = useState('')
  const [location, setLocation] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
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
      <Box sx={{ background: 'linear-gradient(180deg, #f3f7ff 0%, #ffffff 40%)', pb: 6 }}>
        <Container sx={{ pt: 10 }}>
          <Grid container justifyContent="center">
            <Grid item xs={12} md={10}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-0.02em' }}>Find the right tutor for your goals</Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 760, mx: 'auto' }}>Personalized lessons, verified tutors, transparent hourly rates. Get the help you need — online or in person. Your privacy and progress are our priority.</Typography>

                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Paper elevation={6} sx={{ p: { xs: 2, md: 3 }, display: 'flex', gap: 2, alignItems: 'center', width: '100%', maxWidth: 980, borderRadius: 3 }}>
                    <TextField placeholder="Subject or skill (e.g. Calculus)" value={query} onChange={(e) => setQuery(e.target.value)} sx={{ flex: 1 }} size="medium" />
                    <TextField placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} sx={{ width: 240 }} size="medium" />
                    <Button variant="contained" size="large" onClick={doSearch} sx={{ px: 4, background: 'linear-gradient(90deg,#2b7cff,#1a5ed8)', color: '#fff' }}>Search tutors</Button>
                  </Paper>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {SUBJECTS.map((s) => (
                    <Chip key={s} label={s} clickable color={selectedSubject === s ? 'primary' : 'default'} onClick={() => setSelectedSubject(selectedSubject === s ? null : s)} sx={{ fontWeight: 600 }} />
                  ))}
                </Box>

                <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button variant="contained" component={Link} to="/tutors" size="large" sx={{ px: 4, background: 'linear-gradient(90deg,#2b7cff,#1a5ed8)', color: '#fff' }}>Find a tutor</Button>
                  <Button variant="outlined" component={Link} to="/register">Sign up</Button>
                </Box>

                <Box sx={{ mt: 4, display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Verified tutors</Typography>
                    <Typography variant="caption" color="text.secondary">Vetted profiles & background checks</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Secure payments</Typography>
                    <Typography variant="caption" color="text.secondary">Encrypted & reliable</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Student satisfaction</Typography>
                    <Typography variant="caption" color="text.secondary">Money-back guarantee on first lesson</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>Recommended tutors</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Shown based on relevance and student ratings. Compare hourly rates and reviews before you book.</Typography>
        <FeaturedTutors />

        <Box sx={{ my: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">1. Tell us your goal</Typography>
              <Typography>Share the subject and what you want to improve — we’ll suggest good matches.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">2. Compare tutors</Typography>
              <Typography>See hourly rates, ratings, and specialties to pick the right tutor.</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">3. Book & learn</Typography>
              <Typography>Schedule a lesson, review your session, and continue progress with the same tutor.</Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ textAlign: 'center', my: 6 }}>
          <Typography variant="h5" gutterBottom>Ready to find a tutor?</Typography>
          <Button variant="contained" size="large" component={Link} to="/tutors">Find a tutor</Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>What students say</Typography>
          <Testimonials />
        </Box>
      </Container>

      <Box component="footer" sx={{ mt: 6, py: 6, backgroundColor: '#f7f9fc' }}>
        <Container>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h6">For students — your learning matters</Typography>
              <Typography variant="body2" color="text.secondary">Share your goals and areas you'd like help with. We'll recommend vetted tutors and show hourly rates and ratings to help you decide.</Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button variant="outlined" component={Link} to="/register?role=TUTOR">Become a tutor</Button>
              <Typography variant="caption" display="block" sx={{ mt: 2 }}>© {new Date().getFullYear()} Excellent Tutors</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}
