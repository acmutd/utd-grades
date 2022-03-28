import { Database } from 'sql.js';
import { Grades } from 'utd-grades-models';
import { BASE_QUERY, rowToGrades } from './utils';

export default async function getSectionById(
  id: number,
  db: Database
): Promise<Grades | null> {
  const stmt = db.prepare(BASE_QUERY + '\nWHERE gradesId = ?');
  const grades = rowToGrades(stmt.getAsObject([id]));

  stmt.free();

  return grades;
}
