import React from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Divider,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { School, Star, People, LaptopChromebook } from '@mui/icons-material'

export default function About() {
  return (
    <>
      {/* ✅ Hero Section */}
      <Box
        sx={{
          backgroundImage:
            'url("https://images.pexels.com/photos/4144222/pexels-photo-4144222.jpeg?auto=compress&cs=tinysrgb&w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff',
          py: 12,
          textAlign: 'center',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
          },
        }}
      >
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Typography
            variant="h2"
            sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.02em' }}
          >
            About Excellent Tutors
          </Typography>
          <Typography
            variant="h6"
            sx={{
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.9)',
            }}
          >
            Empowering learners through personalized education. We connect
            students with passionate, qualified tutors who bring learning to
            life.
          </Typography>
        </Container>
      </Box>

      {/* ✅ Mission Section */}
      <Container sx={{ py: 10 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.pexels.com/photos/4143796/pexels-photo-4143796.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt="Tutoring session"
              sx={{
                width: '100%',
                borderRadius: 3,
                boxShadow: 3,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Our Mission
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
              At Excellent Tutors, our mission is to make quality education
              accessible to everyone. We believe that learning should be
              engaging, flexible, and designed around each student’s goals.
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Whether you’re preparing for exams, improving your grades, or
              learning new skills, our tutors provide personalized lessons that
              fit your pace and schedule.
            </Typography>
          </Grid>
        </Grid>
      </Container>

      <Divider />

      {/* ✅ Why Choose Us Section */}
      <Container sx={{ py: 10 }}>
        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Excellent Tutors
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              icon: <Star sx={{ fontSize: 40, color: '#ffb400' }} />,
              title: 'Verified Tutors',
              text: 'All our tutors are vetted and rated by students to ensure quality learning experiences.',
            },
            {
              icon: <People sx={{ fontSize: 40, color: '#2196f3' }} />,
              title: 'Personalized Learning',
              text: 'Our platform matches you with tutors who fit your learning style, goals, and schedule.',
            },
            {
              icon: <LaptopChromebook sx={{ fontSize: 40, color: '#4caf50' }} />,
              title: 'Online & In-person',
              text: 'Learn from anywhere. Choose online classes or in-person sessions at your convenience.',
            },
            {
              icon: <School sx={{ fontSize: 40, color: '#e91e63' }} />,
              title: 'Proven Results',
              text: 'Students who work with Excellent Tutors show measurable improvements in performance.',
            },
          ].map((item, i) => (
            <Grid item xs={12} md={3} key={i}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  borderRadius: 3,
                  height: '100%',
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 },
                }}
              >
                {item.icon}
                <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.text}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Divider />

      {/* ✅ Stats Section */}
      <Box
        sx={{
          py: 10,
          backgroundColor: '#f5f7fa',
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Our Impact
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 4 }}>
            {[
              { number: '10,000+', label: 'Students Tutored' },
              { number: '2,000+', label: 'Active Tutors' },
              { number: '95%', label: 'Satisfaction Rate' },
              { number: '25+', label: 'Subjects Offered' },
            ].map((stat, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Typography variant="h3" fontWeight={800} color="primary">
                  {stat.number}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ✅ Call to Action */}
      <Box
        sx={{
          py: 10,
          background:
            'linear-gradient(90deg, #1a73e8 0%, #43b581 100%)',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Join the Excellent Tutors Community
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Whether you’re a student seeking guidance or a tutor ready to make a
            difference — we’re here for you.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button
              variant="contained"
              component={Link}
              to="/tutors"
              sx={{
                backgroundColor: '#fff',
                color: '#1a73e8',
                px: 4,
                fontWeight: 600,
                '&:hover': { backgroundColor: '#f1f1f1' },
              }}
            >
              Find a Tutor
            </Button>
            <Button
              variant="outlined"
              component={Link}
              to="/register?role=TUTOR"
              sx={{ borderColor: '#fff', color: '#fff', px: 4 }}
            >
              Become a
