import React, { useState } from 'react'
import {
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Paper,
  Grid,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SchoolIcon from '@mui/icons-material/School'
import BookIcon from '@mui/icons-material/Book'
import PaymentIcon from '@mui/icons-material/Payment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SecurityIcon from '@mui/icons-material/Security'
import PeopleIcon from '@mui/icons-material/People'

interface FAQItem {
  question: string
  answer: string
}

interface FAQCategory {
  title: string
  icon: React.ReactNode
  items: FAQItem[]
}

const faqCategories: FAQCategory[] = [
  {
    title: '📘 Tutor Requirements',
    icon: <SchoolIcon sx={{ fontSize: 28 }} />,
    items: [
      {
        question: 'What qualifications do I need to become a tutor?',
        answer:
          'You must demonstrate subject expertise through formal education, certifications, or relevant experience. Strong communication skills and the ability to teach concepts clearly are essential.',
      },
      {
        question: 'Do I need teaching experience?',
        answer:
          'Teaching experience is recommended but not required. However, you should be comfortable explaining material in a structured and engaging way.',
      },
      {
        question: 'Are tutors required to undergo verification?',
        answer:
          'Yes. Tutors must complete identity verification and provide accurate information about their education and background.',
      },
    ],
  },
  {
    title: '📚 Subjects & Qualifications',
    icon: <BookIcon sx={{ fontSize: 28 }} />,
    items: [
      {
        question: 'Which subjects can I tutor?',
        answer:
          'You may tutor any subject in which you have sufficient expertise, such as academics, test prep, professional skills, or specialized fields.',
      },
      {
        question: 'How do I prove my qualifications?',
        answer:
          'You can upload degrees, transcripts, certificates, or other proof of your subject mastery during registration.',
      },
      {
        question: 'Can I add or remove subjects later?',
        answer:
          'Yes. Tutors can update or expand their subjects at any time by editing their profile.',
      },
    ],
  },
  {
    title: '💰 Payments & Rates',
    icon: <PaymentIcon sx={{ fontSize: 28 }} />,
    items: [
      {
        question: 'How do I set my hourly rate?',
        answer:
          'Tutors can set their own hourly rate based on experience, subject demand, and market standards.',
      },
      {
        question: 'How do I receive payments?',
        answer:
          'Payments are processed through your selected payout method (bank transfer, PayPal, etc.), depending on your region.',
      },
      {
        question: 'Are there any fees?',
        answer:
          'A platform service fee may apply. This will be clearly outlined before you begin tutoring.',
      },
    ],
  },
  {
    title: '🗓 Scheduling & Availability',
    icon: <CalendarTodayIcon sx={{ fontSize: 28 }} />,
    items: [
      {
        question: 'How do I set my availability?',
        answer:
          'You can manage your schedule using the availability calendar in your dashboard, selecting time slots that work for you.',
      },
      {
        question: 'Can students book sessions directly?',
        answer:
          'Yes. Once your availability is set, students can request or book sessions during the time slots you\'ve opened.',
      },
      {
        question: 'Can I change my schedule anytime?',
        answer:
          'Absolutely. Your availability can be updated at any time to reflect your current schedule.',
      },
    ],
  },
  {
    title: '🔐 Policies & Security',
    icon: <SecurityIcon sx={{ fontSize: 28 }} />,
    items: [
      {
        question: 'How is my personal information protected?',
        answer:
          'We use secure encryption and privacy controls to ensure all personal data, documents, and identity verification files remain protected.',
      },
      {
        question: 'Are background checks required?',
        answer:
          'Depending on your region or the subjects you tutor, additional checks may be requested for enhanced trust and safety.',
      },
      {
        question: 'What policies must tutors follow?',
        answer:
          'Tutors must adhere to platform policies regarding professionalism, communication, academic integrity, and respectful conduct.',
      },
    ],
  },
  {
    title: '👥 Student–Tutor Interactions',
    icon: <PeopleIcon sx={{ fontSize: 28 }} />,
    items: [
      {
        question: 'How do students contact me?',
        answer:
          'Students can reach out through your profile via messaging or by requesting a lesson.',
      },
      {
        question: 'What should I do if a student is unresponsive?',
        answer:
          'You can send a follow-up message or report the issue if it affects scheduling or payment.',
      },
      {
        question: 'How do I handle disputes or misunderstandings?',
        answer:
          'Use clear communication first. If the issue persists, contact support for assistance in resolving the situation.',
      },
    ],
  },
]

export default function FAQ() {
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          Frequently Asked Questions
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Find answers to common questions about becoming a tutor and using our platform
        </Typography>
      </Box>

      {/* FAQ Categories */}
      <Grid container spacing={4}>
        {faqCategories.map((category, categoryIndex) => (
          <Grid item xs={12} key={categoryIndex}>
            {/* Category Header */}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                backgroundColor: '#f5f5f5',
                borderLeft: '4px solid #1976d2',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Box sx={{ color: '#1976d2' }}>{category.icon}</Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {category.title}
              </Typography>
            </Paper>

            {/* Accordion Items */}
            <Box>
              {category.items.map((item, itemIndex) => (
                <Accordion
                  key={itemIndex}
                  expanded={expanded === `${categoryIndex}-${itemIndex}`}
                  onChange={handleChange(`${categoryIndex}-${itemIndex}`)}
                  sx={{
                    mb: 1,
                    '&:before': {
                      display: 'none',
                    },
                    boxShadow: expanded === `${categoryIndex}-${itemIndex}` ? 1 : 0,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`${categoryIndex}-${itemIndex}-content`}
                    id={`${categoryIndex}-${itemIndex}-header`}
                    sx={{
                      backgroundColor:
                        expanded === `${categoryIndex}-${itemIndex}` ? '#e3f2fd' : '#fafafa',
                      '&:hover': {
                        backgroundColor: '#f0f0f0',
                      },
                      transition: 'background-color 0.2s ease',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: expanded === `${categoryIndex}-${itemIndex}` ? 600 : 500,
                        color: expanded === `${categoryIndex}-${itemIndex}` ? '#1976d2' : 'inherit',
                      }}
                    >
                      {item.question}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ backgroundColor: '#ffffff', pt: 2 }}>
                    <Typography color="text.secondary">{item.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Contact Support Section */}
      <Paper
        elevation={0}
        sx={{
          mt: 6,
          p: 3,
          backgroundColor: '#f5f5f5',
          textAlign: 'center',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
          Didn't find your answer?
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Can't find the information you're looking for? Our support team is here to help.
        </Typography>
        <Typography
          component="a"
          href="mailto:support@etutors.com"
          sx={{
            color: '#1976d2',
            textDecoration: 'none',
            fontWeight: 'bold',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Contact Support →
        </Typography>
      </Paper>
    </Container>
  )
}
