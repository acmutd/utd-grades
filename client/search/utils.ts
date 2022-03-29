import { ParamsObject } from 'sql.js';
import { Grades } from 'utd-grades-models';
import { splitName } from '../components/utils';

export function abbreviateSemesterName(name: string) {
  name = name.trim().toLowerCase();
  if (name === 'summer') {
    return 'su';
  } else if (name === 'spring') {
    return 's';
  } else if (name === 'fall') {
    return 'f';
  }
  return null;
}

export function expandSemesterNames(grades: Grades[]): Grades[] {
  // can't be null in this case because input isn't null
  return grades.map((g) => expandSemesterName(g)!);
}

export function expandSemesterName(grades: Grades | null): Grades | null {
  if (!grades) return grades;

  let s = grades.semester;

  if (s.startsWith('su')) {
    s = `Summer 20${s.substring(2)}`;
  } else if (s.startsWith('s')) {
    s = `Spring 20${s.substring(1)}`;
  } else if (s.startsWith('f')) {
    s = `Fall 20${s.substring(1)}`;
  }

  grades.semester = s;

  return grades;
}

export function rowToGrades(row: ParamsObject): Grades | null {
  if (row.gradesId === undefined) return null;

  const [instructor1First, instructor1Last] = splitName(row.instructor1 as string); // FIXME (no professor)

  return {
    id: row.gradesId as number,
    semester: row.semester as string,
    subject: row.subject as string,
    catalogNumber: row.catalogNumber as string,
    section: row.section as string,
    aPlus: row.aPlus as number,
    a: row.a as number,
    aMinus: row.aMinus as number,
    bPlus: row.bPlus as number,
    b: row.b as number,
    bMinus: row.bMinus as number,
    cPlus: row.cPlus as number,
    c: row.c as number,
    cMinus: row.cMinus as number,
    dPlus: row.dPlus as number,
    d: row.d as number,
    dMinus: row.dMinus as number,
    f: row.f as number,
    cr: row.cr as number,
    nc: row.nc as number,
    p: row.p as number,
    w: row.w as number,
    i: row.i as number,
    nf: row.nf as number,
    instructor1: {
      first: instructor1First,
      last: instructor1Last,
    },
    // TODO (more professors)
    instructor2: null,
    instructor3: null,
    instructor4: null,
    instructor5: null,
    instructor6: null,
  };
}
