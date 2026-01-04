import React, { useRef, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import CloseIcon from '@mui/icons-material/Close'

interface CameraCaptureProps {
  open: boolean
  onCapture: (file: File) => void
  onClose: () => void
}

export default function CameraCapture({ open, onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startCamera = async () => {
    try {
      setLoading(true)
      setError(null)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      setStream(mediaStream)
      
      // Set srcObject on next tick to ensure ref is ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      }, 0)
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
      setLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return
    
    try {
      const context = canvasRef.current.getContext('2d')
      if (!context) return

      // Set canvas dimensions to match video
      const videoWidth = videoRef.current.videoWidth
      const videoHeight = videoRef.current.videoHeight
      
      if (videoWidth === 0 || videoHeight === 0) {
        setError('Camera feed not ready. Please wait a moment.')
        return
      }

      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      // Draw video frame to canvas
      context.drawImage(videoRef.current, 0, 0)

      // Convert canvas to blob and create File
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `selfie-${Date.now()}.jpg`, {
            type: 'image/jpeg',
          })
          onCapture(file)
          handleClose()
        }
      }, 'image/jpeg', 0.95)
    } catch (err) {
      console.error('Capture error:', err)
      setError('Failed to capture photo. Please try again.')
    }
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  React.useEffect(() => {
    if (open) {
      startCamera()
      return () => {
        stopCamera()
      }
    }
  }, [open])

  React.useEffect(() => {
    if (stream && videoRef.current) {
      setLoading(false)
    }
  }, [stream])

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 1,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CameraAltIcon color="primary" />
          <Typography variant="h6">Take a Photo</Typography>
        </Box>
        <Button
          size="small"
          onClick={handleClose}
          sx={{ minWidth: 'auto' }}
        >
          <CloseIcon />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ py: 2 }}>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box sx={{ position: 'relative', width: '100%' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: 'auto',
                minHeight: 300,
                borderRadius: 8,
                backgroundColor: '#000',
                display: 'block',
                objectFit: 'cover',
              }}
            />
            <canvas
              ref={canvasRef}
              style={{ display: 'none' }}
            />
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCapture}
          variant="contained"
          startIcon={<CameraAltIcon />}
          disabled={!stream}
        >
          Capture
        </Button>
      </DialogActions>
    </Dialog>
  )
}
