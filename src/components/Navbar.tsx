import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    // when navigating back to home, hide the center menu
    if (location.pathname === '/') setMenuOpen(false)
  }, [location.pathname])

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fffbe6', color: '#222' }}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none', flexGrow: 1 }}>
          Excellent Tutors
        </Typography>
        {/* center menu (hidden until login/register is clicked). When logged in, keep visible */}
        <Box sx={{ flex: 1, display: menuOpen || user ? 'flex' : 'none', justifyContent: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} to="/tutors">Find a Tutor</Button>
          <Button color="inherit" component={Link} to="/become-tutor">Become a Tutor</Button>
          <Button color="inherit" component={Link} to="/about">About Us</Button>
        </Box>

        {/* right-side auth actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login" onClick={() => setMenuOpen(true)}>Login</Button>
              <Button color="inherit" component={Link} to="/register" onClick={() => setMenuOpen(true)}>Register</Button>
            </>
          ) : (
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
