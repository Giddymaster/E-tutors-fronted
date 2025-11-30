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

  const primarySubject = (() => {
    const subs = tutor?.raw?.subjects || tutor?.subjects || []
    if (Array.isArray(subs) && subs.length > 0) return String(subs[0])
    if (typeof subs === 'string' && subs) return subs
    return 'General'
  })()

  const hourlyRate = (() => {
    const rate = tutor?.hourlyRate ?? tutor?.raw?.hourlyRate ?? 20
    const num = typeof rate === 'number' ? rate : Number(rate || 20)
    return isNaN(num) ? 20 : num
  })()

  const handleBook = () => {
    if (user && user.role === 'STUDENT') {
      navigate(`/tutors/${tutor.id}`)
    } else {
      navigate('/login')
    }
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box>
            <Typography variant="h6">{tutor.name || 'Tutor Name'}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Tooltip title={`Rating: ${(tutor?.ratingComputed ?? tutor?.rating ?? 0).toFixed(1)} • ${tutor?.reviewsCount ?? 0} reviews`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Rating value={Number((tutor?.ratingComputed ?? tutor?.rating ?? 0))} precision={0.1} size="small" readOnly />
                </Box>
              </Tooltip>

              <Tooltip title={`${tutor?.completedCount ?? 0} completed bookings`}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CheckCircleIcon fontSize="small" color="success" />
                  <Typography variant="body2">{tutor?.completedCount ?? 0} completed</Typography>
                </Box>
              </Tooltip>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
            <Chip label={primarySubject} size="small" />
            <Typography variant="caption" color="text.secondary">${hourlyRate.toFixed(0)}/hr</Typography>
          </Box>
        </Box>

        <Typography variant="body2" sx={{ mb: 2 }}>
          {summarize(tutor.bio || (tutor.raw && tutor.raw.bio), 30)}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" size="small" onClick={handleBook}>Book</Button>
        </Box>
      </CardContent>
    </Card>
  )
}
