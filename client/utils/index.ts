import { ParamsObject } from 'sql.js';
import { Grades } from 'utd-grades-models';
import { UserFriendlyGrades } from '../types';

export function splitName(name: string): [first: string, last: string] {
  const space = name.lastIndexOf(' ');
  return [name.substring(0, space), name.substring(space + 1)];
}

export function getLetterGrade(grade: number): keyof UserFriendlyGrades {
  if (grade >= 0.97) {
    return 'A+';
  } else if (grade >= 0.93) {
    return 'A';
  } else if (grade >= 0.9) {
    return 'A-';
  } else if (grade >= 0.87) {
    return 'B+';
  } else if (grade >= 0.83) {
    return 'B';
  } else if (grade >= 0.8) {
    return 'B-';
  } else if (grade >= 0.77) {
    return 'C+';
  } else if (grade >= 0.73) {
    return 'C';
  } else if (grade >= 0.7) {
    return 'C-';
  } else if (grade >= 0.67) {
    return 'D+';
  } else if (grade >= 0.63) {
    return 'D';
  } else if (grade >= 0.6) {
    return 'D-';
  } else {
    return 'F';
  }
}

export function getLetterGradeColor(grade: keyof UserFriendlyGrades): string {
  // FIXME: some of these colors are pretty hard to read on white. Adjust for accessibility (see https://web.dev/color-and-contrast-accessibility/)
  const colorMap = {
    'A+': 'rgb(45, 179, 63)',
    A: 'rgb(48, 199, 55)',
    'A-': 'rgb(107, 212, 15)',
    'B+': 'rgb(147, 209, 13)',
    B: 'rgb(205, 255, 79)',
    'B-': 'rgb(255, 225, 77)',
    'C+': 'rgb(255, 208, 54)',
    C: 'rgb(255, 173, 51)',
    'C-': 'rgb(255, 112, 77)',
    'D+': 'rgb(245, 24, 169)',
    D: 'rgb(160, 30, 86)',
    'D-': 'rgb(117, 14, 58)',
    F: 'rgb(216, 10, 55)',
    CR: 'rgb(102, 102, 102)', // TODO: figure out nicer colors
    NC: 'rgb(102, 102, 102)',
    P: 'rgb(102, 102, 102)',
    W: 'rgb(102, 102, 102)',
    I: 'rgb(102, 102, 102)',
    NF: 'rgb(102, 102, 102)',
  };

  return colorMap[grade];
}

export function getColors(keys: (keyof UserFriendlyGrades)[]) {
  return keys.map((key) => getLetterGradeColor(key));
}

export function extractGrades(grades: Grades): UserFriendlyGrades {
  const ret: UserFriendlyGrades = {};

  function addIfNotZero(key: keyof UserFriendlyGrades, value: number) {
    if (value === 0) return;
    ret[key] = value;
  }

  addIfNotZero('A+', grades.aPlus);
  addIfNotZero('A', grades.a);
  addIfNotZero('A-', grades.aMinus);
  addIfNotZero('B+', grades.bPlus);
  addIfNotZero('B', grades.b);
  addIfNotZero('B-', grades.bMinus);
  addIfNotZero('C+', grades.cPlus);
  addIfNotZero('C', grades.c);
  addIfNotZero('C-', grades.cMinus);
  addIfNotZero('D+', grades.dPlus);
  addIfNotZero('D', grades.d);
  addIfNotZero('D-', grades.dMinus);
  addIfNotZero('F', grades.f);
  addIfNotZero('CR', grades.cr);
  addIfNotZero('NC', grades.nc);
  addIfNotZero('P', grades.p);
  addIfNotZero('W', grades.w);
  addIfNotZero('I', grades.i);
  addIfNotZero('NF', grades.nf);

  return ret;
}

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
