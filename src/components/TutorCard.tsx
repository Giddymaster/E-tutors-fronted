import React from 'react'
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <StarIcon fontSize="small" sx={{ color: 'goldenrod' }} />
                <Typography variant="body2">{(tutor?.raw?.rating ?? tutor?.rating ?? 0).toFixed(1)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CheckCircleIcon fontSize="small" color="success" />
                <Typography variant="body2">
                  {Array.isArray(tutor?.raw?.bookings)
                    ? tutor.raw.bookings.filter((b: any) => b.status === 'ACCEPTED').length
                    : 0} completed
                </Typography>
              </Box>
            </Box>
          </Box>
          <Chip label={primarySubject} size="small" />
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
