import React from 'react';
import { Box, Container, Grid, Typography, Button, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AppleIcon from '@mui/icons-material/Apple';
import AndroidIcon from '@mui/icons-material/Android';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  const footerLinks = {
    'Company': [
      { name: 'About Us', path: '/about' },
      { name: 'Contact Us', path: '/contact' },
      { name: 'News', path: '/news' },
      { name: 'Reviews', path: '/reviews' }
    ],
    'Support': [
      { name: 'FAQ', path: '/faq' },
      { name: 'Security', path: '/security' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Privacy Policy', path: '/privacy' }
    ],
  };

  return (
    <Box component="footer" sx={{ bgcolor: '#f5f5f5', pt: 6, pb: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Links Sections */}
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

          {/* App Download Section */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Download our free app
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="outlined"
                startIcon={<AppleIcon />}
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start',
                  color: 'text.primary',
                  borderColor: 'text.primary',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                }}
              >
                App Store
              </Button>
              <Button
                variant="outlined"
                startIcon={<AndroidIcon />}
                fullWidth
                sx={{ 
                  justifyContent: 'flex-start',
                  color: 'text.primary',
                  borderColor: 'text.primary',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main' }
                }}
              >
                Google Play
              </Button>
            </Stack>
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
                © {new Date().getFullYear()} Excellent Tutors. All rights reserved.
              </Typography>
              <Stack direction="row" spacing={2}>
                <FacebookIcon sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
                <TwitterIcon sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
                <InstagramIcon sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
                <LinkedInIcon sx={{ color: 'text.secondary', cursor: 'pointer', '&:hover': { color: 'primary.main' } }} />
              </Stack>
            </Box>
          </Grid>
        </Grid>
  </Container>
    </Box>
  );
}
