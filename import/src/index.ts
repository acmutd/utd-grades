import * as csv from 'csv-parse/sync';
import * as path from 'path';
import * as fs from 'fs';
import { createConnection, EntityManager, EntityTarget, getConnection } from "typeorm";
import { CatalogNumber, Grades, Professor, Section, Semester, Subject } from 'utd-grades-models';

function gradesRow(csvRow: Record<string, any>, semester: Semester, profs: Map<string, Professor>, subjects: Map<string, Subject>, catalogNumbers: Map<string, CatalogNumber>, sections: Map<string, Section>): Grades {
  function parseNum(s?: string): number {
    if (s) return parseInt(s, 10);
    return 0;
  }

  const grades = new Grades();
  grades.semester = semester;
  grades.subject = subjects.get(csvRow["Subject"])!;
  grades.catalogNumber = catalogNumbers.get(csvRow["Catalog Number"] ?? csvRow["Catalog Nbr"])!;
  grades.section = sections.get(csvRow["Section"])!;
  grades.aPlus = parseNum(csvRow["A+"]);
  grades.a = parseNum(csvRow["A"]);
  grades.aMinus = parseNum(csvRow["A-"]);
  grades.bPlus = parseNum(csvRow["B+"]);
  grades.b = parseNum(csvRow["B"]);
  grades.bMinus = parseNum(csvRow["B-"]);
  grades.cPlus = parseNum(csvRow["C+"]);
  grades.c = parseNum(csvRow["C"]);
  grades.cMinus = parseNum(csvRow["C-"]);
  grades.dPlus = parseNum(csvRow["D+"]);
  grades.d = parseNum(csvRow["D"]);
  grades.dMinus = parseNum(csvRow["D-"]);
  grades.f = parseNum(csvRow["F"]);
  grades.cr = parseNum(csvRow["CR"]);
  grades.nc = parseNum(csvRow["NC"]);
  grades.p = parseNum(csvRow["P"]);
  grades.w = parseNum(csvRow["W"] ?? csvRow["Total W"]);
  grades.i = parseNum(csvRow["I"]);
  grades.nf = parseNum(csvRow["NF"]);
  grades.instructor1 = profs.get(csvRow["Instructor 1"])!;
  grades.instructor2 = profs.get(csvRow["Instructor 2"])!;
  grades.instructor3 = profs.get(csvRow["Instructor 3"])!;
  grades.instructor4 = profs.get(csvRow["Instructor 4"])!;
  grades.instructor5 = profs.get(csvRow["Instructor 5"])!;
  grades.instructor6 = profs.get(csvRow["Instructor 6"])!;
  return grades;
}

function parseCsv(filePath: string): Record<string, any>[] {
  console.log(filePath);
  const fileContents = fs.readFileSync(filePath);
  return csv.parse(fileContents, {
    columns: true, // detect column names from header
  });
}

function parseDataDir(dataDir: string): [Map<string, Professor>, Map<string, Semester>, Map<string, Subject>, Map<string, CatalogNumber>, Map<string, Section>, Grades[]] {
  let profs = new Map<string, Professor>();
  let semesters = new Map<string, Semester>();
  let subjects = new Map<string, Subject>();
  let catalogNumbers = new Map<string, CatalogNumber>();
  let sections = new Map<string, Section>();

  function add<T extends { id: number, name: string }>(map: Map<string, T>, value: T) {
    if (value.name && !map.has(value.name)) {
      map.set(value.name, value);
    }
  }

  let grades: Grades[] = [];

  for (const fileName of fs.readdirSync(dataDir)) {
    const semester = new Semester(path.parse(fileName).name)
    add(semesters, semester);

    for (const csvRow of parseCsv(path.join(dataDir, fileName))) {
      add(profs, new Professor(csvRow["Instructor 1"]));
      add(profs, new Professor(csvRow["Instructor 2"]));
      add(profs, new Professor(csvRow["Instructor 3"]));
      add(profs, new Professor(csvRow["Instructor 4"]));
      add(profs, new Professor(csvRow["Instructor 5"]));
      add(profs, new Professor(csvRow["Instructor 6"]));

      add(subjects, new Subject(csvRow["Subject"]));
      add(catalogNumbers, new CatalogNumber(csvRow["Catalog Number"] ?? csvRow["Catalog Nbr"]));
      add(sections, new Section(csvRow["Section"]));

      grades.push(gradesRow(csvRow, semester, profs, subjects, catalogNumbers, sections))
    }
  }

  return [profs, semesters, subjects, catalogNumbers, sections, grades];
}

async function insertMap<T>(manager: EntityManager, target: EntityTarget<T>, map: Map<string, T>) {
  for (const x of map.values()) {
    await manager.insert(target, x);
  }
}

async function createDb() {
  await createConnection({
    name: "default",
    type: "postgres",
    host: "localhost",
    username: "postgres",
    database: "utdgrades",
    synchronize: true,
    entities: [CatalogNumber, Grades, Professor, Section, Semester, Subject],
  });

  const [profs, semesters, subjects, catalogNumbers, sections, allGrades] = parseDataDir("../data");

  await getConnection().transaction(async manager => {
    // insert() each separately instead of just save()ing everything in allGrades for super speed boost
    await insertMap(manager, Professor, profs);
    await insertMap(manager, Semester, semesters);
    await insertMap(manager, Subject, subjects);
    await insertMap(manager, CatalogNumber, catalogNumbers);
    await insertMap(manager, Section, sections);

    for (const grades of allGrades) {
      await manager.insert(Grades, grades);
    }
  });

  await getConnection("default").close();
}

createDb();
