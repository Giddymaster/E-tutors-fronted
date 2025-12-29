import { useState, useEffect, useRef } from 'react'
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { api } from '../../services/api'

interface Message {
  id: string
  content: string
  senderId: string
  sender: { id: string; name: string }
  createdAt: string
}

interface Conversation {
  id: string
  student: { id: string; name: string }
  tutor: { id: string; name: string }
  messages: Message[]
}

export default function ChatBox({ conversationId, currentUserId }: { conversationId: string; currentUserId: string }) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchConversation()
    const interval = setInterval(fetchConversation, 3000)
    return () => clearInterval(interval)
  }, [conversationId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  const fetchConversation = async () => {
    try {
      const res = await api.get(`/messages/${conversationId}`)
      setConversation(res.data.conversation)
      setLoading(false)
    } catch (err) {
      console.error('Error fetching conversation:', err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || sending) return

    setSending(true)
    try {
      await api.post(`/messages/${conversationId}/send`, { content: messageText })
      setMessageText('')
      await fetchConversation()
    } catch (err) {
      console.error('Error sending message:', err)
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!conversation) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography>Conversation not found</Typography>
      </Paper>
    )
  }

  const otherUser = conversation.student.id === currentUserId ? conversation.tutor : conversation.student

  return (
    <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar>{otherUser.name[0]}</Avatar>
          <Typography variant="h6">{otherUser.name}</Typography>
        </Box>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {conversation.messages.length === 0 ? (
          <Typography color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            No messages yet. Start the conversation!
          </Typography>
        ) : (
          conversation.messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                alignSelf: msg.senderId === currentUserId ? 'flex-end' : 'flex-start',
                maxWidth: '70%',
              }}
            >
              <Paper
                sx={{
                  p: 1.5,
                  backgroundColor: msg.senderId === currentUserId ? '#1976d2' : '#f5f5f5',
                  color: msg.senderId === currentUserId ? 'white' : 'black',
                }}
              >
                <Typography variant="body2">{msg.content}</Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', mt: 0.5 }}>
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Divider />
      <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          disabled={sending}
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          endIcon={<SendIcon />}
          disabled={!messageText.trim() || sending}
        >
          Send
        </Button>
      </Box>
    </Paper>
  )
}