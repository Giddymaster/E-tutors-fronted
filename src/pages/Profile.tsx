import React, { useEffect, useState } from 'react'
import { Container, Box, Typography, Button, Paper, TextField, Stack } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import api from '../utils/api'

type TutorForm = {
  bio: string
  subjects: string
  hourlyRate: number | ''
  availability: string
}

export default function Profile() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [tutorExists, setTutorExists] = useState(false)
  const [form, setForm] = useState<TutorForm>({ bio: '', subjects: '', hourlyRate: '', availability: '' })
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!user || user.role !== 'TUTOR') return
      setLoading(true)
      try {
        const res = await api.get('/tutors/me')
        if (res?.data?.tutor) {
          const t = res.data.tutor
          setTutorExists(true)
          setForm({
            bio: t.bio || '',
            subjects: Array.isArray(t.subjects) ? (t.subjects.join(', ') as string) : (t.subjects as any) || '',
            hourlyRate: typeof t.hourlyRate === 'number' ? t.hourlyRate : '',
            availability: t.availability || ''
          })
        }
      } catch (err) {
        // 404 means no profile yet; ignore
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    // basic validation
    if (!form.bio || !form.subjects) {
      setMessage('Please fill bio and subjects (comma separated)')
      return
    }
    setLoading(true)
    setMessage(null)
    const payload = {
      bio: form.bio,
      subjects: form.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      hourlyRate: typeof form.hourlyRate === 'number' ? form.hourlyRate : 0,
      availability: form.availability || null
    }
    try {
      let res
      if (tutorExists) {
        res = await api.patch('/tutors/me', payload)
      } else {
        res = await api.post('/tutors', payload)
      }
      if (res?.data?.tutor) {
        setTutorExists(true)
        setMessage('Tutor profile saved')
      }
    } catch (err: any) {
      setMessage(err?.message || 'Failed to save')
    } finally {
      setLoading(false)
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (!user) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6">No user data</Typography>
          <Typography variant="body2">You must be logged in to view this page.</Typography>
          <Button component={Link} to="/login" sx={{ mt: 2 }} variant="contained">Go to Login</Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            {user.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {user.role} Account
          </Typography>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body1"><strong>Email:</strong> {user.email}</Typography>
          </Box>
          <Box sx={{ mt: 4, display: 'flex', gap: 2, flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {user.role === 'STUDENT' && (
                <Button component={Link} to="/student" variant="outlined">Student Dashboard</Button>
              )}
              {user.role === 'TUTOR' && (
                <Button component={Link} to="/tutor" variant="outlined">Tutor Dashboard</Button>
              )}
              <Button component={Link} to="/tutors" variant="contained">Find a Tutor</Button>
            </Box>

            {/* Tutor profile management */}
            {user.role === 'TUTOR' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Tutor profile</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <TextField label="Subjects (comma separated)" value={form.subjects} onChange={(e) => setForm((s) => ({ ...s, subjects: e.target.value }))} fullWidth />
                  <TextField label="Hourly rate (USD)" type="number" value={form.hourlyRate === '' ? '' : form.hourlyRate} onChange={(e) => setForm((s) => ({ ...s, hourlyRate: e.target.value === '' ? '' : Number(e.target.value) }))} fullWidth />
                  <TextField label="Availability (e.g., Weekdays 9-5)" value={form.availability} onChange={(e) => setForm((s) => ({ ...s, availability: e.target.value }))} fullWidth />
                  <TextField label="Bio" value={form.bio} onChange={(e) => setForm((s) => ({ ...s, bio: e.target.value }))} fullWidth multiline rows={4} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" onClick={handleSave} disabled={loading}>Save Profile</Button>
                    <Button component={Link} to="/assignments" variant="outlined">View Assignments</Button>
                  </Box>
                  {message && <Typography color={message.startsWith('Failed') ? 'error' : 'success.main'}>{message}</Typography>}
                </Stack>
              </Box>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  )
}
