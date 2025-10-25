import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, CircularProgress, Chip, Button, Grid } from '@mui/material'
import { useParams } from 'react-router-dom'
import api from '../utils/api'

export default function TutorProfile() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tutor, setTutor] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    let mounted = true
    setLoading(true)
    setError(null)
    api.get(`/tutors/${id}`)
      .then((res) => {
        if (!mounted) return
        setTutor(res.data.tutor)
      })
      .catch((err) => {
        console.error('Failed to load tutor', err)
        if (!mounted) return
        setError(err?.message || 'Failed to load tutor')
      })
      .finally(() => mounted && setLoading(false))

    return () => {
      mounted = false
    }
  }, [id])

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>
  if (error) return <Container sx={{ mt: 4 }}><Typography color="error">{error}</Typography></Container>
  if (!tutor) return <Container sx={{ mt: 4 }}><Typography>No tutor found.</Typography></Container>

  return (
    <Container sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>{tutor.user?.name || 'Tutor'}</Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>{tutor.bio}</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', my: 2 }}>
            {(tutor.subjects || []).map((s: string) => <Chip key={s} label={s} />)}
          </Box>
          <Box sx={{ my: 3 }}>
            <Typography variant="h6">About</Typography>
            <Typography>{tutor.bio}</Typography>
          </Box>
          <Box sx={{ my: 3 }}>
            <Typography variant="h6">Reviews</Typography>
            {tutor.reviews && tutor.reviews.length > 0 ? (
              tutor.reviews.map((r: any) => (
                <Box key={r.id} sx={{ borderBottom: '1px solid #eee', py: 1 }}>
                  <Typography sx={{ fontWeight: 700 }}>{r.rating} / 5</Typography>
                  <Typography>{r.comment}</Typography>
                </Box>
              ))
            ) : (
              <Typography>No reviews yet.</Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
            <Typography variant="h6">Details</Typography>
            <Typography sx={{ my: 1 }}><strong>Rate:</strong> ${tutor.hourlyRate ?? '—'}/hr</Typography>
            <Typography sx={{ my: 1 }}><strong>Rating:</strong> {tutor.rating?.toFixed ? tutor.rating.toFixed(1) : (tutor.rating ?? '—')}</Typography>
            <Typography sx={{ my: 1 }}><strong>Contact:</strong> {tutor.user?.email}</Typography>
            <BookingForm tutor={tutor} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

function BookingForm({ tutor }: { tutor: any }) {
  const [scheduledAt, setScheduledAt] = useState('')
  const [duration, setDuration] = useState<number>(60)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const submit = async () => {
    setLoading(true)
    setMessage(null)
    try {
      const res = await api.post('/bookings', { tutorId: tutor.id, subject: (tutor.subjects && tutor.subjects[0]) || tutor.bio || 'Tutoring', scheduledAt, duration, price: tutor.hourlyRate || 0 })
      setMessage('Booking requested — check your dashboard for status')
    } catch (err: any) {
      console.error('booking error', err)
      setMessage(err?.message || 'Failed to request booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <input type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} style={{ width: '100%', padding: 8, marginBottom: 8 }} />
      <Box sx={{ display: 'flex', gap: 1 }}>
        <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ flex: 1, padding: 8 }} />
        <Button variant="contained" onClick={submit} disabled={loading}>{loading ? 'Requesting...' : 'Book'}</Button>
      </Box>
      {message && <Typography variant="body2" sx={{ mt: 1 }}>{message}</Typography>}
    </Box>
  )
}
