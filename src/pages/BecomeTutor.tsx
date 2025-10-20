import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Divider } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import AppleIcon from '@mui/icons-material/Apple';

export default function BecomeTutor() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gmail, setGmail] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [ssn, setSSN] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !gmail || !age || !location || !phone || !ssn || !specialization || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    // Simulate successful registration
    alert('Tutor signup submitted!');
    // Clear form
    setFirstName('');
    setLastName('');
    setGmail('');
    setAge('');
    setLocation('');
    setPhone('');
    setSSN('');
    setSpecialization('');
    setPassword('');
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
      <Grid container spacing={4}>
        {/* Left side - Image */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', mt: 2 }}>
          <Box
            component="img"
            src="https://images.pexels.com/photos/4861395/pexels-photo-4861395.jpeg"
            alt="Tutor"
            sx={{
              width: '100%',
              maxWidth: '500px',
              height: 'auto',
              borderRadius: 2,
              boxShadow: 3,
              mt: { xs: 2, md: 0 },
            }}
          />
        </Grid>

        {/* Right side - Form */}
        <Grid item xs={12} md={6}>
          <Box sx={{ maxWidth: '500px', margin: '0 auto' }}>
            <Typography variant="h4" align="center" gutterBottom>
              Become a Tutor
            </Typography>
            <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>
              Sign up to join Excellent Tutors and help students achieve their goals.
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
              {error && <Typography color="error">{error}</Typography>}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="First Name" value={firstName} onChange={e => setFirstName(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Last Name" value={lastName} onChange={e => setLastName(e.target.value)} fullWidth />
                </Grid>
              </Grid>
              <TextField label="Gmail" type="email" value={gmail} onChange={e => setGmail(e.target.value)} fullWidth />
              <TextField label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} fullWidth />
              <TextField label="Location" value={location} onChange={e => setLocation(e.target.value)} fullWidth />
              <TextField label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} fullWidth />
              <TextField label="SSN" value={ssn} onChange={e => setSSN(e.target.value)} fullWidth />
              <TextField label="Specialization" value={specialization} onChange={e => setSpecialization(e.target.value)} fullWidth />
              <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
              <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
                Submit
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, my: 2 }}>
                <Divider sx={{ flex: 1 }} />
                <Typography variant="body2" color="text.secondary">or</Typography>
                <Divider sx={{ flex: 1 }} />
              </Box>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<FcGoogle />}
                onClick={() => window.location.href = '/api/auth/google'}
                sx={{ mb: 1 }}
              >
                Sign up with Gmail
              </Button>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<AppleIcon />}
                onClick={() => alert('Apple OAuth not configured')}
              >
                Sign up with Apple
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
