import React from 'react'
import { Container, Typography, Box, Divider } from '@mui/material'

const TERMS = [
  {
    title: '1. Acceptance of Terms',
    body:
      'By using this platform you agree to these Terms of Service. You must be at least 18 years old or have the legal capacity to enter into contracts in your jurisdiction.',
  },
  {
    title: '2. Registration Fee & Payments',
    body:
      'A one-time registration fee (when applicable) must be paid to activate certain tutor features. All payments are final unless otherwise stated; fees may be processed by third-party payment providers and are subject to their terms.',
  },
  {
    title: '3. Tutor and Student Conduct',
    body:
      'All users must act professionally and respectfully. Tutors are expected to provide accurate information about their qualifications and to deliver services honestly. Harassment, discrimination, and fraudulent behavior are strictly prohibited.',
  },
  {
    title: '4. Content, Intellectual Property & Privacy',
    body:
      'Users retain ownership of the content they upload, but grant the platform a license to use that content for providing services. Personal data is handled according to the Privacy Policy; do not share sensitive information publicly.',
  },
  {
    title: '5. Termination, Liability & Dispute Resolution',
    body:
      'We may suspend or terminate accounts that violate these terms. The platform is not liable for indirect damages; where permitted, disputes will be resolved through the applicable local laws or arbitration as described in our policies.',
  },
]

export default function Terms() {
  return (
    <Container sx={{ mt: 4, mb: 6 }}>
      <Typography variant="h4" gutterBottom>
        Terms of Service
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Please read these terms carefully. They describe your rights and responsibilities when
        using the platform.
      </Typography>

      <Box sx={{ display: 'grid', gap: 2 }}>
        {TERMS.map((t) => (
          <Box key={t.title}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {t.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {t.body}
            </Typography>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </Box>
    </Container>
  )
}
