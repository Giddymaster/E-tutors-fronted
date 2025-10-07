import React, { useState } from 'react'
import { Container, TextField, Button, Typography, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()

  const submit = async () => {
    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container sx={{ mt: 4 }} maxWidth="sm">
      <Typography variant="h5" gutterBottom>Login</Typography>
      <Box sx={{ display: 'grid', gap: 2 }}>
        <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button variant="contained" onClick={submit}>Login</Button>
      </Box>
    </Container>
  )
}
