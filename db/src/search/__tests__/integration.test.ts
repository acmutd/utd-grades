import * as fs from "fs/promises";
import initSqlJs from "sql.js/dist/sql-wasm";
import { GradesDatabase } from "../GradesDatabase";

let db: GradesDatabase;

async function initCon() {
  if (!db) {
    const SQL = await initSqlJs();
    db = new GradesDatabase(
      new SQL.Database(new Uint8Array(await fs.readFile("utdgrades.sqlite3")))
    );
  }
}

beforeAll(async () => {
  await initCon();
});

describe("Test sample queries", () => {
  test("Should search by course prefix and number", () => {
    const queries = [
      {
        search: "CS 1337",
        expected: { coursePrefix: "CS", courseNumber: "1337" },
      },
      {
        search: "BCOM 3310",
        expected: { coursePrefix: "BCOM", courseNumber: "3310" },
      },
      {
        search: "HIST 1301",
        expected: { coursePrefix: "HIST", courseNumber: "1301" },
      },
    ];

    for (const { search, expected } of queries) {
      const response = db.getSectionsBySearch(search)[0];
      if (!response) throw new Error("response was empty");

      expect(response.catalogNumber).toEqual(expected.courseNumber);
      expect(response.subject).toEqual(expected.coursePrefix);
    }
  });

  test("Should handle lowercase course prefixes", () => {
    const queries = [
      {
        search: "cs 1337",
        expected: { coursePrefix: "CS", courseNumber: "1337" },
      },
      {
        search: "bcom 3310",
        expected: { coursePrefix: "BCOM", courseNumber: "3310" },
      },
      {
        search: "hist 1301",
        expected: { coursePrefix: "HIST", courseNumber: "1301" },
      },
    ];

    for (const { search, expected } of queries) {
      const response = db.getSectionsBySearch(search)[0];
      if (!response) throw new Error("response was empty");

      expect(response.catalogNumber).toEqual(expected.courseNumber);
      expect(response.subject).toEqual(expected.coursePrefix);
    }
  });

  test("Should handle section numbers", () => {
    const queries = [
      {
        search: "CS 1337.001",
        expected: {
          coursePrefix: "CS",
          courseNumber: "1337",
          sectionNumber: "1",
        },
      },
      {
        search: "CS 1337.0U1",
        expected: {
          coursePrefix: "CS",
          courseNumber: "1337",
          sectionNumber: "0U1",
        },
      },
      {
        search: "BCOM 3310.HON",
        expected: {
          coursePrefix: "BCOM",
          courseNumber: "3310",
          sectionNumber: "HON",
        },
      },
    ];

    for (const { search, expected } of queries) {
      const response = db.getSectionsBySearch(search)[0];
      if (!response) throw new Error("response was empty");

      expect(response.catalogNumber).toEqual(expected.courseNumber);
      expect(response.subject).toEqual(expected.coursePrefix);
      expect(response.section.includes(expected.sectionNumber)).toBeTruthy();
    }
  });

  test("Should handle semesters", () => {
    const queries = [
      {
        search: "CS 1337 fall 2019",
        expected: {
          coursePrefix: "CS",
          courseNumber: "1337",
          semester: {
            season: "Fall",
            year: 2019,
          },
        },
      },
      {
        search: "BCOM 3310 Summer 2019",
        expected: {
          coursePrefix: "BCOM",
          courseNumber: "3310",
          semester: {
            season: "Summer",
            year: 2019,
          },
        },
      },
      {
        search: "HIST 1301 Spring 2018",
        expected: {
          coursePrefix: "HIST",
          courseNumber: "1301",
          semester: {
            season: "Spring",
            year: 2018,
          },
        },
      },
    ];

    for (const { search, expected } of queries) {
      const response = db.getSectionsBySearch(search)[0];
      if (!response) throw new Error("response was empty");

      expect(response.catalogNumber).toEqual(expected.courseNumber);
      expect(response.subject).toEqual(expected.coursePrefix);
      expect(response.semester).toEqual(expected.semester);
    }
  });

  test("Should handle professor names", () => {
    const queries = [
      {
        search: "CS 1337 Jason Smith",
        expected: {
          coursePrefix: "CS",
          courseNumber: "1337",
          professorFirstName: "Jason W",
          professorLastName: "Smith",
        },
      },
      {
        search: "CS 1337 jason smith",
        expected: {
          coursePrefix: "CS",
          courseNumber: "1337",
          professorFirstName: "Jason W",
          professorLastName: "Smith",
        },
      },
      {
        search: "CS 1337 Cole",
        expected: {
          coursePrefix: "CS",
          courseNumber: "1337",
          professorFirstName: "John",
          professorLastName: "Cole",
        },
      },
      {
        search: "CS 1337 cole",
        expected: {
          coursePrefix: "CS",
          courseNumber: "1337",
          professorFirstName: "John",
          professorLastName: "Cole",
        },
      },
    ];

    for (const { search, expected } of queries) {
      const response = db.getSectionsBySearch(search)[0];
      if (!response) throw new Error("response was empty");

      expect(response.catalogNumber).toEqual(expected.courseNumber);
      expect(response.subject).toEqual(expected.coursePrefix);
      expect(response.instructor1?.first).toEqual(expected.professorFirstName);
      expect(response.instructor1?.last).toEqual(expected.professorLastName);
    }
  });

  test("Should handle professor-only", () => {
    const queries = [
      {
        search: "Stephen Perkins",
        expected: {
          professorFirstName: "Stephen J",
          professorLastName: "Perkins",
        },
      },
      {
        search: "Kristen Lawson",
        expected: {
          professorFirstName: "Kristen A",
          professorLastName: "Lawson",
        },
      },
    ];

    for (const { search, expected } of queries) {
      const response = db.getSectionsBySearch(search)[0];
      if (!response) throw new Error("response was empty");

      expect(response.instructor1?.first).toEqual(expected.professorFirstName);
      expect(response.instructor1?.last).toEqual(expected.professorLastName);
    }
  });

  test("Should handle everything together", () => {
    const queries = [
      {
        search: "CS 1337.502 fall 2019 Stephen Perkins",
        expected: {
          coursePrefix: "CS",
          courseNumber: "1337",
          sectionNumber: "501",
          semester: {
            season: "Fall",
            year: 2019,
          },
          professorFirstName: "Stephen J",
          professorLastName: "Perkins",
        },
      },
      {
        search: "BCOM 3310.HON Fall 2019 Kristen Lawson",
        expected: {
          coursePrefix: "BCOM",
          courseNumber: "3310",
          sectionNumber: "HON",
          semester: {
            season: "Fall",
            year: 2019,
          },
          professorFirstName: "Kristen A",
          professorLastName: "Lawson",
        },
      },
    ];

    for (const { search, expected } of queries) {
      const response = db.getSectionsBySearch(search)[0];
      if (!response) throw new Error("response was empty");

      expect(response.catalogNumber).toEqual(expected.courseNumber);
      expect(response.subject).toEqual(expected.coursePrefix);
      expect(response.semester).toEqual(expected.semester);
      expect(response.instructor1?.first).toEqual(expected.professorFirstName);
      expect(response.instructor1?.last).toEqual(expected.professorLastName);
    }
  });
});

afterAll(() => {
  db.close();
});
