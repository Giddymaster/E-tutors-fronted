import React from 'react'
import { Card, CardContent, Typography, Button, Box, Chip, Tooltip, Rating, Stack } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function summarize(text?: string, targetWords = 30) {
  if (!text) return ''
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (words.length <= targetWords) return words.join(' ')
  return words.slice(0, targetWords).join(' ') + '...'
}

export default function TutorCard({ tutor }: any) {
  const navigate = useNavigate()
  const { user } = useAuth()

  const tutorName = tutor?.user?.name || tutor?.name || 'Tutor'

  const subjects = tutor?.subjects || tutor?.specialization || tutor?.raw?.subjects || []
  const tutorBio = tutor?.shortBio || tutor?.bio || tutor?.raw?.shortBio || tutor?.raw?.bio || ''
  const teachingPhilosophyRaw = tutor?.teachingStatement || tutor?.teachingPhilosophy || tutor?.bio || tutor?.raw?.bio || ''
  const teachingPhilosophy = teachingPhilosophyRaw === tutorBio ? '' : teachingPhilosophyRaw

  const primarySubject = (() => {
    const subs = Array.isArray(subjects) ? subjects : []
    if (Array.isArray(subs) && subs.length > 0) {
      // Capitalize first letter of subject
      const subj = String(subs[0])
      return subj.charAt(0).toUpperCase() + subj.slice(1)
    }
    return 'General'
  })()

  const hourlyRate = (() => {
    const rate = tutor?.hourlyRate ?? tutor?.raw?.hourlyRate
    if (rate === null || rate === undefined) return 0
    const num = typeof rate === 'number' ? rate : Number(rate)
    return isNaN(num) ? 0 : num
  })()

  const handleBook = () => {
    if (user && user.role === 'STUDENT') {
      navigate(`/tutors/${tutor.id}`)
    } else {
      navigate('/login')
    }
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1.25}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{tutorName}</Typography>
              <Chip label={primarySubject} size="small" color="primary" sx={{ mt: 0.5 }} />
            </Box>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 800 }}>
              ${hourlyRate > 0 ? hourlyRate.toFixed(0) : '—'}/hr
            </Typography>
          </Box>

          {tutorBio ? (
            <Box>
              <Typography variant="overline" color="text.secondary">About</Typography>
              <Typography variant="body2" color="text.primary">{summarize(tutorBio, 40)}</Typography>
            </Box>
          ) : null}

          {teachingPhilosophy ? (
            <Box>
              <Typography variant="overline" color="text.secondary">Teaching philosophy</Typography>
              <Typography variant="body2" color="text.primary">{summarize(teachingPhilosophy, 40)}</Typography>
            </Box>
          ) : null}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Tooltip title={`Rating: ${(tutor?.ratingComputed ?? tutor?.rating ?? 0).toFixed(1)} • ${tutor?.reviewsCount ?? 0} reviews`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Rating value={Number(tutor?.ratingComputed ?? tutor?.rating ?? 0)} precision={0.1} size="small" readOnly />
                <Typography variant="caption" color="text.secondary">({tutor?.reviewsCount ?? 0})</Typography>
              </Box>
            </Tooltip>

            <Tooltip title={`${tutor?.completedCount ?? 0} completed bookings`}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircleIcon fontSize="small" color="success" />
                <Typography variant="body2">{tutor?.completedCount ?? 0}</Typography>
              </Box>
            </Tooltip>
          </Box>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" size="small" onClick={handleBook}>Book</Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
