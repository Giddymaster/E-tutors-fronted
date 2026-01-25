import React from 'react'
import { Box, Typography, Link as MuiLink } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export default function AuthFooter() {
  return (
    <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
  © {new Date().getFullYear()} MasterTrack tutors. All rights reserved.{' '}
  <MuiLink component={RouterLink} to="/terms" color="inherit">Terms</MuiLink> · <MuiLink component={RouterLink} to="/privacy" color="inherit">Privacy</MuiLink>
      </Typography>
    </Box>
  )
}
