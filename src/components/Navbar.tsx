import React, { useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Button, Box, Menu, MenuItem, IconButton, ListItemIcon } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../images/logo.png'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import AssignmentIcon from '@mui/icons-material/Assignment'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import GavelIcon from '@mui/icons-material/Gavel'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [anchorElMarket, setAnchorElMarket] = useState<null | HTMLElement>(null)
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
          <Box component="img" src={logo} alt="Excellent Tutors" sx={{ height: 36, width: 'auto' }} />
          <Typography variant="h6" sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 700 }}>
            Excellent Tutors
          </Typography>
        </Box>
        {/* center menu (hidden until login/register is clicked). When logged in, keep visible */}
        <Box sx={{ flex: 1, display: menuOpen || user ? 'flex' : 'none', justifyContent: 'center', gap: 2 }}>
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
          {/* Marketplace dropdown: Assignments, My Jobs, My Bids */}
          {user && (
            <Box>
              <Button
                id="marketplace-button"
                aria-controls={Boolean(anchorElMarket) ? 'marketplace-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(anchorElMarket) ? 'true' : undefined}
                color="inherit"
                onClick={(e) => setAnchorElMarket(e.currentTarget)}
                endIcon={<ArrowDropDownIcon />}
                sx={{
                  color: isActive('/assignments') ? 'primary.main' : 'inherit',
                  textDecoration: isActive('/assignments') ? 'underline' : 'none',
                  fontWeight: isActive('/assignments') ? 700 : 500
                }}
              >
                Marketplace
              </Button>
              <Menu
                id="marketplace-menu"
                anchorEl={anchorElMarket}
                open={Boolean(anchorElMarket)}
                onClose={() => setAnchorElMarket(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                MenuListProps={{ 'aria-labelledby': 'marketplace-button' }}
              >
                <MenuItem component={Link} to="/assignments" onClick={() => setAnchorElMarket(null)}>
                  <ListItemIcon>
                    <AssignmentIcon fontSize="small" />
                  </ListItemIcon>
                  Assignments
                </MenuItem>
                {/* My Jobs: visible for students (their posted assignments) */}
                {user.role === 'STUDENT' && (
                  <MenuItem component={Link} to="/assignments?view=my-jobs" onClick={() => setAnchorElMarket(null)}>
                    <ListItemIcon>
                      <WorkOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    My Jobs
                  </MenuItem>
                )}
                {/* My Bids: visible for tutors */}
                {user.role === 'TUTOR' && (
                  <MenuItem component={Link} to="/assignments?view=my-bids" onClick={() => setAnchorElMarket(null)}>
                    <ListItemIcon>
                      <GavelIcon fontSize="small" />
                    </ListItemIcon>
                    My Bids
                  </MenuItem>
                )}
              </Menu>
            </Box>
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
              <Button color="inherit" onClick={() => logout()}>Logout</Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  )
}
