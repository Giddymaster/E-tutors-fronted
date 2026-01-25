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

interface WalletBalance {
  balance: number
  formattedBalance: string
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

export default function Wallet() {
  const { user } = useAuth()
  const [balance, setBalance] = useState<WalletBalance | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [addFundsDialogOpen, setAddFundsDialogOpen] = useState(false)
  const [addFundsAmount, setAddFundsAmount] = useState('')
  const [addFundsLoading, setAddFundsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (user?.role !== 'STUDENT') return
    fetchWalletData()
  }, [user])

  const fetchWalletData = async () => {
    try {
      setLoading(true)
      const [balanceRes, transactionsRes] = await Promise.all([
        api.get('/wallet/balance'),
        api.get('/wallet/transactions?limit=10')
      ])

      setBalance({
        balance: parseFloat(balanceRes.data.balance),
        formattedBalance: balanceRes.data.formattedBalance
      })

      setTransactions(transactionsRes.data.transactions || [])
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

      // In production, this would redirect to payment processor
      // For now, we'll show a demo message
      setSuccess(`$${amount.toFixed(2)} added to wallet! (Demo - integrate payment processor)`)
      setAddFundsAmount('')
      setAddFundsDialogOpen(false)

      // Refresh wallet data
      setTimeout(() => fetchWalletData(), 1000)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add funds')
    } finally {
      setAddFundsLoading(false)
    }
  }

  if (user?.role !== 'STUDENT') {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="info">Wallet is only available for students</Alert>
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
      <Dialog open={addFundsDialogOpen} onClose={() => setAddFundsDialogOpen(false)}>
        <DialogTitle>Add Funds to Wallet</DialogTitle>
        <DialogContent sx={{ minWidth: 400 }}>
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
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddFundsDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleAddFunds}
            variant="contained"
            disabled={addFundsLoading || !addFundsAmount}
          >
            {addFundsLoading ? <CircularProgress size={24} /> : 'Add Funds'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
