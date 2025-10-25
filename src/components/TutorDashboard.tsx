import React from 'react'
import { Container, Typography, Box, List, ListItem, ListItemText, Button, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import api from '../utils/api'

export default function TutorDashboard() {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    api.get('/bookings').then(res => { if (mounted) setBookings(res.data.bookings || []) }).catch(() => {}).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const respond = async (id: number, action: 'accept' | 'decline') => {
    try {
      await api.patch(`/bookings/${id}/respond`, { action })
      setBookings(b => b.map((bk: any) => bk.id === id ? { ...bk, status: action === 'accept' ? 'ACCEPTED' : 'DECLINED' } : bk))
    } catch (err) {
      console.error('respond error', err)
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Tutor Dashboard</Typography>
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Bookings</Typography>
        {loading ? <CircularProgress /> : (
          <List>
            {bookings.map(b => (
              <ListItem key={b.id} secondaryAction={
                <Box>
                  <Button onClick={() => respond(b.id, 'accept')}>Accept</Button>
                  <Button color="error" onClick={() => respond(b.id, 'decline')}>Decline</Button>
                </Box>
              }>
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
