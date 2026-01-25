import React, { useEffect, useState } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import AddIcon from '@mui/icons-material/Add'
import { PaystackButton } from 'react-paystack'

interface WalletBalance {
  balance: number
  formattedBalance: string
}

interface TutorEarnings {
  totalEarned: number
  pendingFunds: number
  availableForWithdrawal: number
  withdrawalLimit: number
  formattedTotalEarned: string
  formattedPending: string
  formattedAvailable: string
}

interface Transaction {
  id: string
  amount: number
  type: string
  reason: string
  description: string
  balanceBefore: number
  balanceAfter: number
  createdAt: string
}

interface WithdrawalRequest {
  id: string
  amount: number
  status: string
  reason?: string
  createdAt: string
}

export default function Wallet() {
  const { user } = useAuth()
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [tutorEarnings, setTutorEarnings] = useState<TutorEarnings | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [addFundsDialogOpen, setAddFundsDialogOpen] = useState(false)
  const [withdrawalDialogOpen, setWithdrawalDialogOpen] = useState(false)
  const [addFundsAmount, setAddFundsAmount] = useState('')
  const [withdrawalAmount, setWithdrawalAmount] = useState('')
  const [withdrawalReason, setWithdrawalReason] = useState('')
  const [addFundsLoading, setAddFundsLoading] = useState(false)
  const [withdrawalLoading, setWithdrawalLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [paystackReady, setPaystackReady] = useState(false)
  const [paystackReference, setPaystackReference] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'STUDENT') return
    fetchWalletData()
  }, [user])

  const fetchWalletData = async () => {
    try {
      setLoading(true)

      if (user?.role === 'STUDENT') {
        const [balanceRes, transactionsRes] = await Promise.all([
          api.get('/wallet/balance'),
          api.get('/wallet/transactions?limit=10')
        ])

        setBalance({
          balance: parseFloat(balanceRes.data.balance),
          formattedBalance: balanceRes.data.formattedBalance
        })

        setTransactions(transactionsRes.data.transactions || [])
      } else if (user?.role === 'TUTOR') {
        const [earningsRes, withdrawalsRes] = await Promise.all([
          api.get('/tutor-earnings/earnings'),
          api.get('/tutor-earnings/withdrawals?limit=10')
        ])

        setTutorEarnings(earningsRes.data)
        setWithdrawals(withdrawalsRes.data.withdrawals || [])
      }

      setError(null)
    } catch (err: any) {
      console.error('Failed to fetch wallet data:', err)
      setError('Failed to load wallet data')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFunds = async () => {
    try {
      const amount = parseFloat(addFundsAmount)
      if (!amount || amount <= 0) {
        setError('Please enter a valid amount')
        return
      }

      setAddFundsLoading(true)
      setError(null)

      // Initiate Paystack payment
      const response = await api.post('/wallet-payments/initiate', {
        email: user?.email,
        amount,
      })

      if (response.data.success) {
        setPaystackReference(response.data.reference)
        setPaystackReady(true)
      } else {
        setError('Failed to initiate payment')
      }
    } catch (err: any) {
      console.error('Failed to initiate payment:', err)
      setError(err.response?.data?.error || 'Failed to initiate payment')
    } finally {
      setAddFundsLoading(false)
    }
  }

  const handlePaystackSuccess = async (reference: any) => {
    try {
      // Verify payment on backend
      const verifyData = {
        reference: reference.reference,
        email: user?.email,
      }

      const response = await api.post('/wallet-payments/verify', verifyData)

      if (response.data.success) {
        setSuccess(`Successfully added ${response.data.data.formattedBalance} to your wallet!`)
        setAddFundsAmount('')
        setAddFundsDialogOpen(false)
        setPaystackReady(false)
        setPaystackReference(null)

        // Refresh wallet data
        setTimeout(() => fetchWalletData(), 1000)
      } else {
        setError('Payment verification failed. Please try again.')
      }
    } catch (err: any) {
      console.error('Payment verification error:', err)
      setError(err.response?.data?.error || 'Payment verification failed')
    }
  }

  const handlePaystackClose = () => {
    setPaystackReady(false)
    setError('Payment cancelled')
  }

  const handleRequestWithdrawal = async () => {
    try {
      const amount = parseFloat(withdrawalAmount)
      if (!amount || amount <= 0) {
        setError('Please enter a valid amount')
        return
      }

      setWithdrawalLoading(true)
      setError(null)

      const response = await api.post('/tutor-earnings/withdrawal-request', {
        amount,
        reason: withdrawalReason,
      })

      setSuccess('Withdrawal request submitted. Awaiting admin approval.')
      setWithdrawalAmount('')
      setWithdrawalReason('')
      setWithdrawalDialogOpen(false)

      // Refresh data
      setTimeout(() => fetchWalletData(), 1000)
    } catch (err: any) {
      console.error('Failed to request withdrawal:', err)
      setError(err.response?.data?.error || 'Failed to request withdrawal')
    } finally {
      setWithdrawalLoading(false)
    }
  }

  if (user?.role !== 'STUDENT' && user?.role !== 'TUTOR') {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Wallet is only available for students and tutors</Alert>
      </Box>
    )
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  // ===== STUDENT WALLET =====
  if (user?.role === 'STUDENT') {
    return (
      <Box sx={{ p: 2 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {/* Balance Card */}
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Typography color="inherit" gutterBottom>
              Available Balance
            </Typography>
            <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
              {balance?.formattedBalance || '$0.00'}
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)">
              Use your wallet to book tutors, post assignments, and access AI tutoring
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              startIcon={<AddIcon />}
              onClick={() => setAddFundsDialogOpen(true)}
              sx={{ mt: 2, backgroundColor: 'white', color: '#667eea' }}
            >
              Add Funds
            </Button>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Transaction History
            </Typography>

            {transactions.length === 0 ? (
              <Typography color="textSecondary">No transactions yet</Typography>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="right">Amount</TableCell>
                      <TableCell align="right">Type</TableCell>
                      <TableCell align="right">Balance After</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {transactions.map((tx) => (
                      <TableRow key={tx.id} hover>
                        <TableCell sx={{ fontSize: '0.9rem' }}>
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.9rem' }}>
                          {tx.description}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                          ${Math.abs(parseFloat(tx.amount as any)).toFixed(2)}
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label={tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                            color={tx.type === 'credit' ? 'success' : tx.type === 'refund' ? 'warning' : 'error'}
                            variant="outlined"
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: '0.9rem' }}>
                          ${parseFloat(tx.balanceAfter as any).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>

        {/* Add Funds Dialog */}
        <Dialog open={addFundsDialogOpen} onClose={() => !paystackReady && setAddFundsDialogOpen(false)}>
          <DialogTitle>Add Funds to Wallet</DialogTitle>
          <DialogContent sx={{ minWidth: 400 }}>
            {!paystackReady ? (
              <Box sx={{ pt: 2 }}>
                <TextField
                  fullWidth
                  label="Amount (USD)"
                  type="number"
                  inputProps={{ step: '0.01', min: '1' }}
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </Box>
            ) : (
              <Box sx={{ pt: 2, textAlign: 'center' }}>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Amount: ${parseFloat(addFundsAmount).toFixed(2)}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Click the button below to complete payment via Paystack
                </Typography>
                {paystackReference && (
                  <PaystackButton
                    email={user?.email || ''}
                    amount={Math.round(parseFloat(addFundsAmount) * 100)} // Convert to cents
                    currency="USD"
                    publicKey={import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || ''}
                    text={addFundsLoading ? 'Processing...' : 'Pay Now'}
                    onSuccess={handlePaystackSuccess}
                    onClose={handlePaystackClose}
                    disabled={addFundsLoading}
                  />
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => !paystackReady && setAddFundsDialogOpen(false)} disabled={paystackReady}>
              Cancel
            </Button>
            {!paystackReady && (
              <Button
                onClick={handleAddFunds}
                variant="contained"
                disabled={addFundsLoading || !addFundsAmount}
              >
                {addFundsLoading ? <CircularProgress size={24} /> : 'Continue'}
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>
    )
  }

  // ===== TUTOR WALLET =====
  return (
    <Box sx={{ p: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      {/* Earnings Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 3 }}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Typography color="inherit" gutterBottom>
              Total Earned
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {tutorEarnings?.formattedTotalEarned || '$0.00'}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <CardContent>
            <Typography color="inherit" gutterBottom>
              On Hold (Pending Delivery)
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {tutorEarnings?.formattedPending || '$0.00'}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <CardContent>
            <Typography color="inherit" gutterBottom>
              Available for Withdrawal
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {tutorEarnings?.formattedAvailable || '$0.00'}
            </Typography>
            <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mt: 1 }}>
              Max: ${tutorEarnings?.withdrawalLimit.toFixed(2) || '0.00'} per request
            </Typography>
            <Button
              variant="contained"
              color="inherit"
              onClick={() => setWithdrawalDialogOpen(true)}
              disabled={!tutorEarnings || tutorEarnings.availableForWithdrawal <= 0}
              sx={{ mt: 2, backgroundColor: 'white', color: '#4facfe' }}
            >
              Request Withdrawal
            </Button>
          </CardContent>
        </Card>
      </Box>

      {/* Withdrawal History */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Withdrawal Requests
          </Typography>

          {withdrawals.length === 0 ? (
            <Typography color="textSecondary">No withdrawal requests yet</Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Reason</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {withdrawals.map((wr) => (
                    <TableRow key={wr.id} hover>
                      <TableCell sx={{ fontSize: '0.9rem' }}>
                        {new Date(wr.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                        ${(wr.amount as any).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={wr.status.charAt(0).toUpperCase() + wr.status.slice(1)}
                          color={
                            wr.status === 'COMPLETED'
                              ? 'success'
                              : wr.status === 'REQUESTED'
                              ? 'warning'
                              : 'error'
                          }
                          variant="outlined"
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ fontSize: '0.9rem' }}>
                        {wr.reason || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal Request Dialog */}
      <Dialog open={withdrawalDialogOpen} onClose={() => setWithdrawalDialogOpen(false)}>
        <DialogTitle>Request Withdrawal</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Amount (USD)"
              type="number"
              inputProps={{ step: '0.01', min: '1', max: tutorEarnings?.withdrawalLimit }}
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              placeholder="Enter amount"
              helperText={`Max: $${tutorEarnings?.withdrawalLimit.toFixed(2) || '0.00'}`}
            />
            <TextField
              fullWidth
              label="Reason (optional)"
              multiline
              rows={2}
              value={withdrawalReason}
              onChange={(e) => setWithdrawalReason(e.target.value)}
              placeholder="Why are you withdrawing?"
            />
            <Typography variant="body2" color="textSecondary">
              Available: {tutorEarnings?.formattedAvailable || '$0.00'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawalDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleRequestWithdrawal}
            variant="contained"
            disabled={withdrawalLoading || !withdrawalAmount}
          >
            {withdrawalLoading ? <CircularProgress size={24} /> : 'Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
