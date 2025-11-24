import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Alert,
  Paper,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const STORAGE_KEY = 'et_assignments_v1'

export default function PostJob() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [type, setType] = useState<'tutoring' | 'assignment'>('tutoring')

  // Tutoring fields
  const [subject, setSubject] = useState('')
  const [hourlyRate, setHourlyRate] = useState<number | ''>('')

  // Assignment fields
  const [assignmentName, setAssignmentName] = useState('')
  const [wordCount, setWordCount] = useState<number | ''>('')
  const [assignmentRate, setAssignmentRate] = useState<number | ''>('')

  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const saveToStorage = (item: any) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      const arr = raw ? JSON.parse(raw) : []
      arr.unshift(item)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
    } catch (err) {
      console.error('storage error', err)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!user) return navigate('/login')

    if (type === 'tutoring') {
      if (!subject) return setError('Please select a subject')
      if (!hourlyRate || Number(hourlyRate) <= 0) return setError('Please enter a valid hourly rate')

      const item = {
        id: Date.now().toString(),
        title: `Tutoring: ${subject}`,
        subject,
        description: description || `Tutoring services for ${subject}`,
        budget: Number(hourlyRate),
        createdAt: new Date().toISOString(),
        createdBy: user.name || user.email,
        bids: [],
        acceptedBidId: null,
        meta: { type: 'tutoring', hourlyRate: Number(hourlyRate) },
      }

      saveToStorage(item)
      setSuccess('Tutoring job posted successfully. Tutors will be able to see and bid on it.')
      setTimeout(() => navigate('/assignments'), 1200)
      return
    }

    // assignment
    if (!assignmentName) return setError('Please enter the assignment name')
    if (!wordCount || Number(wordCount) <= 0) return setError('Please enter a valid word count')
    if (!assignmentRate || Number(assignmentRate) <= 0) return setError('Please enter a valid rate')

    const item = {
      id: Date.now().toString(),
      title: assignmentName,
      subject: 'Assignment Help',
      description: `Assignment: ${assignmentName} — ${wordCount} words` + (description ? ` — ${description}` : ''),
      budget: Number(assignmentRate),
      createdAt: new Date().toISOString(),
      createdBy: user.name || user.email,
      bids: [],
      acceptedBidId: null,
      meta: { type: 'assignment', wordCount: Number(wordCount) },
    }

    saveToStorage(item)
    setSuccess('Assignment posted successfully. Tutors will be able to see and bid on it.')
    setTimeout(() => navigate('/assignments'), 1200)
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Post a Job
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          <FormControl>
            <FormLabel>Job Type</FormLabel>
            <RadioGroup row value={type} onChange={(e) => setType(e.target.value as any)}>
              <FormControlLabel value="tutoring" control={<Radio />} label="Tutoring Services" />
              <FormControlLabel value="assignment" control={<Radio />} label="Assignment Help" />
            </RadioGroup>
          </FormControl>

          {type === 'tutoring' ? (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField label="Rate (USD/hour)" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value === '' ? '' : Number(e.target.value))} fullWidth InputProps={{ startAdornment: <span>$</span> }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Optional description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} />
                </Grid>
              </Grid>
            </Box>
          ) : (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Assignment Name" value={assignmentName} onChange={(e) => setAssignmentName(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="Number of words" type="number" value={wordCount} onChange={(e) => setWordCount(e.target.value === '' ? '' : Number(e.target.value))} fullWidth />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField label="Rate (USD)" type="number" value={assignmentRate} onChange={(e) => setAssignmentRate(e.target.value === '' ? '' : Number(e.target.value))} fullWidth InputProps={{ startAdornment: <span>$</span> }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField label="Optional details" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={3} />
                </Grid>
              </Grid>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" type="submit">Post Job</Button>
            <Button variant="outlined" onClick={() => navigate(-1)}>Cancel</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
