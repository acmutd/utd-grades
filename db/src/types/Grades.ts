import type { GradesRow } from "./GradesRow";

type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * A higher-level representation of a GradesRow where the string IDs have been replaced by the actual strings in the strings table.
 *
 * It also has extra useful data like totalStudents and average.
 */
export type Grades = Modify<
  GradesRow,
  {
    semester: Semester;
    subject: string;
    catalogNumber: string;
    section: string;
    instructor1: Instructor | null;
    instructor2: Instructor | null;
    instructor3: Instructor | null;
    instructor4: Instructor | null;
    instructor5: Instructor | null;
    instructor6: Instructor | null;
    totalStudents: number;
    average: number;
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
