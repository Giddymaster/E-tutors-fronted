import React from 'react'
import { Container, Typography, Box, List, ListItem, ListItemText, Button, CircularProgress, Divider } from '@mui/material'
import { useEffect, useState } from 'react'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom' 

export default function TutorDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])
  const [myBids, setMyBids] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    api.get('/bookings').then(res => { if (mounted) setBookings(res.data.bookings || []) }).catch(() => {}).finally(() => mounted && setLoading(false))

    // load local assignments and compute my bids (local demo mode)
    try {
      const raw = localStorage.getItem('et_assignments_v1')
      if (raw && user) {
        const items = JSON.parse(raw)
        const bids = items
          .map((a: any) => ({ assignment: a, myBids: a.bids.filter((b: any) => b.tutorId === user.id) }))
          .filter((x: any) => x.myBids && x.myBids.length > 0)
        if (mounted) setMyBids(bids)
      }
    } catch (err) {
      // ignore
    }

    return () => { mounted = false }
  }, [user])

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

      {myBids.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">My Bids</Typography>
          <List>
            {myBids.map((x: any) => (
              <ListItem key={x.assignment.id}>
                <ListItemText primary={x.assignment.title} secondary={x.myBids.map((b: any) => `$${b.amount}`).join(', ')} />
                <Button onClick={() => navigate(`/assignments#${x.assignment.id}`)}>View</Button>
              </ListItem> 
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
        </Box>
      )}

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
