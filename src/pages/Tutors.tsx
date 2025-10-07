import React, { useEffect, useState } from 'react'
import { Container, Grid, Typography } from '@mui/material'
import TutorCard from '../components/TutorCard'
import api from '../utils/api'

export default function Tutors() {
  const [tutors, setTutors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Available Tutors</Typography>
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
  )
}
