import React, { useEffect, useState, useMemo } from 'react'
import { Box, Typography, TextField, Button, Grid, Card, CardContent, CardActions, Divider, Chip, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import api from '../utils/api'
import { expandSubjects, matchesAssignment } from '../utils/subjectMatcher'

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
  resourceLinks?: string[]
  attachments?: { name: string; size: number; type: string }[]
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

  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [tutorSubjects, setTutorSubjects] = useState<string[]>([])
  const [recommendedOnly, setRecommendedOnly] = useState(false)

  // post form
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState<number | ''>('')
  // resources & attachments
  const [resourceLinks, setResourceLinks] = useState<string[]>([''])
  const [attachments, setAttachments] = useState<File[]>([])
  const [message, setMessage] = useState<string | null>(null)

  const handleAddLink = () => setResourceLinks((s) => [...s, ''])
  const handleRemoveLink = (idx: number) => setResourceLinks((s) => s.filter((_, i) => i !== idx))
  const handleLinkChange = (idx: number, value: string) => setResourceLinks((s) => s.map((l, i) => i === idx ? value : l))

  const handleFilesChange = (files: FileList | null) => {
    if (!files) return
    setAttachments((prev) => [...prev, ...Array.from(files)])
  }

  const removeAttachment = (index: number) => setAttachments((prev) => prev.filter((_, i) => i !== index))

  useEffect(() => {
    setAssignments(loadAssignments())

    // If the user is a tutor, fetch their tutor profile to determine subject expertise
    const fetchTutorProfile = async () => {
      try {
        if (user && user.role === 'TUTOR') {
          const res = await api.get('/tutors/me')
          const t = res.data?.tutor
          if (t && Array.isArray(t.subjects)) {
            setTutorSubjects(expandSubjects(t.subjects))
          }
        }
      } catch (err) {
        // ignore
      }
    }

    fetchTutorProfile()
  }, [user])

  useEffect(() => {
    setAssignments(loadAssignments())
  }, [])

  // If a location hash references an assignment id (e.g., /assignments#123), scroll to it and open details dialog
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

  useEffect(() => {
    if (!location.hash) return
    const targetId = location.hash.replace('#', '')
    if (!targetId) return
    const el = document.getElementById(`assignment-${targetId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      // small highlight to draw attention
      const prev = (el as HTMLElement).style.boxShadow
      ;(el as HTMLElement).style.boxShadow = '0 0 0 4px rgba(25,118,210,0.12)'
      setTimeout(() => { (el as HTMLElement).style.boxShadow = prev }, 2000)
    }

    // open the assignment in a dialog for full view
    const found = assignments.find((a) => a.id === targetId)
    if (found) setSelectedAssignment(found)
  }, [location.hash, assignments])

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
      resourceLinks: resourceLinks.filter(Boolean),
      attachments: attachments.map((f) => ({ name: f.name, size: f.size, type: f.type }))
    }
    const next = [newItem, ...assignments]
    setAssignments(next)
    saveAssignments(next)
    // clear form
    setTitle('')
    setSubject('')
    setDescription('')
    setBudget('')
    setResourceLinks([''])
    setAttachments([])
    setMessage('Assignment posted')
    setTimeout(() => setMessage(null), 3000)
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

  const closeDialog = () => {
    setSelectedAssignment(null)
    // remove hash without reloading
    if (location.hash) window.history.replaceState({}, '', location.pathname)
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

                    {/* Attachments */}
                    <FormControl fullWidth sx={{ mb: 1 }}>
                      <InputLabel shrink htmlFor="more-files">Upload Resources</InputLabel>
                      <input
                        id="more-files"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                        style={{ marginTop: 8 }}
                        onChange={(e) => handleFilesChange(e.target.files)}
                      />
                      <Typography variant="caption" color="text.secondary">Accepted: .pdf, .docx, .txt, .jpg, .png</Typography>
                    </FormControl>
                    {attachments.length > 0 && (
                      <Box sx={{ mb: 1 }}>
                        {attachments.map((f, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body2">{f.name} ({Math.round(f.size / 1024)} KB)</Typography>
                            <Button size="small" color="error" onClick={() => removeAttachment(i)}>Remove</Button>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {/* Resource Links */}
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>Resource Links</Typography>
                    {resourceLinks.map((link, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TextField
                          label={`Resource Link ${idx + 1}`}
                          value={link}
                          onChange={(e) => handleLinkChange(idx, e.target.value)}
                          fullWidth
                        />
                        <Button onClick={() => handleRemoveLink(idx)} disabled={resourceLinks.length === 1} sx={{ ml: 1 }} color="error">Remove</Button>
                      </Box>
                    ))}
                    <Button onClick={handleAddLink} sx={{ mt: 1, mb: 1 }}>Add Another Link</Button>

                    <Button type="submit" variant="contained">Post Assignment</Button>
                    {message && <Typography color="success.main" sx={{ mt: 1 }}>{message}</Typography>}
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
          {user && user.role === 'TUTOR' && tutorSubjects.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Recommended for you</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Assignments that match your listed subjects: {tutorSubjects.map((s) => <Chip key={s} label={s} size="small" sx={{ mr: 0.5 }} />)}</Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                <Button variant={recommendedOnly ? 'contained' : 'outlined'} onClick={() => setRecommendedOnly((v) => !v)}>{recommendedOnly ? 'Show all' : 'Show recommended only'}</Button>
                <Button variant="text" onClick={() => setRecommendedOnly(false)}>View all</Button>
              </Box>
            </Box>
          )}

          <Typography variant="h6" sx={{ mb: 1 }}>
            {user && user.role === 'STUDENT' ? 'My Posted Assignments' : 'Available Assignments to Bid On'}
          </Typography> 
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            {assignments.length === 0 && (
              <Grid item xs={12}><Typography color="text.secondary">{user && user.role === 'STUDENT' ? 'You haven\'t posted any assignments yet.' : 'No assignments available — check back later.'}</Typography></Grid>
            )}
            {assignments
              .filter((a) => {
                // For students: show only assignments THEY posted
                if (user && user.role === 'STUDENT') {
                  return a.createdBy === user.name
                }
                
                // For tutors: show all assignments except those they already bid on
                if (user && user.role === 'TUTOR') {
                  if (a.bids.some((b) => b.tutorId === user.id)) {
                    return false
                  }
                  if (recommendedOnly && tutorSubjects.length > 0) {
                    return matchesAssignment(a.subject, tutorSubjects)
                  }
                  return true
                }
                
                // Non-logged-in users: show nothing
                return false
              })
              .map((a) => (
              <Grid item xs={12} key={a.id} id={`assignment-${a.id}`}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6">{a.title}</Typography>
                        {user && user.role === 'TUTOR' && tutorSubjects.length > 0 && (() => {
                          const match = matchesAssignment(a.subject, tutorSubjects)
                          return match ? <Chip label="Matches your expertise" color="primary" size="small" sx={{ mt: 0.5 }} /> : null
                        })()}
                      </Box>
                      <Chip 
                        label={`${a.bids.length} bid${a.bids.length !== 1 ? 's' : ''}`}
                        variant="outlined"
                        size="small"
                      />
                    </Box>

                    {/* shortened preview */}
                    <Typography variant="body2" color="text.secondary">Subject: {a.subject} • Budget: ${a.budget}</Typography>
                    <Typography sx={{ mt: 1 }}>{a.description.slice(0, 200)}{a.description.length > 200 ? '…' : ''}</Typography>
                    {user && user.role === 'STUDENT' && (
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>Posted: {a.createdBy || 'You'}</Typography>
                    )}

                    <Box sx={{ mt: 2 }}>
                      {/* For STUDENTS: show all bids they received */}
                      {user && user.role === 'STUDENT' && a.createdBy === user.name && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Bids Received ({a.bids.length})</Typography>
                          {a.bids.length === 0 && <Typography variant="body2" color="text.secondary">No bids yet</Typography>}
                          {a.bids.map((b) => (
                            <Box key={b.id} sx={{ border: '1px solid', borderColor: 'divider', p: 1.5, mt: 1, borderRadius: 1, backgroundColor: a.acceptedBidId === b.id ? 'rgba(76,175,80,0.08)' : 'inherit' }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{b.tutorName}</Typography>
                                  <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mt: 0.5 }}>${b.amount}</Typography>
                                </Box>
                                {a.acceptedBidId === b.id && <Chip label="Accepted" color="success" size="small" />}
                              </Box>
                              {b.message && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{b.message}</Typography>}
                              {!a.acceptedBidId && (
                                <Button size="small" variant="contained" sx={{ mt: 1 }} onClick={() => acceptBid(a.id, b.id)}>Accept Bid</Button>
                              )} 
                            </Box>
                          ))}
                        </Box>
                      )}

                      {/* For TUTORS: show bid count only and place bid button */}
                      {user && user.role === 'TUTOR' && (
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Posted by: {a.createdBy || 'Anonymous'}</Typography>
                          <Button size="small" variant="contained" onClick={() => handleBid(a.id)}>Place Bid</Button>
                        </Box>
                      )}

                      {/* View full assignment - opens dialog */}
                      <Box sx={{ mt: 2 }}>
                        <Button size="small" onClick={() => navigate(`/assignments#${a.id}`)}>View Full Details</Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Full assignment dialog */}
          {selectedAssignment && (
            <Dialog open={true} onClose={closeDialog} fullWidth maxWidth="md">
              <DialogTitle>{selectedAssignment.title}</DialogTitle>
              <DialogContent>
                <Typography variant="subtitle2" color="text.secondary">Subject: {selectedAssignment.subject} • Budget: ${selectedAssignment.budget}</Typography>
                <Typography sx={{ mt: 2 }}>{selectedAssignment.description}</Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Resource links</Typography>
                  {selectedAssignment.resourceLinks && selectedAssignment.resourceLinks.length > 0 ? (
                    selectedAssignment.resourceLinks.map((l) => (
                      <Box key={l}><a href={l} target="_blank" rel="noreferrer">{l}</a></Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No resource links</Typography>
                  )}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Attachments</Typography>
                  {selectedAssignment.attachments && selectedAssignment.attachments.length > 0 ? (
                    selectedAssignment.attachments.map((att) => (
                      <Box key={att.name}><Typography variant="body2">{att.name} ({Math.round(att.size / 1024)} KB)</Typography></Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">No attachments</Typography>
                  )}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2">Bids ({selectedAssignment.bids.length})</Typography>
                  {selectedAssignment.bids.length === 0 && <Typography variant="body2" color="text.secondary">No bids yet</Typography>}
                  
                  {/* Show full bid details only to students who posted this assignment */}
                  {user && user.role === 'STUDENT' && selectedAssignment.createdBy === user.name && (
                    selectedAssignment.bids.map((b) => (
                      <Box key={b.id} sx={{ border: '1px solid', borderColor: 'divider', p: 1.5, mt: 1, borderRadius: 1, backgroundColor: selectedAssignment.acceptedBidId === b.id ? 'rgba(76,175,80,0.08)' : 'inherit' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{b.tutorName}</Typography>
                            <Typography variant="h6" color="primary" sx={{ fontWeight: 700, mt: 0.5 }}>${b.amount}</Typography>
                          </Box>
                          {selectedAssignment.acceptedBidId === b.id && <Chip label="Accepted" color="success" size="small" />}
                        </Box>
                        {b.message && <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{b.message}</Typography>}
                        {!selectedAssignment.acceptedBidId && (
                          <Button size="small" variant="contained" sx={{ mt: 1 }} onClick={() => acceptBid(selectedAssignment.id, b.id)}>Accept Bid</Button>
                        )}
                      </Box>
                    ))
                  )}
                  
                  {/* For tutors, show only bid count */}
                  {user && user.role === 'TUTOR' && (
                    <Typography variant="body2" color="text.secondary">Total bids received: {selectedAssignment.bids.length}</Typography>
                  )}
                </Box>

              </DialogContent>
              <DialogActions>
                <Button onClick={closeDialog}>Close</Button>
              </DialogActions>
            </Dialog>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}
