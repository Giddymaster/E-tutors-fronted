import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, Grid, Divider, FormControlLabel, Checkbox } from '@mui/material';
import { FcGoogle } from 'react-icons/fc';
import { FaPaypal } from 'react-icons/fa'; // added PayPal icon
import AppleIcon from '@mui/icons-material/Apple';
import PaymentIcon from '@mui/icons-material/Payment';
import CreditCardIcon from '@mui/icons-material/CreditCard'; // added credit card icon
import DescriptionIcon from '@mui/icons-material/Description';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

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
  const [bio, setBio] = useState('');
  const [backgroundCheck, setBackgroundCheck] = useState(false);
  const [backgroundPaid, setBackgroundPaid] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // required fields
    if (!firstName || !lastName || !gmail || !age || !location || !phone || !ssn || !specialization || !password || !bio) {
      setError('Please fill in all fields.');
      return;
    }

    // count words for bio
    const wordCount = bio.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 150) {
      setError('Bio must be at least 150 words.');
      return;
    }

    // require payment if background check selected
    if (backgroundCheck && !backgroundPaid) {
      setError('Please complete the $10 background check payment.');
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
    setBio('');
    setBackgroundCheck(false);
    setBackgroundPaid(false);
  };

  const handlePay = (method: 'paypal' | 'card') => {
    // In real app: open/pay via SDK or redirect to backend checkout.
    // Here we simulate payment success.
    if (method === 'paypal') {
      // simulate redirect to PayPal or popup
      alert('Redirecting to PayPal (simulated). Payment of $10 completed.');
    } else {
      alert('Opening credit card payment (simulated). Payment of $10 completed.');
    }
    setBackgroundPaid(true);
    setError('');
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
              
              <TextField label="Gmail" type="email" value={gmail} onChange={e => setGmail(e.target.value)} fullWidth />
              <TextField label="Age" type="number" value={age} onChange={e => setAge(e.target.value)} fullWidth />
              <TextField label="Location" value={location} onChange={e => setLocation(e.target.value)} fullWidth />
              <TextField label="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} fullWidth />
              <TextField label="SSN" value={ssn} onChange={e => setSSN(e.target.value)} fullWidth />
              <TextField label="Specialization" value={specialization} onChange={e => setSpecialization(e.target.value)} fullWidth />
              <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
              <TextField
                label="Bio"
                multiline
                rows={6}
                value={bio}
                onChange={e => setBio(e.target.value)}
                fullWidth
                InputProps={{
                  startAdornment: <DescriptionIcon color="action" sx={{ mr: 1 }} />,
                }}
                helperText="Minimum 150 words"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={backgroundCheck}
                    onChange={e => {
                      setBackgroundCheck(e.target.checked);
                      if (!e.target.checked) {
                        setBackgroundPaid(false);
                        setError('');
                      }
                    }}
                    icon={<VerifiedUserIcon />}
                    checkedIcon={<VerifiedUserIcon color="primary" />}
                  />
                }
                label={
                  <Box display="flex" alignItems="center">
                    <PaymentIcon sx={{ mr: 1 }} />
                    <Typography>Background Check</Typography>
                    <Typography color="text.secondary" sx={{ ml: 1 }}>
                      ($10)
                    </Typography>
                  </Box>
                }
              />

              {/* show payment options (with icons) when background check is selected */}
              {backgroundCheck && (
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 1 }}>Complete $10 background check - choose payment method</Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FaPaypal />}
                        fullWidth
                        onClick={() => handlePay('paypal')}
                        disabled={backgroundPaid}
                      >
                        Pay with PayPal
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        variant="outlined"
                        startIcon={<CreditCardIcon />}
                        fullWidth
                        onClick={() => handlePay('card')}
                        disabled={backgroundPaid}
                      >
                        Pay with Card
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color={backgroundPaid ? 'success.main' : 'text.secondary'}>
                        {backgroundPaid ? 'Payment completed ✓' : 'No payment made yet'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }} disabled={backgroundCheck && !backgroundPaid}>
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
