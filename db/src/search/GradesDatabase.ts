import type { RMPInstructor } from "@utd-grades/db";
import type { Database } from "sql.js";
import type { Grades, Semester } from "../types/Grades";
import { createWhereString, parseSemester, rowToGrades, rowToInstructor, SEASONS } from "./utils";

export class GradesDatabase {
  protected db: Database;
  /** Next semester's schedule: the newest semester in the data if none of its sections have recorded students yet, else null. */
  readonly upcomingSemester: Semester | null;

  constructor(db: Database) {
    this.db = db;
    this.upcomingSemester = this.findUpcomingSemester();
  }

  private findUpcomingSemester(): Semester | null {
    const stmt = this.db.prepare(`
      SELECT semester.string AS semester,
             SUM(aPlus + a + aMinus + bPlus + b + bMinus + cPlus + c + cMinus + dPlus + d + dMinus + f
                 + cr + nc + p + w + i + nf) AS students
      FROM grades
      INNER JOIN strings semester ON semester.id = grades.semesterId
      GROUP BY grades.semesterId
    `);

    let newest: { semester: Semester; students: number } | null = null;
    while (stmt.step()) {
      const row = stmt.getAsObject();
      const [season, year] = parseSemester(row["semester"] as string);
      if (
        !newest ||
        year > newest.semester.year ||
        (year === newest.semester.year && SEASONS[season] > SEASONS[newest.semester.season])
      ) {
        newest = { semester: { season, year }, students: row["students"] as number };
      }
    }
    stmt.free();

    return newest && newest.students === 0 ? newest.semester : null;
  }

  close() {
    this.db.close();
  }

  /**
   * Retrieve all sections for a full search query
   * @param search
   */
  getSectionsBySearch(search: string): Grades[] {
    const grades: Grades[] = [];

    const query = `
    SELECT gradesId, * from grades_populated WHERE gradesId IN
      (SELECT id FROM grades_strings WHERE ${createWhereString(search)})
    `;
    const stmt = this.db.prepare(query);
    while (stmt.step()) {
      grades.push(rowToGrades(stmt.getAsObject())!);
    }
    stmt.free();

    // TODO: it would *probably* be better to do this sorting at the db level, but the sorting function isn't super straightforward and I don't know how to benchmark it anyway
    return grades.sort((a, b) => {
      const { season: seasonA, year: yearA } = a.semester;
      const { season: seasonB, year: yearB } = b.semester;

      // sort by semester then catalogNumber then subject then section
      return (
        yearB - yearA ||
        SEASONS[seasonB] - SEASONS[seasonA] ||
        a.catalogNumber.localeCompare(b.catalogNumber) ||
        a.subject.localeCompare(b.subject) ||
        a.section.localeCompare(b.section)
      );
    });
  }

  getSectionById(id: number): Grades | null {
    const stmt = this.db.prepare("SELECT * FROM grades_populated WHERE gradesId = ? LIMIT 1");
    const grades = rowToGrades(stmt.getAsObject([id]));

    stmt.free();

    return grades;
  }

  getInstructorsByName(name: string): RMPInstructor[] {
    const instructors: RMPInstructor[] = [];
    const stmt = this.db.prepare(`SELECT * FROM instructors WHERE name LIKE ?`);
    stmt.bind([name]); // Bind the value properly with wildcards

    while (stmt.step()) {
      const instructor = rowToInstructor(stmt.getAsObject());
      if (instructor) {
        instructors.push(instructor);
      }
    }

    stmt.free();

    return instructors;
  }

  getInstructorByNetId(netId: string): RMPInstructor | null {
    const stmt = this.db.prepare(`SELECT * FROM instructors WHERE instructor_id = ? LIMIT 1`);
    stmt.bind([netId]);

    const instructor = stmt.step() ? rowToInstructor(stmt.getAsObject()) : null;

    stmt.free();
    return instructor;
  }

  getCourseRating(instructor_id: string, course_code: string): number | null {
    const stmt = this.db.prepare(
      `SELECT * FROM course_ratings WHERE instructor_id LIKE ? AND course_code LIKE ?`
    );
    stmt.bind([instructor_id, course_code]);

    const result = stmt.step() ? (stmt.getAsObject()["rating"] as number) : null;

    stmt.free();
    return result;
  }

  /**
   * Provide options for autocomplete (partial) queries
   * @param partialQuery
   */
  getSectionStrings(partialQuery: string): string[] {
    if (partialQuery === "") return [];

    const strings: string[] = [];

    const stmt = this.db.prepare(
      `SELECT string FROM autocomplete_strings WHERE ${createWhereString(
        partialQuery
      )} ORDER BY priority`
    );

    while (stmt.step()) {
      strings.push(stmt.get()[0] as string);
    }

    return strings;
  }
}
