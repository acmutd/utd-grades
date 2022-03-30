import { rowToGrades } from './utils';
import { Grades } from 'utd-grades-models';
import { SearchQuery } from '../types';
import { Database } from 'sql.js';

type Season = 'Spring' | 'Summer' | 'Fall';

function parseSeason(s: string): Season {
  if (s !== 'Spring' && s !== 'Summer' && s !== 'Fall') {
    throw new Error(`"${s}" is not a season.`);
  }
  return s;
}

function parseSemester(s: string): [season: Season, year: number] {
  const parts = s.split(' ');
  return [parseSeason(parts[0]), parseInt(parts[1])];
}

const SEASONS: Record<Season, number> = {
  Spring: 0,
  Summer: 1,
  Fall: 2,
};

export function createWhereString(search: string): string {
  return search
    .split(' ')
    .map((s) => `string LIKE '%${s}%'`)
    .join(' AND ');
}

export default async function getSections(
  params: SearchQuery,
  db: Database
): Promise<Grades[]> {
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

  // TODO: it would *probably* be better to do this sorting at the db level, but the sorting function isn't super straightforward and I don't know how to benchmark it anyway
  return grades.sort((a, b) => {
    const [seasonA, yearA] = parseSemester(a.semester);
    const [seasonB, yearB] = parseSemester(b.semester);

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
