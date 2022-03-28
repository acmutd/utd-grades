import {
  abbreviateSemesterName,
  BASE_QUERY,
  parseSearchString,
  rowToGrades,
} from './utils';
import { Grades } from 'utd-grades-models';
import { SearchQuery } from '../types';
import { Database } from 'sql.js';

function createWhereString(
  ...args: [
    column: string | undefined,
    clause: string,
    modifier?: (s: string) => string
  ][]
): [where: string, whereParams: string[]] {
  let where = '';
  const whereParams: string[] = [];

  for (const [column, clause, modifier] of args) {
    if (column != null) {
      if (where === '') {
        where += 'WHERE ';
      } else {
        where += 'AND ';
      }

      where += `${clause}\n`;
      whereParams.push(`${modifier ? modifier(column) : column}`);
    }
  }

  return [where, whereParams];
}

export default async function getSections(
  params: SearchQuery,
  db: Database
): Promise<Grades[]> {
  const parsed = parseSearchString(params);
  if (!parsed) {
    return [];
  }

  const {
    sectionNumber,
    firstName,
    lastName,
    courseNumber,
    coursePrefix,
    year,
    type,
    sortField = 'number',
    sortDirection = 'ASC',
  } = parsed;

  const [where, whereParams] = createWhereString(
    [sectionNumber, 'sectionName = ?', (s) => s.toUpperCase()],
    [firstName, 'professorFirst LIKE ?', (s) => `%${s.trim()}%`], // TODO: other instructors ignored
    [lastName, 'professorLast LIKE ?', (s) => `%${s.trim()}%`],
    [courseNumber, 'catalogNumberName = ?'],
    [coursePrefix, 'subjectName = ?', (s) => s.toUpperCase()],
    [year, 'semesterName LIKE ?', (s) => `%${s.trim()[2] + s.trim()[3]}%`], // TODO: bad
    [type, 'semesterName LIKE ?', (s) => `%${abbreviateSemesterName(s)}%`]
  );

  // TODO: ordering

  const grades: Grades[] = [];

  const query = BASE_QUERY + '\n' + where;
  const stmt = db.prepare(query);
  stmt.bind(whereParams);
  while (stmt.step()) {
    grades.push(rowToGrades(stmt.getAsObject())!);
  }
  stmt.free();

  return grades;
}
