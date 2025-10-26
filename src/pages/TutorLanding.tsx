import React from 'react'
import { Container, Box, Typography, Button, Grid } from '@mui/material'
import { Link } from 'react-router-dom'

export default function TutorLanding() {
  return (
    <Container sx={{ mt: 6 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h3" gutterBottom>Welcome to your Tutor Home</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            This is your private landing page. From here you can manage bookings, view assignments and bids, and update your profile.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button component={Link} to="/tutor" variant="contained">Go to Dashboard</Button>
            <Button component={Link} to="/assignments?view=my-bids" variant="outlined">My Bids</Button>
            <Button component={Link} to="/profile" variant="outlined">Edit Profile</Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
            <Typography variant="h6">Quick tips</Typography>
            <ul>
              <li>Check your bookings daily and respond promptly.</li>
              <li>Keep your availability and hourly rate up to date.</li>
              <li>Respond to bids to increase your chances of winning jobs.</li>
            </ul>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}
