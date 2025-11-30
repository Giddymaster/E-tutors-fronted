import React from 'react'
import { Container, Typography, Box, List, ListItem, ListItemText, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import api from '../utils/api'

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    api.get('/bookings').then(res => { if (mounted) setBookings(res.data.bookings || []) }).catch(() => {}).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Student Dashboard</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Your Bookings</Typography>
        {loading ? <CircularProgress /> : (
          <List>
            {bookings.map(b => (
              <ListItem key={b.id}>
                <ListItemText primary={`${b.subject} — ${b.status}`} secondary={`On ${new Date(b.scheduledAt).toLocaleString()} — ${b.duration} mins`} />
              </ListItem>
            ))}
            {bookings.length === 0 && <Typography>No bookings yet.</Typography>}
          </List>
        )}
      </Box>
    </Container>
  )
}
