export interface CatalogNumber {
  id?: number
  name: string
}

export interface Professor {
  id?: number
  first: string | null
  last: string
}

export interface Section {
  id?: number
  name: string
}

export interface Semester {
  id?: number
  name: string
}

export interface Subject {
  id?: number
  name: string
}

export interface Grades {
  id?: number
  semester: Semester
  subject: Subject
  catalogNumber: CatalogNumber
  section: Section
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
  instructor1: Professor
  instructor2?: Professor
  instructor3?: Professor
  instructor4?: Professor
  instructor5?: Professor
  instructor6?: Professor
}
