import type { GradesRow } from "./GradesRow";

type Modify<T, R> = Omit<T, keyof R> & R;

export const LETTER_GRADES = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
] as const;

export type LetterGrade = (typeof LETTER_GRADES)[number];

// Grade points per semester hour, per the UTD catalog:
// https://catalog.utdallas.edu/now/undergraduate/policies/academic
// I, P, W, CR, NC, and NF do not produce grade points and are intentionally excluded.
export const GPA_POINTS: Record<LetterGrade, number> = {
  "A+": 4.0,
  "A": 4.0,
  "A-": 3.67,
  "B+": 3.33,
  "B": 3.0,
  "B-": 2.67,
  "C+": 2.33,
  "C": 2.0,
  "C-": 1.67,
  "D+": 1.33,
  "D": 1.0,
  "D-": 0.67,
  "F": 0.0,
};

/**
 * Computed statistics about a section. Kept separate from the section's own identity/raw
 * fields so future computed metrics have one place to live without bloating `Grades` itself.
 */
export interface SectionStats {
  /** Mean GPA (0-4 scale), or null if the section has no graded students. */
  mean: number | null;
  /** Median letter grade, or null if the section has no graded students. */
  median: LetterGrade | null;
}

/**
 * A higher-level representation of a GradesRow where the string IDs have been replaced by the actual strings in the strings table.
 *
 * It also has extra useful data like totalStudents, average, and stats.
 */
export type Grades = Modify<
  GradesRow,
  {
    semester: Semester;
    subject: string;
    catalogNumber: string;
    courseName: string | null;
    section: string;
    instructor1: Instructor | null;
    instructor2: Instructor | null;
    instructor3: Instructor | null;
    instructor4: Instructor | null;
    instructor5: Instructor | null;
    instructor6: Instructor | null;
    totalStudents: number;
    average: number;
    stats: SectionStats;
  }
>;

export type Season = "Spring" | "Summer" | "Fall";

export interface Semester {
  season: Season;
  year: number;
}

export interface Instructor {
  first: string | null;
  last: string;
}
