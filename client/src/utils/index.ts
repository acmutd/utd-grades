import type { Grades } from "@utd-grades/db";
import type { UserFriendlyGrades } from "../types";

export function getLetterGrade(grade: number): keyof UserFriendlyGrades {
  if (grade >= 0.97) {
    return "A+";
  } else if (grade >= 0.93) {
    return "A";
  } else if (grade >= 0.9) {
    return "A-";
  } else if (grade >= 0.87) {
    return "B+";
  } else if (grade >= 0.83) {
    return "B";
  } else if (grade >= 0.8) {
    return "B-";
  } else if (grade >= 0.77) {
    return "C+";
  } else if (grade >= 0.73) {
    return "C";
  } else if (grade >= 0.7) {
    return "C-";
  } else if (grade >= 0.67) {
    return "D+";
  } else if (grade >= 0.63) {
    return "D";
  } else if (grade >= 0.6) {
    return "D-";
  } else {
    return "F";
  }
}

export function getLetterGradeColor(grade: keyof UserFriendlyGrades): string {
  // FIXME: some of these colors are pretty hard to read on white. Adjust for accessibility (see https://web.dev/color-and-contrast-accessibility/)
  const colorMap = {
    "A+": "rgb(45, 179, 63)",
    "A": "rgb(48, 199, 55)",
    "A-": "rgb(107, 212, 15)",
    "B+": "rgb(147, 209, 13)",
    "B": "rgb(205, 255, 79)",
    "B-": "rgb(255, 225, 77)",
    "C+": "rgb(255, 208, 54)",
    "C": "rgb(255, 173, 51)",
    "C-": "rgb(255, 112, 77)",
    "D+": "rgb(245, 24, 169)",
    "D": "rgb(160, 30, 86)",
    "D-": "rgb(117, 14, 58)",
    "F": "rgb(216, 10, 55)",
    "CR": "rgb(102, 102, 102)", // TODO: figure out nicer colors
    "NC": "rgb(102, 102, 102)",
    "P": "rgb(102, 102, 102)",
    "W": "rgb(102, 102, 102)",
    "I": "rgb(102, 102, 102)",
    "NF": "rgb(102, 102, 102)",
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

  addIfNotZero("A+", grades.aPlus);
  addIfNotZero("A", grades.a);
  addIfNotZero("A-", grades.aMinus);
  addIfNotZero("B+", grades.bPlus);
  addIfNotZero("B", grades.b);
  addIfNotZero("B-", grades.bMinus);
  addIfNotZero("C+", grades.cPlus);
  addIfNotZero("C", grades.c);
  addIfNotZero("C-", grades.cMinus);
  addIfNotZero("D+", grades.dPlus);
  addIfNotZero("D", grades.d);
  addIfNotZero("D-", grades.dMinus);
  addIfNotZero("F", grades.f);
  addIfNotZero("CR", grades.cr);
  addIfNotZero("NC", grades.nc);
  addIfNotZero("P", grades.p);
  addIfNotZero("W", grades.w);
  addIfNotZero("I", grades.i);
  addIfNotZero("NF", grades.nf);

  return ret;
}

// normalize name with RMP standard (from Evan's Python script)
// https://github.com/emw8105/professor-ratings-script/blob/main/aggregator.py
export function normalizeName(name: string): string[] {
  // Trim leading and trailing spaces
  name = name.trim();

  // Standardize comma spacing
  name = name.replace(/\s*,\s*/g, ", ");

  // Remove middle initials
  // name = name.replace(/\s+[A-Z](\.[A-Z])*\s*$/, "");
  name = name.replace(/(\b[A-Z])\s+(?=[A-Z][a-z]+)/g, "");

  // Add space between initials (e.g., "J.P." → "J P")
  name = name.replace(/([A-Z])\.([A-Z])/g, "$1 $2");

  // Remove periods and extra spaces
  name = name.replace(/[.\s]+/g, " ");

  // Remove different types of apostrophes
  name = name.replace(/[’'ʻ`]/g, "");

  // Replace hyphens with spaces
  name = name.replace(/-/g, " ");

  name = name.toLowerCase();
  if (name.split(/\s+/).filter(Boolean).length >= 3) {
    const parts = name.split(/\s+/).filter(Boolean);
    const variations = [name];
    for (let i = 1; i < parts.length - 1; i++) {
      const variation = parts
        .slice(0, i)
        .concat(parts.slice(i + 1))
        .join(" ");
      variations.push(variation);
    }
    return variations;
  }
  return [name];
}

function normalizeSearchValue(value: string): string {
  return value.toLowerCase().replace(/\s+/g, " ").trim();
}

export function normalizeSortValue(value: string | null | undefined): string {
  return normalizeSearchValue(value ?? "");
}

export function getCourseTitleMatchRank(courseName: string | null | undefined, query: string): number {
  const normalizedQuery = normalizeSearchValue(query);
  const normalizedCourseName = normalizeSearchValue(courseName ?? "");

  if (!normalizedQuery || !normalizedCourseName) {
    return Number.POSITIVE_INFINITY;
  }

  if (normalizedCourseName === normalizedQuery) {
    return 0;
  }

  if (
    normalizedCourseName.startsWith(`${normalizedQuery} `) ||
    normalizedCourseName.startsWith(`${normalizedQuery}-`) ||
    normalizedCourseName.startsWith(`${normalizedQuery}:`)
  ) {
    return 1;
  }

  const index = normalizedCourseName.indexOf(normalizedQuery);
  if (index !== -1) {
    return 2 + index / 1000;
  }

  return Number.POSITIVE_INFINITY;
}

export function getSearchStringRank(value: string, query: string): number {
  const normalizedValue = normalizeSearchValue(value);
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return Number.POSITIVE_INFINITY;
  }

  if (normalizedValue === normalizedQuery) {
    return 0;
  }

  const index = normalizedValue.indexOf(normalizedQuery);
  if (index === -1) {
    return Number.POSITIVE_INFINITY;
  }

  return index + normalizedValue.length / 100000;
}

export function getSectionSearchRank(
  section: Pick<Grades, "courseName" | "subject" | "catalogNumber" | "section" | "instructor1">,
  query: string
): number {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) {
    return Number.POSITIVE_INFINITY;
  }

  const normalizedCourseName = normalizeSearchValue(section.courseName ?? "");
  const normalizedCode = normalizeSearchValue(`${section.subject} ${section.catalogNumber}`);
  const normalizedSectionCode = normalizeSearchValue(`${section.subject} ${section.catalogNumber}.${section.section}`);
  const normalizedInstructor = normalizeSearchValue(
    `${section.instructor1?.first ?? ""} ${section.instructor1?.last ?? ""}`
  );

  if (normalizedCourseName === normalizedQuery) {
    return 0;
  }

  if (normalizedCourseName.startsWith(`${normalizedQuery} `) ||
    normalizedCourseName.startsWith(`${normalizedQuery}-`) ||
    normalizedCourseName.startsWith(`${normalizedQuery}:`)) {
    return 1;
  }

  if (normalizedCode === normalizedQuery || normalizedSectionCode === normalizedQuery) {
    return 1.5;
  }

  if (normalizedCode.startsWith(normalizedQuery) || normalizedSectionCode.startsWith(normalizedQuery)) {
    return 2;
  }

  const courseNameIndex = normalizedCourseName.indexOf(normalizedQuery);
  if (courseNameIndex !== -1) {
    return 3 + courseNameIndex / 1000 + normalizedCourseName.length / 100000;
  }

  const codeIndex = normalizedCode.indexOf(normalizedQuery);
  if (codeIndex !== -1) {
    return 4 + codeIndex / 1000;
  }

  const instructorIndex = normalizedInstructor.indexOf(normalizedQuery);
  if (instructorIndex !== -1) {
    return 5 + instructorIndex / 1000;
  }

  return Number.POSITIVE_INFINITY;
}

export function compareSectionRecency(
  a: Pick<Grades, "semester" | "catalogNumber" | "subject" | "section" | "courseName">,
  b: Pick<Grades, "semester" | "catalogNumber" | "subject" | "section" | "courseName">
): number {
  const seasonRank = { Spring: 0, Summer: 1, Fall: 2 } as const;
  return (
    b.semester.year - a.semester.year ||
    seasonRank[b.semester.season] - seasonRank[a.semester.season] ||
    a.catalogNumber.localeCompare(b.catalogNumber) ||
    a.subject.localeCompare(b.subject) ||
    a.section.localeCompare(b.section) ||
    (a.courseName ?? "").localeCompare(b.courseName ?? "")
  );
}
