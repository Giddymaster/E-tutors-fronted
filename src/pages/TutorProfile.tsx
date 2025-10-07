import React from 'react'
import { Container, Typography } from '@mui/material'
import { useParams } from 'react-router-dom'

export default function TutorProfile() {
  const { id } = useParams()
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4">Tutor Profile — {id}</Typography>
    </Container>
  )
}
