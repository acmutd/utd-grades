import * as csv from 'csv-parse/sync';
import * as path from 'path';
import * as fs from 'fs/promises';
import initSqlJs, { Database } from "sql.js/dist/sql-wasm"
import type { CatalogNumber, Grades, Professor, Section, Semester, Subject } from 'utd-grades-models';

function gradesRow(csvRow: Record<string, any>, semester: Semester, profs: Map<string, Professor>, subjects: Map<string, Subject>, catalogNumbers: Map<string, CatalogNumber>, sections: Map<string, Section>): Grades {
  function parseNum(s?: string): number {
    if (s) return parseInt(s, 10);
    return 0;
  }

  return {
    semester: semester,
    subject: subjects.get(csvRow["Subject"])!,
    catalogNumber: catalogNumbers.get(csvRow["Catalog Number"] ?? csvRow["Catalog Nbr"])!,
    section: sections.get(csvRow["Section"])!,
    aPlus: parseNum(csvRow["A+"]),
    a: parseNum(csvRow["A"]),
    aMinus: parseNum(csvRow["A-"]),
    bPlus: parseNum(csvRow["B+"]),
    b: parseNum(csvRow["B"]),
    bMinus: parseNum(csvRow["B-"]),
    cPlus: parseNum(csvRow["C+"]),
    c: parseNum(csvRow["C"]),
    cMinus: parseNum(csvRow["C-"]),
    dPlus: parseNum(csvRow["D+"]),
    d: parseNum(csvRow["D"]),
    dMinus: parseNum(csvRow["D-"]),
    f: parseNum(csvRow["F"]),
    cr: parseNum(csvRow["CR"]),
    nc: parseNum(csvRow["NC"]),
    p: parseNum(csvRow["P"]),
    w: parseNum(csvRow["W"] ?? csvRow["Total W"]),
    i: parseNum(csvRow["I"]),
    nf: parseNum(csvRow["NF"]),
    instructor1: profs.get(csvRow["Instructor 1"])!,
    instructor2: profs.get(csvRow["Instructor 2"])!,
    instructor3: profs.get(csvRow["Instructor 3"])!,
    instructor4: profs.get(csvRow["Instructor 4"])!,
    instructor5: profs.get(csvRow["Instructor 5"])!,
    instructor6: profs.get(csvRow["Instructor 6"])!,
  }
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

  function add<T extends { id?: number, name: string }>(map: Map<string, T>, value: T) {
    if (value.name && !map.has(value.name)) {
      map.set(value.name, value);
    }
  }

  function addProf(name?: string) {
    if (name && !profs.has(name)) {
      const parts = name.split(",");

      profs.set(name, {
        first: parts[1]?.trim() ?? null,
        last: parts[0]!.trim(),
      })
    }
  }

  let grades: Grades[] = [];

  for (const fileName of await fs.readdir(dataDir)) {
    const semester = { name: path.parse(fileName).name };
    add(semesters, semester);

    for (const csvRow of await parseCsv(path.join(dataDir, fileName))) {
      addProf(csvRow["Instructor 1"]);
      addProf(csvRow["Instructor 2"]);
      addProf(csvRow["Instructor 3"]);
      addProf(csvRow["Instructor 4"]);
      addProf(csvRow["Instructor 5"]);
      addProf(csvRow["Instructor 6"]);

      add(subjects, { name: csvRow["Subject"] });
      add(catalogNumbers, { name: csvRow["Catalog Number"] ?? csvRow["Catalog Nbr"] });
      add(sections, { name: csvRow["Section"] });

      grades.push(gradesRow(csvRow, semester, profs, subjects, catalogNumbers, sections))
    }
  }

  return [profs, semesters, subjects, catalogNumbers, sections, grades];
}

async function insertMap<T extends { id?: number, name: string }>(db: Database, table: string, map: Map<string, T>) {
  const stmt = db.prepare(`INSERT INTO ${table}(id, name) VALUES (NULL, ?) RETURNING id`);
  for (const x of map.values()) {
    x.id = stmt.getAsObject([x.name])['id'] as number;
  }
  stmt.free();
}

async function insertProfMap<T extends { id?: number, first: string | null, last: string }>(db: Database, table: string, map: Map<string, T>) {
  const stmt = db.prepare(`INSERT INTO ${table}(id, first, last) VALUES (NULL, ?, ?) RETURNING Id`);
  for (const x of map.values()) {
    x.id = stmt.getAsObject([x.first, x.last])['id'] as number;
  }
  stmt.free();
}

async function createDb(): Promise<Uint8Array> {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  const initScript = await fs.readFile("src/create_db.sql");
  db.run(initScript.toString());

  const [profs, semesters, subjects, catalogNumbers, sections, allGrades] = await parseDataDir("../data/raw");

  db.exec("BEGIN");

  await insertProfMap(db, "professor", profs);
  await insertMap(db, "semester", semesters);
  await insertMap(db, "subject", subjects);
  await insertMap(db, "catalog_number", catalogNumbers);
  await insertMap(db, "section", sections);

  const stmt = db.prepare(`
    INSERT INTO grades(id, aPlus, a, aMinus, bPlus, b, bMinus, cPlus, c, cMinus, dPlus, d, dMinus, f, cr, nc, p, w, i, nf, semesterId, subjectId, catalogNumberId, sectionId, instructor1Id, instructor2Id, instructor3Id, instructor4Id, instructor5Id, instructor6Id)
    VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  for (const grades of allGrades) {
    grades.id = stmt.getAsObject([
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
      grades.semester.id!,
      grades.subject.id!,
      grades.catalogNumber.id!,
      grades.section.id!,
      grades.instructor1?.id ?? null,
      grades.instructor2?.id ?? null,
      grades.instructor3?.id ?? null,
      grades.instructor4?.id ?? null,
      grades.instructor5?.id ?? null,
      grades.instructor6?.id ?? null,
    ])['id'] as number;
  }

  stmt.free();

  db.exec("COMMIT");

  const data = db.export();
  db.close();

  return data;
}

async function main() {
  const data = await createDb();
  await fs.writeFile("../data/utdgrades.sqlite3", Buffer.from(data));
}

main()
