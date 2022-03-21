import * as csv from 'csv-parse/sync';
import * as path from 'path';
import * as fs from 'fs';
// import Database from 'better-sqlite3';

import { Client } from 'pg';

interface Tables {
  semesters: Map<string, number>,
  profs: Map<string, number>,
  subjects: Map<string, number>,
  catalogNumbers: Map<string, number>,
  sections: Map<string, number>,
  grades: GradesRow[]
}

interface GradesRow {
  semester: number,
  subject: number,
  catalogNumber: number,
  section: number,
  aPlus: number,
  a: number,
  aMinus: number,
  bPlus: number,
  b: number,
  bMinus: number,
  cPlus: number,
  c: number,
  cMinus: number,
  dPlus: number,
  d: number,
  dMinus: number,
  f: number,
  cr: number,
  nc: number,
  p: number,
  w: number,
  i: number,
  nf: number,
  instructor1: number,
  instructor2: number,
  instructor3: number,
  instructor4: number,
  instructor5: number,
  instructor6: number,
}

function gradesRow(semester: string, csvRow: Record<string, any>, profs: Map<string, number>, semesters: Map<string, number>, subjects: Map<string, number>, catalogNumbers: Map<string, number>, sections: Map<string, number>): GradesRow {
  function parseNum(s?: string): number {
    if (s) return parseInt(s, 10);
    return 0;
  }

  return {
    semester: semesters.get(semester)!,
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

function parseCsv(filePath: string): Record<string, any>[] {
  console.log(filePath);
  const fileContents = fs.readFileSync(filePath);
  return csv.parse(fileContents, {
    columns: true, // detect column names from header
  });
}

function parseDataDir(dataDir: string): Tables {
  let profs = new Map<string, number>();
  let semesters = new Map<string, number>();
  let subjects = new Map<string, number>();
  let catalogNumbers = new Map<string, number>();
  let sections = new Map<string, number>();

  function add(map: Map<string, number>, key: string) {
    if (key && !map.has(key)) {
      map.set(key, map.size);
    }
  }

  let grades = [];

  for (const fileName of fs.readdirSync(dataDir)) {
    const semester = path.parse(fileName).name;
    add(semesters, semester);

    for (const csvRow of parseCsv(path.join(dataDir, fileName))) {
      add(profs, csvRow["Instructor 1"]);
      add(profs, csvRow["Instructor 2"]);
      add(profs, csvRow["Instructor 3"]);
      add(profs, csvRow["Instructor 4"]);
      add(profs, csvRow["Instructor 5"]);
      add(profs, csvRow["Instructor 6"]);

      add(subjects, csvRow["Subject"]);
      add(catalogNumbers, csvRow["Catalog Number"] ?? csvRow["Catalog Nbr"]);
      add(sections, csvRow["Section"]);

      grades.push(gradesRow(semester, csvRow, profs, semesters, subjects, catalogNumbers, sections))
    }
  }

  return { semesters, profs, subjects, catalogNumbers, sections, grades };
}

async function insertMap(db: Client, tableName: string, map: Map<string, number>) {
  // const insertSemester = db.prepare("INSERT INTO semesters(id, name) VALUES(?, ?)");
  // db.transaction((semesters) => {
  //   for (const [semester, id] of semesters.entries()) {
  //     insertSemester.run([id, semester]);
  //   }
  // })(semesters);

  console.log(`Inserting ${tableName}...`);

  await db.query("BEGIN");
  for (const [x, id] of map.entries()) {
    await db.query(`INSERT INTO ${tableName}(id, name) VALUES($1, $2)`, [id, x]);
  }
  await db.query("COMMIT");
}

async function createDb() {
  // const db = new Database('utdgrades.db');
  const db = new Client({
    user: "postgres",
    database: "utdgrades",
    host: "localhost",
  });
  await db.connect();

  await db.query(`
CREATE TABLE IF NOT EXISTS semester(
  id   INTEGER PRIMARY KEY,
  name TEXT
)
`);

  await db.query(`
CREATE TABLE IF NOT EXISTS prof(
  id   INTEGER PRIMARY KEY,
  name TEXT
)
`);

  await db.query(`
CREATE TABLE IF NOT EXISTS subject(
  id   INTEGER PRIMARY KEY,
  name TEXT
)
`);

  await db.query(`
CREATE TABLE IF NOT EXISTS catalogNumber(
  id   INTEGER PRIMARY KEY,
  name TEXT
)
`);

  await db.query(`
CREATE TABLE IF NOT EXISTS section(
  id   INTEGER PRIMARY KEY,
  name TEXT
)
`);

  await db.query(`
CREATE TABLE IF NOT EXISTS grades(
  semester        INTEGER NOT NULL,
  subject         INTEGER NOT NULL,
  catalogNumber   INTEGER NOT NULL,
  section         INTEGER NOT NULL,
  aPlus           INTEGER NOT NULL,
  a               INTEGER NOT NULL,
  aMinus          INTEGER NOT NULL,
  bPlus           INTEGER NOT NULL,
  b               INTEGER NOT NULL,
  bMinus          INTEGER NOT NULL,
  cPlus           INTEGER NOT NULL,
  c               INTEGER NOT NULL,
  cMinus          INTEGER NOT NULL,
  dPlus           INTEGER NOT NULL,
  d               INTEGER NOT NULL,
  dMinus          INTEGER NOT NULL,
  f               INTEGER NOT NULL,
  cr              INTEGER NOT NULL,
  nc              INTEGER NOT NULL,
  p               INTEGER NOT NULL,
  w               INTEGER NOT NULL,
  i               INTEGER NOT NULL,
  nf              INTEGER NOT NULL,
  instructor1     INTEGER,
  instructor2     INTEGER,
  instructor3     INTEGER,
  instructor4     INTEGER,
  instructor5     INTEGER,
  instructor6     INTEGER,

  PRIMARY KEY(semester, subject, catalogNumber, section),

  FOREIGN KEY(semester) references semester(id),
  FOREIGN KEY(subject) references subject(id),
  FOREIGN KEY(catalogNumber) references catalogNumber(id),
  FOREIGN KEY(section) references section(id),

  FOREIGN KEY(instructor1) references prof(id),
  FOREIGN KEY(instructor2) references prof(id),
  FOREIGN KEY(instructor3) references prof(id),
  FOREIGN KEY(instructor4) references prof(id),
  FOREIGN KEY(instructor5) references prof(id),
  FOREIGN KEY(instructor6) references prof(id)
);
`);

  const { semesters, profs, subjects, catalogNumbers, sections, grades } = parseDataDir("../data");

  await insertMap(db, "semester", semesters);
  await insertMap(db, "prof", profs);
  await insertMap(db, "subject", subjects);
  await insertMap(db, "catalogNumber", catalogNumbers);
  await insertMap(db, "section", sections);

  await db.query("BEGIN");
  for (const row of grades) {
    await db.query("INSERT INTO grades(semester, subject, catalogNumber, section, aPlus, a, aMinus, bPlus, b, bMinus, cPlus, c, cMinus, dPlus, d, dMinus, f, cr, nc, p, w, i, nf, instructor1, instructor2, instructor3, instructor4, instructor5, instructor6) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29)", Object.values(row));
  }
  await db.query("COMMIT");

  await db.end();
}

createDb();
