import React from 'react'
import { Box, Typography, Card, CardContent, Grid } from '@mui/material'

const SAMPLE = [
  { name: 'Sara K.', text: 'My grades improved dramatically after 3 sessions. Tutor was patient and clear.' },
  { name: 'Leo M.', text: 'Friendly, professional, and tailored lessons. Highly recommended.' },
  { name: 'Priya R.', text: 'Explains complex ideas simply — perfect for exam prep.' }
]

export default function Testimonials() {
  return (
    <Grid container spacing={2}>
      {SAMPLE.map((t, i) => (
        <Grid item xs={12} md={4} key={i}>
          <Card>
            <CardContent>
              <Typography variant="body2">"{t.text}"</Typography>
              <Typography variant="caption" display="block" sx={{ mt: 1, fontWeight: 700 }}>{t.name}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
