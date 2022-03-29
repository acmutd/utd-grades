import { ParamsObject } from 'sql.js';
import { Grades } from 'utd-grades-models';
import { splitName } from '../components/utils';
import { ParsedSearchQuery, SearchQuery } from '../types';

function isParsedSearchQuery(query: SearchQuery): query is ParsedSearchQuery {
  return !('search' in query);
}

export function parseSearchString(
  query?: SearchQuery
): ParsedSearchQuery | undefined {
  if (!query || isParsedSearchQuery(query)) {
    return query;
  }

  const prefixPattern =
    /(?<!\w)(?!summer|spring|fall)([a-zA-Z]{2,4})(?=(\s|\d+))/; // FIXME: this causes searches for 2-4 letter long names to not work
  const numberPattern =
    /(?:(?<!fall\s)|(?<!fall)|(?<!spring\s)|(?<!spring)|(?<!summer\s)|(?<!summer))(\d{4})/;
  const yearPattern =
    /(?:(?<=fall\s)|(?<=fall)|(?<=spring\s)|(?<=spring)|(?<=summer\s)|(?<=summer))(\d{4})/;
  const semesterPattern = /(fall|spring|summer)(?=\d{4}|\s\d{4})/;
  const sectionPattern =
    /(?:(?<=\d{4})|(?<=\d{4}\s)|(?<=\.))(\d{1,3}|\w{1,3})(?=\s|$)/;

  const searchString = query.search.toLowerCase();

  const prefixMatch = searchString.match(prefixPattern);
  const numberMatch = searchString.match(numberPattern);
  const yearMatch = searchString.match(yearPattern);
  const semesterMatch = searchString.match(semesterPattern);
  const sectionMatch = searchString.match(sectionPattern);

  let prefix: string | undefined;
  let number: string | undefined;
  let year: string | undefined;
  let semester: string | undefined;
  let section: string | undefined;
  let professor = searchString;

  if (prefixMatch) {
    prefix = prefixMatch[0];
    professor = professor.replace(prefix, '');
  }

  if (numberMatch) {
    number = numberMatch[0];
    professor = professor.replace(number, '');
  }

  if (yearMatch) {
    year = yearMatch[0];
    professor = professor.replace(year, '');
  }

  if (semesterMatch) {
    semester = semesterMatch[0];
    professor = professor.replace(semester, '');
  }

  if (sectionMatch) {
    section = sectionMatch[0];
    professor = professor.replace(section, '');
  }

  professor = professor.replace('.', '').trim();

  let firstName: string | undefined;
  let lastName: string | undefined;

  if (professor) {
    if (professor.includes(',')) {
      let names = professor.split(',');

      firstName = names[1].trim();
      lastName = names[0].trim();
    } else if (professor.includes(' ')) {
      let names = professor.split(' ');

      firstName = names[0].trim();
      lastName = names[1].trim();
    } else {
      lastName = professor;
    }
  }

  return {
    coursePrefix: prefix,
    courseNumber: number,
    year: year,
    type: semester,
    sectionNumber: section,
    firstName: firstName,
    lastName: lastName,
    ...query,
  };
}

export function abbreviateSemesterName(name: string) {
  name = name.trim().toLowerCase();
  if (name === 'summer') {
    return 'su';
  } else if (name === 'spring') {
    return 's';
  } else if (name === 'fall') {
    return 'f';
  }
  return null;
}

export function expandSemesterNames(grades: Grades[]): Grades[] {
  // can't be null in this case because input isn't null
  return grades.map((g) => expandSemesterName(g)!);
}

export function expandSemesterName(grades: Grades | null): Grades | null {
  if (!grades) return grades;

  let s = grades.semester;

  if (s.startsWith('su')) {
    s = `Summer 20${s.substring(2)}`;
  } else if (s.startsWith('s')) {
    s = `Spring 20${s.substring(1)}`;
  } else if (s.startsWith('f')) {
    s = `Fall 20${s.substring(1)}`;
  }

  grades.semester = s;

  return grades;
}

export function rowToGrades(row: ParamsObject): Grades | null {
  if (row.gradesId === undefined) return null;

  const [instructor1First, instructor1Last] = splitName(row.instructor1 as string); // FIXME (no professor)

  return {
    id: row.gradesId as number,
    semester: row.semester as string,
    subject: row.subject as string,
    catalogNumber: row.catalogNumber as string,
    section: row.section as string,
    aPlus: row.aPlus as number,
    a: row.a as number,
    aMinus: row.aMinus as number,
    bPlus: row.bPlus as number,
    b: row.b as number,
    bMinus: row.bMinus as number,
    cPlus: row.cPlus as number,
    c: row.c as number,
    cMinus: row.cMinus as number,
    dPlus: row.dPlus as number,
    d: row.d as number,
    dMinus: row.dMinus as number,
    f: row.f as number,
    cr: row.cr as number,
    nc: row.nc as number,
    p: row.p as number,
    w: row.w as number,
    i: row.i as number,
    nf: row.nf as number,
    instructor1: {
      first: instructor1First,
      last: instructor1Last,
    },
    // TODO (more professors)
    instructor2: null,
    instructor3: null,
    instructor4: null,
    instructor5: null,
    instructor6: null,
  };
}

export const BASE_QUERY = `SELECT grades.id AS gradesId,
        grades.aPlus,
        grades.a,
        grades.aMinus,
        grades.bPlus,
        grades.b,
        grades.bMinus,
        grades.cPlus,
        grades.c,
        grades.cMinus,
        grades.dPlus,
        grades.d,
        grades.dMinus,
        grades.f,
        grades.cr,
        grades.nc,
        grades.p,
        grades.w,
        grades.i,
        grades.nf,
        semester.string AS semester,
        subject.string AS subject,
        catalogNumber.string AS catalogNumber,
        section.string AS section,
        instructor1.string AS instructor1
FROM grades
         INNER JOIN strings semester ON semester.id = grades.semesterId
         INNER JOIN strings subject ON subject.id = grades.subjectId
         INNER JOIN strings catalogNumber ON catalogNumber.id = grades.catalogNumberId
         INNER JOIN strings section ON section.id = grades.sectionId
         INNER JOIN strings instructor1 ON instructor1.id = grades.instructor1Id
         `;
