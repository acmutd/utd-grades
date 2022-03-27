import { Grades } from 'utd-grades-models';
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

  let s = grades.semester.name;

  if (s.startsWith('su')) {
    s = `Summer 20${s.substring(2)}`;
  } else if (s.startsWith('s')) {
    s = `Spring 20${s.substring(1)}`;
  } else if (s.startsWith('f')) {
    s = `Fall 20${s.substring(1)}`;
  }

  grades.semester.name = s;

  return grades;
}
