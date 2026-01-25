import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const logo = 'https://www.shutterstock.com/image-vector/vector-logo-tutor-educational-courses-260nw-1823498585.jpg'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path: string) => {
    try {
      // treat root as exact match, otherwise allow startsWith for nested routes
      if (path === '/') return location.pathname === '/'
      return location.pathname === path || location.pathname.startsWith(path + '/') || location.pathname.startsWith(path)
    } catch {
      return false
    }
  }

  useEffect(() => {
    // when navigating back to home, hide the center menu
    if (location.pathname === '/') setMenuOpen(false)
  }, [location.pathname])

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fffbe6', color: '#222' }}>
      <Toolbar>
        <Box component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
          <Box component="img" src={logo} alt="MasterTrack tutors" sx={{ height: 36, width: 'auto' }} />
          <Typography variant="h6" sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>
            MasterTrack tutors
          </Typography>
        </Box>
        {/* center menu (hidden until login/register is clicked). When logged in, keep visible */}
        <Box sx={{ flex: 1, display: menuOpen || user ? 'flex' : 'none', justifyContent: 'center', gap: 2 }}>
          {/* Home (first button for logged-in users) */}
          {user && (
            <Button
              color="inherit"
              component={Link}
              to={user.role === 'STUDENT' ? '/student' : '/tutor'}
              sx={{
                color: isActive(user.role === 'STUDENT' ? '/student' : '/tutor') ? 'primary.main' : 'inherit',
                textDecoration: isActive(user.role === 'STUDENT' ? '/student' : '/tutor') ? 'underline' : 'none',
                fontWeight: isActive(user.role === 'STUDENT' ? '/student' : '/tutor') ? 700 : 500
              }}
            >
              Home
            </Button>
          )}

          {user && user.role === 'STUDENT' && (
            <Button
              color="inherit"
              component={Link}
              to="/tutors"
              sx={{
                color: isActive('/tutors') ? 'primary.main' : 'inherit',
                textDecoration: isActive('/tutors') ? 'underline' : 'none',
                fontWeight: isActive('/tutors') ? 700 : 500
              }}
            >
              Find a Tutor
            </Button>
          )}

          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/assignments"
              sx={{
                color: isActive('/assignments') ? 'primary.main' : 'inherit',
                textDecoration: isActive('/assignments') ? 'underline' : 'none',
                fontWeight: isActive('/assignments') ? 700 : 500
              }}
            >
              {user && user.role === 'TUTOR' ? 'Available Jobs' : 'Post Assignment'}
            </Button>
          )}

          {user && (
            <Button
              color="inherit"
              component={Link}
              to="/ai-tutor"
              sx={{
                color: isActive('/ai-tutor') ? 'primary.main' : 'inherit',
                textDecoration: isActive('/ai-tutor') ? 'underline' : 'none',
                fontWeight: isActive('/ai-tutor') ? 700 : 500
              }}
            >
              AI Tutor
            </Button>
          )}

          {/* <Button
            color="inherit"
            component={Link}
            to="/become-tutor"
            sx={{
              color: isActive('/become-tutor') ? 'primary.main' : 'inherit',
              textDecoration: isActive('/become-tutor') ? 'underline' : 'none',
              fontWeight: isActive('/become-tutor') ? 700 : 500
            }}
          >
            Become a Tutor
          </Button> */}
          <Button
            color="inherit"
            component={Link}
            to="/about"
            sx={{
              color: isActive('/about') ? 'primary.main' : 'inherit',
              textDecoration: isActive('/about') ? 'underline' : 'none',
              fontWeight: isActive('/about') ? 700 : 500
            }}
          >
            About Us
          </Button>
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
              <Typography
                component={Link}
                to="/profile"
                sx={{ mr: 2, color: 'inherit', textDecoration: 'none' }}
              >
                {user.name}
              </Typography>
              <Button color="inherit" onClick={() => { setMenuOpen(false); logout(); navigate('/'); }}>Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
