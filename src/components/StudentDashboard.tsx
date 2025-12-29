import React from 'react'
import { Container, Typography, Box, List, ListItem, ListItemText, Button, Grid, Card, CardContent, CircularProgress, Skeleton } from '@mui/material'
import { useEffect, useState } from 'react'
import api from '../utils/api'
import { Link } from 'react-router-dom'

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true)
  const [bookings, setBookings] = useState<any[]>([])

  useEffect(() => {
    let mounted = true
    api.get('/bookings').then(res => { if (mounted) setBookings(res.data.bookings || []) }).catch(() => {}).finally(() => mounted && setLoading(false))
    return () => { mounted = false }
  }, [])

  const upcoming = bookings
    .filter(b => new Date(b.scheduledAt) > new Date())
    .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime())[0]

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Home</Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Welcome</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                This is your student home — a quick guide to help you get started. Use the quick actions to find tutors, post assignments, manage bookings, and update your profile.
              </Typography>

              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                <Button component={Link} to="/tutors" variant="contained">Find a Tutor</Button>
                <Button component={Link} to="/assignments" variant="outlined">Post Assignment</Button>
                <Button component={Link} to="/profile" variant="outlined">Profile</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Upcoming Session</Typography>
              {loading ? (
                <Box sx={{ mt: 1 }}>
                  <Skeleton variant="rectangular" height={48} />
                </Box>
              ) : upcoming ? (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="body1"><strong>{upcoming.subject}</strong></Typography>
                  <Typography variant="body2" color="text.secondary">{new Date(upcoming.scheduledAt).toLocaleString()} — {upcoming.duration} mins</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Button size="small" component={Link} to={`/bookings/${upcoming.id}`}>View</Button>
                  </Box>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>No upcoming sessions. Book a tutor or post an assignment to get started.</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">Your Bookings</Typography>
              <Box sx={{ mt: 1 }}>
                {loading ? <CircularProgress /> : (
                  <List>
                    {bookings.map(b => (
                      <ListItem key={b.id} divider>
                        <ListItemText primary={`${b.subject} — ${b.status}`} secondary={`On ${new Date(b.scheduledAt).toLocaleString()} — ${b.duration} mins`} />
                        <Button size="small" component={Link} to={`/bookings/${b.id}`}>View</Button>
                      </ListItem>
                    ))}
                    {bookings.length === 0 && <Typography>No bookings yet.</Typography>}
                  </List>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
