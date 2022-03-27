import * as csv from 'csv-parse/sync';
import * as path from 'path';
import * as fs from 'fs/promises';
import { DataSource, EntityManager, EntityTarget } from "typeorm";
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

async function parseCsv(filePath: string): Promise<Record<string, any>[]> {
  console.log(filePath);
  const fileContents = await fs.readFile(filePath);
  return csv.parse(fileContents, {
    columns: true, // detect column names from header
  });
}

async function parseDataDir(dataDir: string): Promise<[Map<string, Professor>, Map<string, Semester>, Map<string, Subject>, Map<string, CatalogNumber>, Map<string, Section>, Grades[]]> {
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

  function addProf(name?: string) {
    if (name && !profs.has(name)) {
      const parts = name.split(",");

      let first = parts[1];
      if (first) first = first.trim();

      let last = parts[0]!.trim();

      // TODO non-null assertion is wrong, but I can't define Professor.first as string | null without typeorm yelling at me 
      profs.set(name, new Professor(first!, last));
    }
  }

  let grades: Grades[] = [];

  for (const fileName of await fs.readdir(dataDir)) {
    const semester = new Semester(path.parse(fileName).name)
    add(semesters, semester);

    for (const csvRow of await parseCsv(path.join(dataDir, fileName))) {
      addProf(csvRow["Instructor 1"]);
      addProf(csvRow["Instructor 2"]);
      addProf(csvRow["Instructor 3"]);
      addProf(csvRow["Instructor 4"]);
      addProf(csvRow["Instructor 5"]);
      addProf(csvRow["Instructor 6"]);

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

async function createDb(): Promise<Uint8Array> {
  const con = new DataSource({
    type: "sqljs",
    synchronize: true,
    entities: [CatalogNumber, Grades, Professor, Section, Semester, Subject],
  });

  await con.initialize();

  const [profs, semesters, subjects, catalogNumbers, sections, allGrades] = await parseDataDir("../data/raw");

  await con.transaction(async manager => {
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

  // @ts-ignore SqljsDriver isn't exported from typeorm, but it's here: https://github.com/typeorm/typeorm/blob/68a5c230776f6ad4e3ee7adea5ad4ecdce033c7e/src/driver/sqljs/SqljsDriver.ts
  const data: Uint8Array = (con.driver as SqljsDriver).export();

  await con.destroy();

  return data;
}

async function main() {
  const data = await createDb();
  await fs.writeFile("../data/utdgrades.sqlite3", Buffer.from(data));
}

main()
