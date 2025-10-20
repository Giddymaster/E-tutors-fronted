import React, { useEffect, useState } from 'react'
import {
  Container,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
  TextField,
  Button,
} from '@mui/material'
import TutorCard from '../components/TutorCard'
import api from '../utils/api'

function a11yProps(index: number) {
  return {
    id: `mode-tab-${index}`,
    'aria-controls': `mode-tabpanel-${index}`,
  }
}

export default function Tutors() {
  const [tutors, setTutors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'assignment' | 'tutoring'>('assignment')

  // Assignment form state
  const [title, setTitle] = useState('')
  const [words, setWords] = useState<number | ''>('')
  const [subject, setSubject] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [price, setPrice] = useState<number | ''>('')

  // Tutoring form state
  const [tutorSubject, setTutorSubject] = useState('')
  const [hours, setHours] = useState<number | ''>('')
  const [rate, setRate] = useState<number | ''>('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/tutors')
        setTutors(res.data.tutors || [])
      } catch (err) {
        console.error('Failed to load tutors', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleModeChange = (_: React.SyntheticEvent, value: string) => {
    if (value === 'assignment' || value === 'tutoring') setMode(value)
  }

  const submitAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call API to submit assignment help request
    console.log('Assignment submitted', { title, words, subject, dueDate, price })
    // clear form
    setTitle('')
    setWords('')
    setSubject('')
    setDueDate('')
    setPrice('')
  }

  const submitTutoring = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call API to request tutoring
    console.log('Tutoring requested', { tutorSubject, hours, rate })
    setTutorSubject('')
    setHours('')
    setRate('')
  }

  return (
    <>
      <Grid container sx={{ minHeight: '60vh' }}>
        {/* Left: Image */}
        <Grid
          item
          xs={false}
          md={6}
          sx={{
            backgroundImage: 'url("https://images.pexels.com/photos/4308164/pexels-photo-4308164.jpeg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: { xs: 240, md: '60vh' },
          }}
        />

        {/* Right: Forms */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Looking for assignment help or tutoring?
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={mode} onChange={handleModeChange} aria-label="choose mode">
                <Tab label="Assignment Help" value="assignment" {...a11yProps(0)} />
                <Tab label="Tutoring" value="tutoring" {...a11yProps(1)} />
              </Tabs>
            </Box>

            {mode === 'assignment' && (
              <Box component="form" onSubmit={submitAssignment} sx={{ mb: 4, display: 'grid', gap: 2 }}>
                <TextField label="Title of the Assignment" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
                <TextField label="Number of Words" value={words} onChange={(e) => setWords(Number(e.target.value) || '')} type="number" fullWidth />
                <TextField label="Subjects" value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth />
                <TextField label="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" InputLabelProps={{ shrink: true }} fullWidth />
                <TextField label="Price" value={price} onChange={(e) => setPrice(Number(e.target.value) || '')} type="number" fullWidth />
                <Button variant="contained" type="submit">Submit</Button>
              </Box>
            )}

            {mode === 'tutoring' && (
              <Box component="form" onSubmit={submitTutoring} sx={{ mb: 4, display: 'grid', gap: 2 }}>
                <TextField label="Subject" value={tutorSubject} onChange={(e) => setTutorSubject(e.target.value)} fullWidth />
                <TextField label="Number of Hours" value={hours} onChange={(e) => setHours(Number(e.target.value) || '')} type="number" fullWidth />
                <TextField label="Pay per hour" value={rate} onChange={(e) => setRate(Number(e.target.value) || '')} type="number" fullWidth />
                <Button variant="contained" type="submit">Request Tutor</Button>
              </Box>
            )}
          </Container>
        </Grid>
      </Grid>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Available Tutors
        </Typography>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Grid container spacing={2}>
            {tutors.map((t: any) => (
              <Grid item xs={12} md={6} key={t.id}>
                <TutorCard tutor={{ id: t.id, name: t.user?.name, bio: t.bio }} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  )
}
