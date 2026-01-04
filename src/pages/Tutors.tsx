import React, { useEffect, useState } from 'react'
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material'
import TutorCard from '../components/TutorCard'
import api from '../utils/api'

// Comprehensive list of academic subjects
const academicSubjects = [
  // Mathematics
  'Algebra', 'Advanced Algebra', 'Linear Algebra', 'Abstract Algebra', 'Calculus I', 'Calculus II', 'Calculus III', 'Multivariable Calculus', 
  'Differential Equations', 'Statistics', 'Probability', 'Discrete Mathematics', 'Number Theory', 'Geometry', 'Trigonometry', 'Mathematical Analysis',
  'Topology', 'Game Theory', 'Numerical Analysis', 'Complex Analysis',

  // Sciences
  'Physics', 'Chemistry', 'Biology', 'Astronomy', 'Earth Science', 'Environmental Science', 'Organic Chemistry', 'Inorganic Chemistry',
  'Physical Chemistry', 'Biochemistry', 'Molecular Biology', 'Cell Biology', 'Genetics', 'Microbiology', 'Anatomy', 'Physiology',
  'Quantum Physics', 'Thermodynamics', 'Mechanics', 'Electromagnetism', 'Nuclear Physics', 'Astrophysics', 'Biophysics',

  // Computer Science
  'Programming Fundamentals', 'Data Structures', 'Algorithms', 'Computer Architecture', 'Operating Systems', 'Database Systems',
  'Web Development', 'Software Engineering', 'Computer Networks', 'Cybersecurity', 'Artificial Intelligence', 'Machine Learning',
  'Computer Graphics', 'Mobile Development', 'Cloud Computing', 'Blockchain Technology', 'Computer Vision', 'Natural Language Processing',

  // Engineering
  'Mechanical Engineering', 'Electrical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Aerospace Engineering',
  'Biomedical Engineering', 'Industrial Engineering', 'Software Engineering', 'Environmental Engineering', 'Materials Science',
  'Robotics', 'Control Systems', 'Fluid Mechanics', 'Heat Transfer', 'Structural Analysis', 'Circuit Design',

  // Business & Economics
  'Microeconomics', 'Macroeconomics', 'Finance', 'Accounting', 'Marketing', 'Management', 'Business Administration',
  'International Business', 'Business Law', 'Corporate Finance', 'Investment Banking', 'Risk Management', 'Economic Theory',
  'Business Analytics', 'Supply Chain Management', 'Human Resource Management',

  // Humanities
  'History', 'Philosophy', 'Literature', 'English Composition', 'Creative Writing', 'Psychology', 'Sociology', 'Anthropology',
  'Political Science', 'International Relations', 'Art History', 'Music Theory', 'Linguistics', 'Religious Studies',
  'Cultural Studies', 'Gender Studies', 'Ethics', 'Classical Studies',

  // Languages
  'English', 'Spanish', 'French', 'German', 'Italian', 'Chinese', 'Japanese', 'Korean', 'Russian', 'Arabic',
  'Portuguese', 'Latin', 'Greek', 'Hindi', 'Turkish', 'Vietnamese',

  // Life Sciences
  'Zoology', 'Botany', 'Ecology', 'Marine Biology', 'Wildlife Biology', 'Neuroscience', 'Immunology', 'Parasitology',
  'Virology', 'Developmental Biology', 'Evolution', 'Conservation Biology',

  // Social Sciences
  'Economics', 'Psychology', 'Sociology', 'Anthropology', 'Political Science', 'Geography', 'Urban Planning',
  'Public Policy', 'Criminal Justice', 'Social Work', 'Education', 'Child Development',

  // Professional Studies
  'Law', 'Medicine', 'Dentistry', 'Pharmacy', 'Nursing', 'Public Health', 'Veterinary Medicine', 'Architecture',
  'Journalism', 'Library Science', 'Information Science', 'Social Media Marketing'
].sort()


export default function Tutors() {
  const [tutors, setTutors] = useState<any[]>([])
  const [fallbackTutors, setFallbackTutors] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [tutorSubject, setTutorSubject] = useState('')
  const [subject, setSubject] = useState('')
  const [rate, setRate] = useState<number | ''>('')
  const [sort, setSort] = useState<string>('')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const params: any = {}
        if (subject) params.subject = subject
        if (tutorSubject) params.q = tutorSubject
        if (rate) params.minRate = rate
        if (sort) params.sort = sort

        const res = await api.get('/tutors', { params })
        const found = res.data.tutors || []
        setTutors(found)
        // if none found and user searched by subject, fetch relaxed results for fallback recommendations
        if (found.length === 0 && subject) {
          try {
            const alt = await api.get('/tutors')
            setFallbackTutors(alt.data.tutors || [])
          } catch (e) {
            setFallbackTutors([])
          }
        } else {
          setFallbackTutors(null)
        }
      } catch (err) {
        console.error('Failed to load tutors', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [subject, tutorSubject, rate, sort])



  return (
    <>
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find a Tutor
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField label="Search tutors or subject" value={tutorSubject} onChange={(e) => setTutorSubject(e.target.value)} fullWidth />
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="subject-select-label">Subject</InputLabel>
            <Select
              labelId="subject-select-label"
              value={subject}
              label="Subject"
              onChange={(e) => setSubject(e.target.value)}
              MenuProps={{ PaperProps: { style: { maxHeight: 300, width: 250 } } }}
            >
              {academicSubjects.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => { /* filters are reactive */ }}>Search</Button>
        </Box>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            {tutors.length === 0 && subject ? (
              <Box sx={{ mb: 2 }}>
                <Typography>No tutors found for “{subject}”. Here are other tutors you might consider:</Typography>
                {fallbackTutors && fallbackTutors.length > 0 ? (
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {fallbackTutors.map((t: any) => (
                      <Grid item xs={12} md={6} key={t.id}>
                        <TutorCard tutor={t} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Typography color="text.secondary" sx={{ mt: 1 }}>No tutors available at the moment. Try broadening your search.</Typography>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                {tutors.map((t: any) => (
                  <Grid item xs={12} md={6} key={t.id}>
                    <TutorCard tutor={t} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Container>
    </>
  )
}
