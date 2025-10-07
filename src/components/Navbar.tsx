import React from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
          Excellent Tutors
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/tutors">Find Tutors</Button>
          {!user && (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </>
          )}
          {user && (
            <>
              <Typography component="span" sx={{ mr: 2 }}>{user.name}</Typography>
              <Button color="inherit" onClick={() => logout()}>Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
