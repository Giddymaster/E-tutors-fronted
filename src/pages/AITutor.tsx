import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'
import AddIcon from '@mui/icons-material/Add'
import HistoryIcon from '@mui/icons-material/History'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import SchoolIcon from '@mui/icons-material/School'
import ScienceIcon from '@mui/icons-material/Science'
import CalculateIcon from '@mui/icons-material/Calculate'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: string
}

interface Session {
  id: string
  subject: string
  title?: string
  status: string
  createdAt: string
  messages?: Message[]
}

const SUBJECTS = [
  { value: 'MATH', label: 'Mathematics', icon: <CalculateIcon />, color: '#2196f3' },
  { value: 'PHYSICS', label: 'Physics', icon: <ScienceIcon />, color: '#9c27b0' },
  { value: 'CHEMISTRY', label: 'Chemistry', icon: <ScienceIcon />, color: '#ff9800' },
  { value: 'BIOLOGY', label: 'Biology', icon: <ScienceIcon />, color: '#4caf50' },
  { value: 'ENGLISH', label: 'English', icon: <MenuBookIcon />, color: '#e91e63' },
  { value: 'HISTORY', label: 'History', icon: <MenuBookIcon />, color: '#795548' },
  { value: 'COMPUTER_SCIENCE', label: 'Computer Science', icon: <SchoolIcon />, color: '#00bcd4' },
  { value: 'ECONOMICS', label: 'Economics', icon: <SchoolIcon />, color: '#607d8b' },
  { value: 'GENERAL', label: 'General', icon: <SchoolIcon />, color: '#9e9e9e' },
]

export default function AITutor() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSession, setCurrentSession] = useState<Session | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [credits, setCredits] = useState(0)
  const [newSessionDialog, setNewSessionDialog] = useState(false)
  const [historyDialog, setHistoryDialog] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadCredits()
    loadSessions()
  }, [user])  // Added dependency on user to trigger reload when authenticated

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadCredits = async () => {
    try {
      const response = await api.get('/ai-tutor/credits')
      setCredits(response.data.credits)
    } catch (err) {
      console.error('Failed to load credits:', err)
    }
  }

  const loadSessions = async () => {
    try {
      const response = await api.get('/ai-tutor/sessions')
      setSessions(response.data)
    } catch (err) {
      console.error('Failed to load sessions:', err)
    }
  }

  const createSession = async (subject: string) => {
    try {
      setLoading(true)
      const response = await api.post('/ai-tutor/sessions', { subject })
      const newSession = response.data
      setSessions([newSession, ...sessions])
      setCurrentSession(newSession)
      setMessages([])
      setNewSessionDialog(false)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  const loadSession = async (sessionId: string) => {
    try {
      setLoading(true)
      const response = await api.get(`/ai-tutor/sessions/${sessionId}`)
      setCurrentSession(response.data)
      setMessages(response.data.messages || [])
      setHistoryDialog(false)
      setError(null)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load session')
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || !currentSession || loading) return

    if (credits < 1) {
      setError('Insufficient credits. Please purchase more credits to continue.')
      return
    }

    const userMessage = input.trim()
    setInput('')
    setError(null)

    // Add user message optimistically
    const tempUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString(),
    }
    setMessages([...messages, tempUserMsg])

    try {
      setLoading(true)
      const response = await api.post(
        `/ai-tutor/sessions/${currentSession.id}/messages`,
        { message: userMessage }
      )

      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: response.data.message,
        createdAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
      setCredits(response.data.creditsRemaining)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send message')
      // Remove optimistic user message on error
      setMessages(messages)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Guard: Show loading until user is determined
  if (!user) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          AI Tutor
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip
            icon={<AccountBalanceWalletIcon />}
            label={`${credits} Credits`}
            color={credits > 0 ? 'success' : 'error'}
            sx={{ fontWeight: 600 }}
          />
          <Button
            variant="outlined"
            startIcon={<HistoryIcon />}
            onClick={() => setHistoryDialog(true)}
          >
            History
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setNewSessionDialog(true)}
          >
            New Session
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {!currentSession ? (
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            bgcolor: '#f5f5f5',
            borderRadius: 3,
          }}
        >
          <SmartToyIcon sx={{ fontSize: 80, color: '#1976d2', mb: 2 }} />
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Start Learning with AI
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Choose a subject and start chatting with your AI tutor
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={() => setNewSessionDialog(true)}
          >
            Create New Session
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <SmartToyIcon sx={{ fontSize: 32, color: '#1976d2' }} />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    {SUBJECTS.find((s) => s.value === currentSession.subject)?.label || 'AI Tutor'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentSession.title || 'New conversation'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper
              sx={{
                height: '60vh',
                overflow: 'auto',
                p: 3,
                bgcolor: '#fafafa',
                borderRadius: 2,
              }}
            >
              {messages.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="body1" color="text.secondary">
                    Start the conversation by asking a question
                  </Typography>
                </Box>
              ) : (
                messages.map((msg) => (
                  <Box
                    key={msg.id}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 1,
                        maxWidth: '70%',
                        flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: msg.role === 'user' ? '#1976d2' : '#4caf50',
                        }}
                      >
                        {msg.role === 'user' ? <PersonIcon /> : <SmartToyIcon />}
                      </Avatar>
                      <Paper
                        sx={{
                          p: 2,
                          bgcolor: msg.role === 'user' ? '#1976d2' : '#fff',
                          color: msg.role === 'user' ? '#fff' : '#000',
                          borderRadius: 2,
                        }}
                      >
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                          {msg.content}
                        </Typography>
                      </Paper>
                    </Box>
                  </Box>
                ))
              )}
              <div ref={messagesEndRef} />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  placeholder="Ask your question..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading || credits < 1}
                />
                <Button
                  variant="contained"
                  onClick={sendMessage}
                  disabled={loading || !input.trim() || credits < 1}
                  sx={{ minWidth: 100 }}
                >
                  {loading ? <CircularProgress size={24} /> : <SendIcon />}
                </Button>
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Press Enter to send • {credits} credits remaining
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* New Session Dialog */}
      <Dialog 
        open={newSessionDialog} 
        onClose={() => setNewSessionDialog(false)} 
        maxWidth="sm" 
        fullWidth
        disableEnforceFocus
      >
        <DialogTitle>Start New AI Tutoring Session</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Choose a subject to get started with your AI tutor
          </Typography>
          <Grid container spacing={2}>
            {SUBJECTS.map((subject) => (
              <Grid item xs={6} sm={4} key={subject.value}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 3,
                    },
                  }}
                  onClick={() => createSession(subject.value)}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box sx={{ color: subject.color, mb: 1 }}>{subject.icon}</Box>
                    <Typography variant="body2" fontWeight={600}>
                      {subject.label}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewSessionDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* History Dialog */}
      <Dialog 
        open={historyDialog} 
        onClose={() => setHistoryDialog(false)} 
        maxWidth="sm" 
        fullWidth
        disableEnforceFocus
      >
        <DialogTitle>Session History</DialogTitle>
        <DialogContent>
          {sessions.length === 0 ? (
            <Typography variant="body2" color="text.secondary" textAlign="center" py={4}>
              No previous sessions
            </Typography>
          ) : (
            <List>
              {sessions.map((session, index) => (
                <React.Fragment key={session.id}>
                  {index > 0 && <Divider />}
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => loadSession(session.id)}>
                      <ListItemText
                        primary={session.title || 'Untitled Session'}
                        secondary={`${
                          SUBJECTS.find((s) => s.value === session.subject)?.label
                        } • ${new Date(session.createdAt).toLocaleDateString()}`}
                      />
                    </ListItemButton>
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHistoryDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
