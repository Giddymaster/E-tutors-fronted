import React from 'react'
import { Container, Box, Typography, Button, Paper } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6">No user data</Typography>
          <Typography variant="body2">You must be logged in to view this page.</Typography>
          <Button component={Link} to="/login" sx={{ mt: 2 }} variant="contained">Go to Login</Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {user.role} Account
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
            <Typography variant="body1"><strong>User ID:</strong> {user.id}</Typography>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            {user.role === 'STUDENT' && (
              <Button component={Link} to="/student" variant="outlined">Student Dashboard</Button>
            )}
            {user.role === 'TUTOR' && (
              <Button component={Link} to="/tutor" variant="outlined">Tutor Dashboard</Button>
            )}
            <Button component={Link} to="/tutors" variant="contained">Find a Tutor</Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
