import { Database } from 'sql.js';
import { Grades } from 'utd-grades-models';
import { rowToGrades } from './utils';

export default async function getSectionById(
  id: number,
  db: Database
): Promise<Grades | null> {
  const stmt = db.prepare(
    'SELECT * FROM grades_populated WHERE gradesId = ? LIMIT 1'
  );
  const grades = rowToGrades(stmt.getAsObject([id]));

  stmt.free();

  return grades;
}
