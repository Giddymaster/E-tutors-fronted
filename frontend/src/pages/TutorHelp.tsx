import React from 'react'
import { Container, Typography, Box, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function TutorHelp() {
  const navigate = useNavigate()

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h4" gutterBottom>
        In need of a Tutor or Assignment help?
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        We connect you with verified tutors who can assist with your academic or
        professional needs.
      </Typography>

      <Button variant="contained" onClick={() => navigate('/')}>
        Back to Home
      </Button>
    </Container>
  )
}
