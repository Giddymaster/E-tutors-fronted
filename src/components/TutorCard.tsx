import React from 'react'
import { Card, CardContent, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export default function TutorCard({ tutor }: any) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{tutor.name || 'Tutor Name'}</Typography>
        <Typography variant="body2">{tutor.bio || 'Short bio...'}</Typography>
        <Button component={Link} to={`/tutors/${tutor.id}`}>View</Button>
      </CardContent>
    </Card>
  )
}
