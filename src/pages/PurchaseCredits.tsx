import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import StarIcon from '@mui/icons-material/Star'
import { PaystackButton } from 'react-paystack'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

interface CreditPackage {
  credits: number
  price: number
  popular?: boolean
  savings?: string
}

const PACKAGES: CreditPackage[] = [
  {
    credits: 10,
    price: 5,
  },
  {
    credits: 25,
    price: 10,
    savings: 'Save 20%',
  },
  {
    credits: 50,
    price: 15,
    popular: true,
    savings: 'Save 40%',
  },
  {
    credits: 100,
    price: 25,
    savings: 'Save 50%',
  },
]

export default function PurchaseCredits() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [credits, setCredits] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)

  useEffect(() => {
    loadCredits()
  }, [])

  const loadCredits = async () => {
    try {
      const response = await api.get('/ai-tutor/credits')
      setCredits(response.data.credits)
    } catch (err) {
      console.error('Failed to load credits:', err)
    }
  }

  const handlePaystackSuccess = async (reference: any) => {
    if (!selectedPackage) return

    try {
      setLoading(true)
      // Verify payment on backend
      await api.post('/payments/verify-paystack', {
        reference: reference.reference,
        method: 'Paystack',
        email: user?.email,
      })

      // Add credits to user account
      await api.post('/ai-tutor/credits/purchase', {
        credits: selectedPackage.credits,
      })

      setSuccess(`Successfully purchased ${selectedPackage.credits} credits!`)
      setError(null)
      loadCredits()
      setSelectedPackage(null)

      setTimeout(() => {
        navigate('/ai-tutor')
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Payment verification failed')
    } finally {
      setLoading(false)
    }
  }

  const handlePaystackClose = () => {
    setSelectedPackage(null)
    setError('Payment cancelled')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Purchase AI Credits
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          1 Credit = 1 AI Message
        </Typography>
        <Chip
          label={`Current Balance: ${credits} Credits`}
          color="primary"
          size="large"
          sx={{ mt: 2, fontSize: '1rem', fontWeight: 600 }}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {PACKAGES.map((pkg) => (
          <Grid item xs={12} sm={6} md={3} key={pkg.credits}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                border: pkg.popular ? '3px solid #1976d2' : '1px solid #e0e0e0',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
            >
              {pkg.popular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#1976d2',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <StarIcon fontSize="small" />
                  <Typography variant="caption" fontWeight={600}>
                    POPULAR
                  </Typography>
                </Box>
              )}
              {pkg.savings && (
                <Chip
                  label={pkg.savings}
                  color="success"
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    fontWeight: 600,
                  }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: pkg.popular ? 5 : 3 }}>
                <Typography variant="h2" fontWeight={700} color="primary" gutterBottom>
                  {pkg.credits}
                </Typography>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Credits
                </Typography>
                <Typography variant="h4" fontWeight={600} sx={{ my: 3 }}>
                  ${pkg.price}
                </Typography>
                <Box sx={{ textAlign: 'left', mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckIcon color="success" fontSize="small" />
                    <Typography variant="body2">{pkg.credits} AI messages</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckIcon color="success" fontSize="small" />
                    <Typography variant="body2">All subjects available</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <CheckIcon color="success" fontSize="small" />
                    <Typography variant="body2">No expiration</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckIcon color="success" fontSize="small" />
                    <Typography variant="body2">24/7 Access</Typography>
                  </Box>
                </Box>

                {selectedPackage?.credits === pkg.credits ? (
                  <PaystackButton
                    email={user?.email || ''}
                    amount={pkg.price * 100} // Paystack expects amount in cents
                    currency="USD"
                    publicKey={import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''}
                    text={loading ? 'Processing...' : `Pay $${pkg.price}`}
                    onSuccess={handlePaystackSuccess}
                    onClose={handlePaystackClose}
                    className="paystack-button"
                    disabled={loading}
                  />
                ) : (
                  <Button
                    variant={pkg.popular ? 'contained' : 'outlined'}
                    size="large"
                    fullWidth
                    onClick={() => setSelectedPackage(pkg)}
                    disabled={loading}
                  >
                    Select Package
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 4, bgcolor: '#f5f5f5' }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>
                1. Choose Package
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Select the credit package that suits your learning needs
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>
                2. Secure Payment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pay securely via Paystack with your credit card
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box>
              <Typography variant="h6" color="primary" fontWeight={600} gutterBottom>
                3. Start Learning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Use your credits to chat with AI tutors in any subject
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}
