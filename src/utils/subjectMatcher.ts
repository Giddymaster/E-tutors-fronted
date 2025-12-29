// Subject matching utilities for recommending assignments to tutors

export const SYNONYMS_MAP: Record<string, string[]> = {
  math: ['mathematics', 'calculus', 'algebra', 'geometry', 'trigonometry'],
  maths: ['mathematics', 'calculus', 'algebra', 'geometry', 'trigonometry'],
  mathematics: ['math', 'calculus'],
  calculus: ['math', 'mathematics'],
  algebra: ['math', 'mathematics'],
  geometry: ['math', 'mathematics'],
  'computer science': ['computer science', 'cs', 'programming', 'software'],
  programming: ['computer science', 'cs', 'software', 'coding'],
  cs: ['computer science', 'programming'],
  physics: ['physics', 'mechanics', 'thermodynamics'],
  chemistry: ['chemistry', 'organic chemistry', 'inorganic chemistry'],
  biology: ['biology', 'life science'],
  english: ['english', 'literature', 'writing'],
  history: ['history', 'world history'],
  economics: ['economics', 'microeconomics', 'macroeconomics'],
  accounting: ['accounting', 'finance'],
  'data science': ['data science', 'machine learning', 'ml', 'statistics'],
  statistics: ['statistics', 'probability'],
}

export const expandToken = (t: string) => {
  const k = String(t || '').trim().toLowerCase()
  if (!k) return [] as string[]
  const s = new Set<string>()
  s.add(k)
  if (SYNONYMS_MAP[k]) SYNONYMS_MAP[k].forEach((x) => s.add(x))
  return Array.from(s)
}

export const expandSubjects = (subjects: string[] | undefined) => {
  const set = new Set<string>()
  if (!subjects || !Array.isArray(subjects)) return [] as string[]
  subjects.forEach((s) => {
    const lower = String(s || '').trim().toLowerCase()
    if (!lower) return
    set.add(lower)
    if (SYNONYMS_MAP[lower]) SYNONYMS_MAP[lower].forEach((x) => set.add(x))
  })
  return Array.from(set)
}

export const matchesAssignment = (subject: string | undefined, tutorSubjects: string[]) => {
  if (!subject || !tutorSubjects || tutorSubjects.length === 0) return false
  const tokens = String(subject).toLowerCase().split(/[^a-z0-9]+/).map((t) => t.trim()).filter(Boolean)
  for (const tok of tokens) {
    const expanded = expandToken(tok)
    for (const e of expanded) {
      if (tutorSubjects.includes(e)) return true
    }
  }
  // fallback: substring match
  const subj = String(subject).toLowerCase()
  return tutorSubjects.some((ts) => subj.includes(ts) || ts.includes(subj))
}
