import React, { useEffect, useState, useMemo } from 'react'
import { Box, Typography, TextField, Button, Grid, Card, CardContent, CardActions, Divider } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'

type Bid = {
  id: string
  tutorId?: number | null
  tutorName?: string
  amount: number
  message?: string
}

type Assignment = {
  id: string
  title: string
  subject: string
  description: string
  budget: number
  createdBy?: string
  bids: Bid[]
  acceptedBidId?: string | null
}

const STORAGE_KEY = 'et_assignments_v1'

function loadAssignments(): Assignment[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as Assignment[]
  } catch (err) {
    return []
  }
}

function saveAssignments(items: Assignment[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export default function Assignments() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const view = useMemo(() => {
    const qp = new URLSearchParams(location.search)
    return qp.get('view') || 'all'
  }, [location.search])

  const [assignments, setAssignments] = useState<Assignment[]>([])

  // post form
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState<number | ''>('')

  useEffect(() => {
    setAssignments(loadAssignments())
  }, [])

  useEffect(() => {
    // when view changes, reload from storage to stay in sync
    setAssignments(loadAssignments())
  }, [view])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return navigate('/login')
    if (user.role !== 'STUDENT') return alert('Only students can create assignments. Please switch to a student account.')
    if (!title || !description || !subject) return alert('Please fill title, subject and description')

    const newItem: Assignment = {
      id: Date.now().toString(),
      title,
      subject,
      description,
      budget: Number(budget) || 0,
      createdBy: user.name,
      bids: [],
    }
    const next = [newItem, ...assignments]
    setAssignments(next)
    saveAssignments(next)
    // clear form
    setTitle('')
    setSubject('')
    setDescription('')
    setBudget('')
  }

  const handleBid = (assignmentId: string) => {
    if (!user) return navigate('/login')
    if (user.role !== 'TUTOR') return alert('Only tutors can place bids. Please become a tutor first.')
    const amountStr = prompt('Enter your bid amount (USD):')
    if (!amountStr) return
    const amount = Number(amountStr)
    if (isNaN(amount) || amount <= 0) return alert('Enter a valid amount')
    const message = prompt('Optional message to student:') || ''

    const next = assignments.map((a) => {
      if (a.id !== assignmentId) return a
      const bid: Bid = {
        id: Date.now().toString(),
        tutorId: user?.id ?? null,
        tutorName: user?.name ?? 'Tutor',
        amount,
        message,
      }
      return { ...a, bids: [...a.bids, bid] }
    })
    setAssignments(next)
    saveAssignments(next)
  }

  const acceptBid = (assignmentId: string, bidId: string) => {
    if (!user) return navigate('/login')
    const next = assignments.map((a) => {
      if (a.id !== assignmentId) return a
      if (a.createdBy !== user.name) {
        alert('Only the student who posted can accept a bid')
        return a
      }
      return { ...a, acceptedBidId: bidId }
    })
    setAssignments(next)
    saveAssignments(next)
    alert('Bid accepted (local-only). Integrate with bookings to complete the flow.')
  }

  const cancelBid = (assignmentId: string) => {
    if (!user) return navigate('/login')
    const next = assignments.map((a) => {
      if (a.id !== assignmentId) return a
      return { ...a, bids: a.bids.filter((b) => b.tutorId !== user.id) }
    })
    setAssignments(next)
    saveAssignments(next)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Assignments & Tutoring Opportunities
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Post an Assignment
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Students can post assignments here so tutors can discover and bid on them.
              </Typography>

              {user ? (
                user.role === 'STUDENT' ? (
                  <Box component="form" onSubmit={handleCreate} sx={{ display: 'grid', gap: 1 }}>
                    <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
                    <TextField label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} fullWidth />
                    <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} fullWidth multiline rows={4} />
                    <TextField label="Budget (USD)" value={budget === '' ? '' : budget} onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))} type="number" fullWidth />
                    <Button type="submit" variant="contained">Post Assignment</Button>
                  </Box>
                ) : (
                  <Typography color="text.secondary">You are not a student. Create a student account to post assignments.</Typography>
                )
              ) : (
                <Box>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>Please <Button variant="text" onClick={() => navigate('/login')}>log in</Button> to post assignments.</Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Box sx={{ mt: 3 }}>
            <Card>
              <CardContent>
                <Typography variant="h6">How it works</Typography>
                <Typography variant="body2" color="text.secondary">
                  - Students post an assignment with details and budget.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  - Tutors can bid on assignments; students review bids and choose a tutor.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {view === 'my-jobs' ? 'My Posted Assignments' : view === 'my-bids' ? 'My Bids' : 'Available Assignments'}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {assignments.length === 0 && (
              <Grid item xs={12}><Typography color="text.secondary">No assignments yet — be the first to post one.</Typography></Grid>
            )}

            {assignments
              .filter((a) => {
                if (view === 'my-jobs') return user && a.createdBy === user.name
                if (view === 'my-bids') return user && a.bids.some((b) => b.tutorId === user.id)
                return true
              })
              .map((a) => (
              <Grid item xs={12} key={a.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{a.title}</Typography>
                    <Typography variant="body2" color="text.secondary">Subject: {a.subject} • Budget: ${a.budget}</Typography>
                    <Typography sx={{ mt: 1 }}>{a.description}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Posted by: {a.createdBy || 'Anonymous'}</Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2">Bids ({a.bids.length})</Typography>
                      {a.bids.length === 0 && <Typography variant="body2" color="text.secondary">No bids yet</Typography>}
                      {a.bids.map((b) => (
                        <Box key={b.id} sx={{ border: '1px solid', borderColor: 'divider', p: 1, mt: 1, borderRadius: 1, backgroundColor: a.acceptedBidId === b.id ? 'rgba(76,175,80,0.06)' : 'inherit' }}>
                          <Typography variant="body2"><strong>{b.tutorName}</strong> — ${b.amount} <span style={{ opacity: 0.8 }}>({b.id})</span></Typography>
                          {b.message && <Typography variant="body2" color="text.secondary">{b.message}</Typography>}
                          {a.acceptedBidId === b.id && <Typography variant="body2" color="success.main">Accepted ✓</Typography>}
                          {/* If student viewing their job, allow accept */}
                          {view === 'my-jobs' && user && user.name === a.createdBy && a.acceptedBidId !== b.id && (
                            <Button size="small" sx={{ mt: 1 }} onClick={() => acceptBid(a.id, b.id)}>Accept this bid</Button>
                          )}
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    {user && user.role === 'TUTOR' && (
                      // If tutor already bid on this assignment, show cancel; otherwise show place bid
                      a.bids.some((b) => b.tutorId === user.id) ? (
                        <Button size="small" onClick={() => cancelBid(a.id)}>Cancel My Bid</Button>
                      ) : (
                        <Button size="small" onClick={() => handleBid(a.id)}>Place Bid</Button>
                      )
                    )}

                    {/* For students, show a quick note if bid accepted */}
                    {view === 'my-jobs' && a.acceptedBidId && (
                      <Typography variant="body2" color="success.main">A bid has been accepted for this assignment</Typography>
                    )}

                    <Typography variant="caption" sx={{ ml: 2 }}>id: {a.id}</Typography>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  )
}
