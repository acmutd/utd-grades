/**
 * Corresponds directly to a row in the grades table in the database.
 */
export interface GradesRow {
  id: number;
  semester: number;
  subject: number;
  catalogNumber: number;
  section: number;
  aPlus: number;
  a: number;
  aMinus: number;
  bPlus: number;
  b: number;
  bMinus: number;
  cPlus: number;
  c: number;
  cMinus: number;
  dPlus: number;
  d: number;
  dMinus: number;
  f: number;
  cr: number;
  nc: number;
  p: number;
  w: number;
  i: number;
  nf: number;
  instructor1: number | null; // FIXME (no professor): why do some sections have no professor???
  instructor2: number | null;
  instructor3: number | null;
  instructor4: number | null;
  instructor5: number | null;
  instructor6: number | null;
}
