import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Divider } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';

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
    <Container maxWidth="sm" sx={{ py: 8 }}>
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
        >
          Sign up with Gmail
        </Button>
      </Box>
    </Container>
  );
}
