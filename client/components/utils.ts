import { UserFriendlyGrades } from "../types";

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