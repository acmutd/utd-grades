import { rowToGrades } from './utils';
import { Grades } from 'utd-grades-models';
import { SearchQuery } from '../types';
import { Database } from 'sql.js';

function createWhereString(search: string): string {
  return search
    .split(' ')
    .map((s) => `string LIKE '%${s}%'`)
    .join(' AND ');
}

export default async function getSections(
  params: SearchQuery,
  db: Database
): Promise<Grades[]> {
  // TODO: ordering

  const grades: Grades[] = [];

  const query = `
  SELECT gradesId, * from grades_populated WHERE gradesId IN
    (SELECT id FROM grades_strings WHERE ${createWhereString(params.search)})
  `;
  const stmt = db.prepare(query);
  while (stmt.step()) {
    grades.push(rowToGrades(stmt.getAsObject())!);
  }
  stmt.free();

  return grades;
}
