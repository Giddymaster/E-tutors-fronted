import React from 'react'
import { Card, CardContent, Typography, Button, Box, Chip, Tooltip, Rating } from '@mui/material'
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
  const tutorBio = tutor?.bio || tutor?.shortBio || ''

  const primarySubject = (() => {
    const subs = tutor?.subjects || []
    if (Array.isArray(subs) && subs.length > 0) {
      // Capitalize first letter of subject
      const subj = String(subs[0])
      return subj.charAt(0).toUpperCase() + subj.slice(1)
    }
    return 'General'
  })()

  const hourlyRate = (() => {
    const rate = tutor?.hourlyRate
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{tutorName}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
              <Tooltip title={`Rating: ${(tutor?.ratingComputed ?? 0).toFixed(1)} • ${tutor?.reviewsCount ?? 0} reviews`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={Number(tutor?.ratingComputed ?? 0)} precision={0.1} size="small" readOnly />
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
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5, ml: 1 }}>
            <Chip label={primarySubject} size="small" color="primary" />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              ${hourlyRate > 0 ? hourlyRate.toFixed(0) : '—'}/hr
            </Typography>
          </Box>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, mt: 1.5 }}>
          {summarize(tutorBio, 30)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" onClick={handleBook}>Book</Button>
        </Box>
      </CardContent>
    </Card>
  )
}
