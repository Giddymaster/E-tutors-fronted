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

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        setStream(mediaStream)
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Unable to access camera. Please check permissions.')
    } finally {
      setLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        // Set canvas dimensions to match video
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight

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
      }
    }
  }

  const handleClose = () => {
    stopCamera()
    onClose()
  }

  React.useEffect(() => {
    if (open) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [open])

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
        ) : loading ? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ position: 'relative', width: '100%' }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 8,
                backgroundColor: '#000',
                display: 'block',
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
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleCapture}
          variant="contained"
          startIcon={<CameraAltIcon />}
          disabled={!stream || loading}
        >
          Capture
        </Button>
      </DialogActions>
    </Dialog>
  )
}
