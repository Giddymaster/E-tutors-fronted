import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Drawer, List, ListItem, ListItemButton, ListItemText, IconButton, Divider, Avatar } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import logoImg from '../images/logo.png'
const logo = logoImg

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
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
    // close drawer on navigation
    setDrawerOpen(false)
  }, [location.pathname])

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen)
  }

  const handleNavClick = (path: string) => {
    navigate(path)
    setDrawerOpen(false)
  }

  const handleLogout = () => {
    setDrawerOpen(false)
    logout()
    navigate('/')
  }

  return (
    <AppBar position="static" sx={{ backgroundColor: '#fffbe6', color: '#222' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo & Brand (left) */}
        <Box component={Link} to="/" sx={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 1, minWidth: 'fit-content' }}>
          <Box component="img" src={logo} alt="MasterTrack tutors" sx={{ height: { xs: 50, md: 70 }, width: { xs: 50, md: 'auto' }, objectFit: 'contain' }} />
          <Typography variant="h6" sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700, display: { xs: 'none', sm: 'block' } }}>
            MasterTrack Tutors
          </Typography>
        </Box>

        {/* Desktop center menu (visible on md and up) */}
        <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center', gap: 2 }}>
          {/* Home (first button for logged-in users) */}
          {user && (
            <Button
              color="inherit"
              component={Link}
              to={user.role === 'STUDENT' ? '/student' : '/tutor'}
              sx={{
                minHeight: 44,
                px: 2,
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
                minHeight: 44,
                px: 2,
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
                minHeight: 44,
                px: 2,
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
                minHeight: 44,
                px: 2,
                color: isActive('/ai-tutor') ? 'primary.main' : 'inherit',
                textDecoration: isActive('/ai-tutor') ? 'underline' : 'none',
                fontWeight: isActive('/ai-tutor') ? 700 : 500
              }}
            >
              AI Tutor
            </Button>
          )}

          <Button
            color="inherit"
            component={Link}
            to="/about"
            sx={{
              minHeight: 44,
              px: 2,
              color: isActive('/about') ? 'primary.main' : 'inherit',
              textDecoration: isActive('/about') ? 'underline' : 'none',
              fontWeight: isActive('/about') ? 700 : 500
            }}
          >
            About Us
          </Button>
        </Box>

        {/* Desktop right-side auth actions (visible on md and up) */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {!user ? (
            <>
              <Button color="inherit" component={Link} to="/login" sx={{ minHeight: 44, px: 2 }}>Login</Button>
              <Button color="inherit" component={Link} to="/register" sx={{ minHeight: 44, px: 2 }}>Register</Button>
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
              <Button color="inherit" onClick={() => { logout(); navigate('/'); }} sx={{ minHeight: 44, px: 2 }}>Logout</Button>
            </>
          )}
        </Box>

        {/* Mobile hamburger menu (visible only on xs and sm) */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
          <IconButton 
            color="inherit" 
            onClick={handleDrawerToggle}
            sx={{ minHeight: 44, minWidth: 44 }}
          >
            {drawerOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer Navigation */}
      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 280 },
            boxSizing: 'border-box'
          }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Menu</Typography>
          <IconButton onClick={handleDrawerToggle} sx={{ minHeight: 44, minWidth: 44 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Mobile user info */}
        {user && (
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 44, height: 44, backgroundColor: 'primary.main' }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{user.name}</Typography>
              <Typography variant="caption" color="textSecondary">{user.role}</Typography>
            </Box>
          </Box>
        )}

        <Divider />
        <List>
          {/* Mobile navigation items */}
          {user && (
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleNavClick(user.role === 'STUDENT' ? '/student' : '/tutor')}
                sx={{ minHeight: 44 }}
              >
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
          )}

          {user && user.role === 'STUDENT' && (
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleNavClick('/tutors')}
                sx={{ minHeight: 44 }}
              >
                <ListItemText primary="Find a Tutor" />
              </ListItemButton>
            </ListItem>
          )}

          {user && (
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleNavClick('/assignments')}
                sx={{ minHeight: 44 }}
              >
                <ListItemText primary={user.role === 'TUTOR' ? 'Available Jobs' : 'Post Assignment'} />
              </ListItemButton>
            </ListItem>
          )}

          {user && (
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleNavClick('/ai-tutor')}
                sx={{ minHeight: 44 }}
              >
                <ListItemText primary="AI Tutor" />
              </ListItemButton>
            </ListItem>
          )}

          <ListItem disablePadding>
            <ListItemButton 
              onClick={() => handleNavClick('/about')}
              sx={{ minHeight: 44 }}
            >
              <ListItemText primary="About Us" />
            </ListItemButton>
          </ListItem>

          {user && (
            <ListItem disablePadding>
              <ListItemButton 
                onClick={() => handleNavClick('/profile')}
                sx={{ minHeight: 44 }}
              >
                <ListItemText primary="Profile" />
              </ListItemButton>
            </ListItem>
          )}
        </List>

        <Divider />

        {/* Mobile auth actions */}
        <List>
          {!user ? (
            <>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => handleNavClick('/login')}
                  sx={{ minHeight: 44 }}
                >
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton 
                  onClick={() => handleNavClick('/register')}
                  sx={{ minHeight: 44 }}
                >
                  <ListItemText primary="Register" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <ListItem disablePadding>
              <ListItemButton 
                onClick={handleLogout}
                sx={{ minHeight: 44 }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
    </AppBar>
  )
}
