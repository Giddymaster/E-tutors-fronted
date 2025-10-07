import React, { useEffect, useState } from 'react'
import { Grid, Card, CardContent, Typography, Avatar, Box, Chip, Skeleton, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import api from '../utils/api'

function RatingStars({ rating }: { rating?: number }) {
  if (!rating) return <Typography variant="body2">No rating</Typography>
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {Array.from({ length: full }).map((_, i) => <StarIcon key={i} fontSize="small" htmlColor="#f5c518" />)}
      {half && <StarHalfIcon fontSize="small" htmlColor="#f5c518" />}
      <Typography variant="body2" sx={{ ml: 0.5 }}>{rating.toFixed(1)}</Typography>
    </Box>
  )
}

export default function FeaturedTutors() {
  const [tutors, setTutors] = useState<any[] | null>(null)
  const [sort, setSort] = useState<'recommended' | 'rate' | 'rating'>('recommended')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/tutors')
        setTutors(res.data.tutors || [])
      } catch (err) {
        console.error(err)
        setTutors([])
      }
    }
    load()
  }, [])

  const SAMPLE = [
    { id: 's1', user: { name: 'Alex Johnson' }, subjects: ['Math', 'Physics'], rating: 4.9, hourlyRate: 55, experience: 6 },
    { id: 's2', user: { name: 'Maya Patel' }, subjects: ['English', 'Writing'], rating: 4.8, hourlyRate: 42, experience: 4 },
    { id: 's3', user: { name: 'Daniel Kim' }, subjects: ['Computer Science'], rating: 4.7, hourlyRate: 60, experience: 7 },
    { id: 's4', user: { name: 'Priya Singh' }, subjects: ['Chemistry', 'Biology'], rating: 4.6, hourlyRate: 48, experience: 5 }
  ]

  const dataToShow = tutors === null ? null : (tutors.length === 0 ? SAMPLE : tutors)

  const sorted = React.useMemo(() => {
    if (!dataToShow) return null
    const arr = [...dataToShow]
    if (sort === 'rate') return arr.sort((a, b) => (a.hourlyRate || 0) - (b.hourlyRate || 0))
    if (sort === 'rating') return arr.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    return arr
  }, [dataToShow, sort])

  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid item xs={12} sx={{ mb: 1, display: 'flex', justifyContent: 'flex-end' }}>
        <FormControl size="small" sx={{ width: 200 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value as any)}>
            <MenuItem value="recommended">Recommended</MenuItem>
            <MenuItem value="rate">Rate: Low → High</MenuItem>
            <MenuItem value="rating">Rating: High → Low</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      {sorted === null ? (
        Array.from({ length: 4 }).map((_, i) => (
          <Grid item xs={12} md={3} key={i}>
            <Skeleton variant="rectangular" height={120} />
          </Grid>
        ))
      ) : (
        (sorted || []).slice(0, 8).map((t: any) => (
          <Grid item xs={12} sm={6} md={3} key={t.id}>
            <Card sx={{ borderRadius: 2, transition: 'transform 0.15s ease, box-shadow 0.15s ease', '&:hover': { transform: 'translateY(-6px)', boxShadow: 6 } }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 20 }}>{t.user?.name?.[0] || 'T'}</Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{t.user?.name}</Typography>
                      {t.verified && <CheckCircleIcon fontSize="small" htmlColor="#2e7d32" />}
                      {t.rating >= 4.8 && <WhatshotIcon fontSize="small" htmlColor="#ff7043" />}
                    </Box>
                    <Typography variant="body2" color="text.secondary" noWrap>{t.subjects?.join(', ') || t.bio}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>${t.hourlyRate ?? '—'}</Typography>
                    <Typography variant="caption" color="text.secondary">/hr</Typography>
                  </Box>
                </Box>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <RatingStars rating={t.rating} />
                  <Chip label={t.experience ? `${t.experience} yrs` : (t.rating && t.rating > 4.5 ? 'Expert' : 'Experienced')} size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  )
}
