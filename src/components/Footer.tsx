import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'
import { Box, Container, Grid, Typography, Button, Stack, TextField } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import logo from '../images/logo.png'

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterMessage, setNewsletterMessage] = useState<string | null>(null)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    setNewsletterMessage(null)
    const email = newsletterEmail.trim()
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setNewsletterMessage('Please enter a valid email address')
      return
    }
    // Minimal local feedback. In future, call backend API to persist subscription.
    setNewsletterMessage('Thanks for subscribing!')
    setNewsletterEmail('')
    setTimeout(() => setNewsletterMessage(null), 4000)
  }
  const footerLinks = {
    'Company': [
      { name: 'About Us', path: '/about' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'News', path: '/news' },
      { name: 'Reviews', path: '/reviews' }
    ],
    'Support': [
      { name: 'FAQ', path: '/faq' },
      { name: 'Help Center', path: '/help' },
      { name: 'Security', path: '/security' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' }
    ],
  };

  const { user } = useAuth()

  const tutorButton = () => {
    // If logged in as a tutor, link to tutor dashboard or assignments; otherwise show Become a Tutor
    if (user && user.role === 'TUTOR') {
      return (
        <Button
          component={RouterLink}
          to="/tutor"
          variant="contained"
          color="primary"
          fullWidth
        >
          Tutor Dashboard
        </Button>
      )
    }
    return (
      <Button
        component={RouterLink}
        to="/become-tutor"
        variant="outlined"
        color="primary"
        fullWidth
      >
        Become a Tutor
      </Button>
    )
  }

  return (
  <Box component="footer" sx={{ bgcolor: '#bbb3b3ff', pt: 6, pb: 3, mt: 8 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
          {/* First column: logo + description */}
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 1 }}>
              <Box component="img" src={logo} alt="MasterTrack tutors" sx={{ height: 164, width: 'auto' }} />
              <Typography variant="body2" color="text.secondary">
                We connect students with vetted tutors across subjects. Personalized lessons, flexible scheduling, and progress tracking to help learners succeed.
              </Typography>
            </Box>
          </Grid>

          {/* Middle columns: Company and Support links (2 columns) */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} sm={6} md={3} key={category}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {category}
              </Typography>
              <Stack spacing={1}>
                {links.map((link) => (
                  <Button
                    key={link.name}
                    component={RouterLink}
                    to={link.path}
                    sx={{ 
                      justifyContent: 'flex-start',
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' }
                    }}
                  >
                    {link.name}
                  </Button>
                ))}
              </Stack>
            </Grid>
          ))}

          {/* Newsletter (fourth column) */}
          <Grid item xs={12} sm={6} md={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Subscribe to our newsletter
            </Typography>
            <Box component="form" onSubmit={handleSubscribe} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                sx={{ flex: 1 }}
              />
              <Button type="submit" variant="contained" size="small">Subscribe</Button>
            </Box>
            {newsletterMessage && (
              <Typography variant="body2" color={newsletterMessage.startsWith('Thanks') ? 'success.main' : 'error'} sx={{ mt: 1 }}>
                {newsletterMessage}
              </Typography>
            )}
            <Box sx={{ mt: 2 }}>
              <Button
                component={RouterLink}
                to="/become-tutor"
                variant="outlined"
                color="primary"
                fullWidth
              >
                Become a Tutor
              </Button>
            </Box>
          </Grid>

          {/* Social Media & Copyright */}
          <Grid item xs={12}>
            <Box sx={{ 
              pt: 3, 
              mt: 3, 
              borderTop: 1, 
              borderColor: 'divider',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 2
            }}>
              <Typography variant="body2" color="text.secondary">
                © {new Date().getFullYear()} MasterTrack tutors. All rights reserved.
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Stack direction="row" spacing={2} sx={{ mr: 2 }}>
                  <FacebookIcon sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
                  <TwitterIcon sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
                  <InstagramIcon sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
                  <LinkedInIcon sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
                </Stack>
              </Box>
            </Box>
          </Grid>
        </Grid>
  </Container>
    </Box>
  );
}
