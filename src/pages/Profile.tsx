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

type StudentForm = {
  major: string
  year: string
  interests: string
  preferredSubjects: string
  bio: string
  timezone: string
  phone: string
  availability: string
}
export default function Profile() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [tutorExists, setTutorExists] = useState(false)
  const [form, setForm] = useState<TutorForm>({ bio: '', subjects: '', hourlyRate: '', availability: '' })
  const [studentForm, setStudentForm] = useState<StudentForm>({ major: '', year: '', interests: '', preferredSubjects: '', bio: '', timezone: '', phone: '', availability: '' })
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      // load tutor info for tutors
      if (user.role === 'TUTOR') {
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

      // load student profile for students
      if (user.role === 'STUDENT') {
        setLoading(true)
        try {
          const res = await api.get('/students/me')
          if (res?.data?.student) {
            const s = res.data.student
            setStudentForm({
              major: s.major || '',
              year: s.year || '',
              interests: Array.isArray(s.interests) ? s.interests.join(', ') : (s.interests as any) || '',
              preferredSubjects: Array.isArray(s.preferredSubjects) ? s.preferredSubjects.join(', ') : (s.preferredSubjects as any) || '',
              bio: s.bio || '',
              timezone: s.timezone || '',
              phone: s.phone || '',
              availability: s.availability || ''
            })
          }
        } catch (err) {
          // ignore 404
        } finally {
          setLoading(false)
        }
      }
    }
    load()
  }, [user])

  const handleSave = async () => {
    if (!user) return
    // basic validation
    setMessage(null)
    setLoading(true)
    try {
      if (user.role === 'TUTOR') {
        if (!form.bio || !form.subjects) {
          setMessage('Please fill bio and subjects (comma separated)')
          setLoading(false)
          return
        }
        const payload = {
          bio: form.bio,
          subjects: form.subjects.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
          hourlyRate: typeof form.hourlyRate === 'number' ? form.hourlyRate : 0,
          availability: form.availability || null
        }
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
      }

      if (user.role === 'STUDENT') {
        // validate student minimal fields if needed
        const payload = {
          major: studentForm.major || null,
          year: studentForm.year || null,
          interests: studentForm.interests.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
          preferredSubjects: studentForm.preferredSubjects.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean),
          bio: studentForm.bio || null,
          timezone: studentForm.timezone || null,
          phone: studentForm.phone || null,
          availability: studentForm.availability || null
        }
        const res = await api.patch('/students/me', payload)
        if (res?.data?.student) {
          setMessage('Student profile saved')
        }
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

            {user.role === 'STUDENT' && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6">Student profile</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <TextField label="Full name" value={user.name} fullWidth disabled />
                  <TextField label="Email" value={user.email} fullWidth disabled />
                  <TextField label="Major" value={studentForm.major} onChange={(e) => setStudentForm((s) => ({ ...s, major: e.target.value }))} fullWidth />
                  <TextField label="Year (e.g., Sophomore)" value={studentForm.year} onChange={(e) => setStudentForm((s) => ({ ...s, year: e.target.value }))} fullWidth />
                  <TextField label="Interests (comma separated)" value={studentForm.interests} onChange={(e) => setStudentForm((s) => ({ ...s, interests: e.target.value }))} fullWidth />
                  <TextField label="Preferred subjects (comma separated)" value={studentForm.preferredSubjects} onChange={(e) => setStudentForm((s) => ({ ...s, preferredSubjects: e.target.value }))} fullWidth />
                  <TextField label="Phone" value={studentForm.phone} onChange={(e) => setStudentForm((s) => ({ ...s, phone: e.target.value }))} fullWidth />
                  <TextField label="Timezone" value={studentForm.timezone} onChange={(e) => setStudentForm((s) => ({ ...s, timezone: e.target.value }))} fullWidth />
                  <TextField label="Availability (e.g., Evenings)" value={studentForm.availability} onChange={(e) => setStudentForm((s) => ({ ...s, availability: e.target.value }))} fullWidth />
                  <TextField label="Bio / About" value={studentForm.bio} onChange={(e) => setStudentForm((s) => ({ ...s, bio: e.target.value }))} fullWidth multiline rows={4} />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="contained" onClick={handleSave} disabled={loading}>Save Profile</Button>
                    <Button component={Link} to="/" variant="outlined">Home</Button>
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
