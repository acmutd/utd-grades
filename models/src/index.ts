export interface Instructor {
  first: string | null
  last: string
}

export interface Grades {
  id?: number
  semester: string
  subject: string
  catalogNumber: string
  section: string
  aPlus: number  
  a: number
  aMinus: number
  bPlus: number
  b: number
  bMinus: number
  cPlus: number
  c: number
  cMinus: number
  dPlus: number
  d: number
  dMinus: number
  f: number
  cr: number
  nc: number
  p: number
  w: number
  i: number
  nf: number
  instructor1: Instructor | null // FIXME (no professor): why do some sections have no professor???
  instructor2: Instructor | null
  instructor3: Instructor | null
  instructor4: Instructor | null
  instructor5: Instructor | null
  instructor6: Instructor | null

  totalStudents: number
  average: number
}

type Modify<T, R> = Omit<T, keyof R> & R;

// A type which is the same as Grades except with the string variables changed to numbers
// This corresponds directly to a row in the grades table in the database
export type GradesRow = Modify<Omit<Grades, "totalStudents" | "average">, {
  semester: number
  subject: number
  catalogNumber: number
  section: number
  instructor1: number | null
  instructor2: number | null
  instructor3: number | null
  instructor4: number | null
  instructor5: number | null
  instructor6: number | null
}>