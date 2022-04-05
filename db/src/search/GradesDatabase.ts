import type { Database } from "sql.js";
import type { Grades } from "../types/Grades";
import { createWhereString, rowToGrades, SEASONS } from "./utils";

export class GradesDatabase {
  protected db: Database;

  constructor(db: Database) {
    this.db = db;
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

  /**
   * Provide options for autocomplete (partial) queries
   * @param partialQuery
   */
  getSectionStrings(partialQuery: string): string[] {
    if (partialQuery === "") return [];

    const strings: string[] = [];

    const stmt = this.db.prepare(
      `SELECT string FROM autocomplete_strings WHERE ${createWhereString(partialQuery)} ORDER BY priority`
    );

    while (stmt.step()) {
      strings.push(stmt.get()[0] as string);
    }

    return strings;
  }
}
