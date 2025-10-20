import React, { useEffect, useState } from 'react'
import {
  Container,
  Grid,
  Typography,
  Box,
  Tabs,
  Tab,
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

function a11yProps(index: number) {
  return {
    id: `mode-tab-${index}`,
    'aria-controls': `mode-tabpanel-${index}`,
  }
}

export default function Tutors() {
  const [tutors, setTutors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'assignment' | 'tutoring'>('assignment')

  // Assignment form state
  const [title, setTitle] = useState('')
  const [words, setWords] = useState<number | ''>('')
  const [subject, setSubject] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [price, setPrice] = useState<number | ''>('')
    const [moreFiles, setMoreFiles] = useState<FileList | null>(null);
    const [resourceLinks, setResourceLinks] = useState<string[]>(['']);
    const handleAddLink = () => setResourceLinks([...resourceLinks, '']);
    const handleRemoveLink = (idx: number) => setResourceLinks(resourceLinks.filter((_, i) => i !== idx));
    const handleLinkChange = (idx: number, value: string) => setResourceLinks(resourceLinks.map((l, i) => i === idx ? value : l));
    const [showMoreResources, setShowMoreResources] = useState(false);

  // Tutoring form state
  const [tutorSubject, setTutorSubject] = useState('')
  const [hours, setHours] = useState<number | ''>('')
  const [rate, setRate] = useState<number | ''>('')

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/tutors')
        setTutors(res.data.tutors || [])
      } catch (err) {
        console.error('Failed to load tutors', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleModeChange = (_: React.SyntheticEvent, value: string) => {
    if (value === 'assignment' || value === 'tutoring') setMode(value)
  }

  const submitAssignment = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call API to submit assignment help request
    console.log('Assignment submitted', { title, words, subject, dueDate, price })
    // clear form
    setTitle('')
    setWords('')
    setSubject('')
    setDueDate('')
    setPrice('')
  }

  const submitTutoring = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call API to request tutoring
    console.log('Tutoring requested', { tutorSubject, hours, rate })
    setTutorSubject('')
    setHours('')
    setRate('')
  }

  return (
    <>
      <Grid container sx={{ minHeight: '60vh' }}>
        {/* Left: Image */}
        <Grid
          item
          xs={false}
          md={6}
          sx={{
            backgroundImage: 'url("https://images.pexels.com/photos/4308164/pexels-photo-4308164.jpeg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: { xs: 240, md: '60vh' },
          }}
        />

        {/* Right: Forms */}
        <Grid item xs={12} md={6} sx={{ display: 'flex', alignItems: 'center' }}>
          <Container sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom>
              Looking for assignment help or tutoring?
            </Typography>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={mode} onChange={handleModeChange} aria-label="choose mode">
                <Tab label="Assignment Help" value="assignment" {...a11yProps(0)} />
                <Tab label="Tutoring" value="tutoring" {...a11yProps(1)} />
              </Tabs>
            </Box>

            {mode === 'assignment' && (
              <Box component="form" onSubmit={submitAssignment} sx={{ mb: 4, display: 'grid', gap: 2 }}>
                <TextField label="Title of the Assignment" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
                <TextField label="Number of Words" value={words} onChange={(e) => setWords(Number(e.target.value) || '')} type="number" fullWidth />
                <FormControl fullWidth>
                  <InputLabel id="subject-select-label">Subject</InputLabel>
                  <Select
                    labelId="subject-select-label"
                    value={subject}
                    label="Subject"
                    onChange={(e) => setSubject(e.target.value)}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          width: 250
                        },
                      },
                    }}
                  >
                    {academicSubjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField label="Due Date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" InputLabelProps={{ shrink: true }} fullWidth />
                <TextField label="Price" value={price} onChange={(e) => setPrice(Number(e.target.value) || '')} type="number" fullWidth />
                <Button variant="outlined" onClick={() => setShowMoreResources(v => !v)} sx={{ mt: 1, mb: 1 }}>
                  {showMoreResources ? 'Hide More Resources' : 'Add More Resources'}
                </Button>
                {showMoreResources && (
                  <Box sx={{ border: '1px dashed #ccc', borderRadius: 2, p: 2, mb: 2 }}>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel shrink htmlFor="more-files">Upload More Documents</InputLabel>
                      <input
                        id="more-files"
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.zip,.rar,.ppt,.pptx,.xls,.xlsx"
                        style={{ marginTop: 8 }}
                        onChange={e => setMoreFiles(e.target.files)}
                      />
                      <Typography variant="caption" color="text.secondary">You can upload more documents here.</Typography>
                    </FormControl>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>Resource Links</Typography>
                    {resourceLinks.map((link, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <TextField
                          label={`Resource Link ${idx + 1}`}
                          value={link}
                          onChange={e => handleLinkChange(idx, e.target.value)}
                          fullWidth
                        />
                        <Button onClick={() => handleRemoveLink(idx)} disabled={resourceLinks.length === 1} sx={{ ml: 1 }} color="error">Remove</Button>
                      </Box>
                    ))}
                    <Button onClick={handleAddLink} sx={{ mt: 1 }}>Add Another Link</Button>
                  </Box>
                )}
                <Button variant="contained" type="submit">Submit</Button>
              </Box>
            )}

            {mode === 'tutoring' && (
              <Box component="form" onSubmit={submitTutoring} sx={{ mb: 4, display: 'grid', gap: 2 }}>
                <TextField label="Subject" value={tutorSubject} onChange={(e) => setTutorSubject(e.target.value)} fullWidth />
                <TextField label="Number of Hours" value={hours} onChange={(e) => setHours(Number(e.target.value) || '')} type="number" fullWidth />
                <TextField 
                  label="Pay per hour" 
                  value={rate} 
                  onChange={(e) => setRate(Number(e.target.value) || '')} 
                  type="number" 
                  fullWidth 
                  inputProps={{ min: 20 }}
                  helperText="Minimum $20 per hour"
                />
                <Button variant="contained" type="submit">Request Tutor</Button>
              </Box>
            )}
          </Container>
        </Grid>
      </Grid>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Available Tutors
        </Typography>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Grid container spacing={2}>
            {tutors.map((t: any) => (
              <Grid item xs={12} md={6} key={t.id}>
                <TutorCard tutor={{ id: t.id, name: t.user?.name, bio: t.bio }} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  )
}
