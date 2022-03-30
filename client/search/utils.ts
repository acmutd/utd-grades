import { ParamsObject } from 'sql.js';
import { Grades } from 'utd-grades-models';
import { splitName } from '../components/utils';

function getGrades(row: ParamsObject, includeNonGraded: boolean): number[] {
  const ret = [
    row.aPlus,
    row.a,
    row.aMinus,
    row.bPlus,
    row.b,
    row.bMinus,
    row.cPlus,
    row.c,
    row.cMinus,
    row.dPlus,
    row.d,
    row.dMinus,
  ];
  if (includeNonGraded) {
    ret.push(row.cr, row.nc, row.p, row.w, row.i, row.nf);
  }
  return ret as number[];
}

// The percents are based on the Grade Points per Semester Hour (see https://catalog.utdallas.edu/now/undergraduate/policies/academic)
// For example, earning an A yields 4 out of 4 possible grade points, so it corresponds to 100%
// For example, earning a C+ yields 2.330 out of 4 possible grade points, so it corresponds to 58.25%
function getAverage(row: ParamsObject): number {
  const numGrades = 12;
  // FIXME: we currently don't include F here. I feel like we should, but technically you didn't earn a grade if you got an F? not sure
  const percentOfGradePoints = [
    1, 1, 0.9175, 0.8325, 0.75, 0.6675, 0.5825, 0.5, 0.4175, 0.3325, 0.25,
    0.1675,
  ];
  const grades = getGrades(row, false);

  let totalStudents = 0;
  let gradePoints = 0;

  for (let i = 0; i < numGrades; i++) {
    const numStudents = grades[i] as number;
    const percent = percentOfGradePoints[i];

    totalStudents += numStudents;
    gradePoints += percent * numStudents;
  }

  return gradePoints / totalStudents;
}

function getTotalStudents(row: ParamsObject): number {
  const grades = getGrades(row, true);
  return grades.reduce((acc, x) => acc + x, 0);
}

export function rowToGrades(row: ParamsObject): Grades | null {
  if (row.gradesId === undefined) return null;

  const [instructor1First, instructor1Last] = splitName(
    row.instructor1 as string
  ); // FIXME (no professor)

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

    totalStudents: getTotalStudents(row),
    average: getAverage(row),
  };
}
