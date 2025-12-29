import React, { useEffect, useState } from 'react'
import { Container, Typography, Box, CircularProgress, Chip, Button, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Divider, Snackbar, Alert } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import { useParams, useNavigate } from 'react-router-dom'
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
            <BookingForm tutor={tutor} />
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

function BookingForm({ tutor }: { tutor: any }) {
  const [mode, setMode] = useState<'single' | 'multiple'>('single')
  const [scheduledAt, setScheduledAt] = useState('') // ISO-like local value from input
  const [dates, setDates] = useState<string[]>([]) // for custom multiple dates
  const [sessions, setSessions] = useState<number>(1)
  const [durationHours, setDurationHours] = useState<number>(1) // hours per session
  const [consecutive, setConsecutive] = useState(true)
  const [intervalDays, setIntervalDays] = useState<number>(1)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [snackOpen, setSnackOpen] = useState(false)
  const [snackMsg, setSnackMsg] = useState('')
  const navigate = useNavigate()

  // confirmation modal state
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [previewList, setPreviewList] = useState<string[]>([])

  const tutorHourly = Number(tutor.hourlyRate || 0)
  const pricePerSession = (durationHours || 0) * tutorHourly
  const totalPrice = pricePerSession * (mode === 'single' ? 1 : sessions)

  const addDate = () => setDates((d) => [...d, ''])
  const updateDate = (i: number, v: string) => setDates((d) => d.map((x, idx) => (idx === i ? v : x)))
  const removeDate = (i: number) => setDates((d) => d.filter((_, idx) => idx !== i))

  const validate = () => {
    if (mode === 'single') {
      if (!scheduledAt) return 'Please select a date and time.'
    } else {
      if (consecutive) {
        if (!scheduledAt) return 'Please select a start date/time.'
        if (!sessions || sessions < 1) return 'Number of sessions must be at least 1.'
      } else {
        const validDates = dates.filter(Boolean)
        if (validDates.length === 0) return 'Please add at least one date.'
      }
    }
    if (!durationHours || durationHours <= 0) return 'Duration must be greater than 0.'
    return null
  }

  const prepareAndConfirm = () => {
    const err = validate()
    if (err) return setMessage(err)

    const scheduledList: string[] = []
    if (mode === 'single') {
      scheduledList.push(new Date(scheduledAt).toISOString())
    } else {
      if (consecutive) {
        let start = new Date(scheduledAt)
        for (let i = 0; i < sessions; i++) {
          scheduledList.push(new Date(start).toISOString())
          start.setDate(start.getDate() + Math.max(1, intervalDays))
        }
      } else {
        scheduledList.push(...dates.filter(Boolean).map((d) => new Date(d).toISOString()))
      }
    }

    setPreviewList(scheduledList)
    setConfirmOpen(true)
  }

  const performBooking = async (list: string[]) => {
    setLoading(true)
    setMessage(null)
    try {
      const durationMinutes = Math.round((durationHours || 0) * 60)
      // call bulk endpoint
      const payload = {
        tutorId: tutor.id,
        subject: (tutor.subjects && tutor.subjects[0]) || tutor.bio || 'Tutoring',
        sessions: list.map((s) => ({ scheduledAt: s, duration: durationMinutes, price: Math.round(pricePerSession * 100) / 100, notes }))
      }
      const res = await api.post('/bookings/bulk', payload)
      const created = Array.isArray(res.data.bookings) ? res.data.bookings.length : 0
      const msg = `${created} booking${created > 1 ? 's' : ''} requested. Check your dashboard for status.`
      setSnackMsg(msg)
      setSnackOpen(true)
      // reset and close
      setScheduledAt('')
      setDates([])
      setSessions(1)
      setDurationHours(1)
      setNotes('')
      setConfirmOpen(false)
      // redirect to bookings after a short delay so user sees toast
      setTimeout(() => navigate('/bookings'), 900)
    } catch (err: any) {
      console.error('booking error', err)
      setMessage(err?.response?.data?.error || err?.message || 'Failed to request booking')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
        <Button variant={mode === 'single' ? 'contained' : 'outlined'} onClick={() => setMode('single')}>Single session</Button>
        <Button variant={mode === 'multiple' ? 'contained' : 'outlined'} onClick={() => setMode('multiple')}>Multiple sessions</Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {mode === 'single' && (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Date & time"
              value={scheduledAt ? dayjs(scheduledAt) : null}
              onChange={(v: any) => setScheduledAt(v ? v.toISOString() : '')}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        )}

        {mode === 'multiple' && (
          <>
            <Box>
              <Typography variant="body2">Start date/time</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Start date & time"
                  value={scheduledAt ? dayjs(scheduledAt) : null}
                  onChange={(v: any) => setScheduledAt(v ? v.toISOString() : '')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="checkbox" checked={consecutive} onChange={(e) => setConsecutive(e.target.checked)} /> Consecutive sessions
              </label>
              {consecutive ? (
                <>
                  <input type="number" min={1} value={sessions} onChange={(e) => setSessions(Number(e.target.value))} style={{ width: 80, padding: 8 }} />
                  <input type="number" min={1} value={intervalDays} onChange={(e) => setIntervalDays(Number(e.target.value))} style={{ width: 120, padding: 8 }} />
                  <Typography sx={{ alignSelf: 'center' }} variant="body2">day(s) interval</Typography>
                </>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {dates.map((d, i) => (
                      <Box key={i} sx={{ display: 'flex', gap: 1 }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DateTimePicker
                            label={`Session ${i + 1}`}
                            value={d ? dayjs(d) : null}
                            onChange={(v: any) => updateDate(i, v ? v.toISOString() : '')}
                            renderInput={(params) => <TextField {...params} sx={{ flex: 1 }} />}
                          />
                        </LocalizationProvider>
                        <Button color="error" onClick={() => removeDate(i)}>Remove</Button>
                      </Box>
                  ))}
                  <Button onClick={addDate}>Add date</Button>
                </Box>
              )}
            </Box>
          </>
        )}

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2">Hours per session</Typography>
            <input type="number" min={0.25} step={0.25} value={durationHours} onChange={(e) => setDurationHours(Number(e.target.value))} style={{ width: '100%', padding: 8 }} />
          </Box>
          <Box sx={{ width: 120 }}>
            <Typography variant="body2">Estimated price</Typography>
            <Box sx={{ p: 1, border: '1px solid #eee', borderRadius: 1 }}>${Math.round(pricePerSession * 100) / 100} / session</Box>
          </Box>
        </Box>

        <TextField value={notes} onChange={(e) => setNotes(e.target.value)} multiline minRows={2} placeholder="Add any notes for the tutor (optional)" />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button variant="contained" onClick={() => (mode === 'single' ? prepareAndConfirm() : prepareAndConfirm())} disabled={loading}>{loading ? 'Requesting...' : mode === 'single' ? 'Request session' : 'Request sessions'}</Button>
          <Typography variant="body2" color="text.secondary">Total: ${Math.round(totalPrice * 100) / 100}</Typography>
        </Box>

        {message && <Typography variant="body2" sx={{ mt: 1 }}>{message}</Typography>}
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm booking{previewList.length > 1 ? 's' : ''}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1 }}>You're about to request <strong>{previewList.length}</strong> session{previewList.length > 1 ? 's' : ''} with <strong>{tutor.user?.name}</strong>.</Typography>
          <List dense>
            {previewList.map((p, i) => (
              <React.Fragment key={p}>
                <ListItem>
                  <ListItemText primary={new Date(p).toLocaleString()} secondary={`Duration: ${durationHours} hour(s) — Est. $${Math.round(pricePerSession * 100) / 100} / session`} />
                </ListItem>
                {i < previewList.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">Notes:</Typography>
            <Typography variant="body2" color="text.secondary">{notes || '—'}</Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Total: ${Math.round((pricePerSession * previewList.length) * 100) / 100}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => performBooking(previewList)} disabled={loading}>{loading ? 'Requesting...' : 'Confirm and request'}</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snackOpen} autoHideDuration={3000} onClose={() => setSnackOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackMsg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
