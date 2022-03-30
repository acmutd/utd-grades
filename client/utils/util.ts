import { Grades } from 'utd-grades-models';
import { UserFriendlyGrades } from '../types';

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
