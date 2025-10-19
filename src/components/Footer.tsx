import React from 'react'
import { Box, Container, Grid, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 6, py: 6, backgroundColor: '#dbdfe6ff' }}>
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
  )
}
