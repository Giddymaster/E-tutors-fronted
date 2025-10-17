import React from 'react'
import { Box, Typography, Link as MuiLink } from '@mui/material'

export default function AuthFooter() {
  return (
    <Box sx={{ mt: 6, mb: 4, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Excellent Tutors. All rights reserved.{' '}
        <MuiLink href="/terms" color="inherit">Terms</MuiLink> · <MuiLink href="/privacy" color="inherit">Privacy</MuiLink>
      </Typography>
    </Box>
  )
}
