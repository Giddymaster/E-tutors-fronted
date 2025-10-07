import React, { useState } from 'react'
import { Container, TextField, Button, Typography, Box } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('STUDENT')
  const navigate = useNavigate()
  const { register } = useAuth()
  const location = useLocation()

  React.useEffect(() => {
    const params = new URLSearchParams(location.search)
    const r = params.get('role')
    if (r) setRole(r.toUpperCase())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const submit = async () => {
    try {
      await register(name, email, password, role as any)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container sx={{ mt: 4 }} maxWidth="sm">
      <Typography variant="h5" gutterBottom>Register</Typography>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" onClick={submit}>Register</Button>
      </Box>
    </Container>
  )
}
