import type { ParamsObject } from "sql.js";
import { rowToGrades } from "../utils";

/**
 * Builds a minimal but valid grades_populated row, with all grade-count columns defaulting
 * to 0. Pass only the columns relevant to the test in `overrides`.
 */
function buildRow(overrides: Partial<ParamsObject> = {}): ParamsObject {
  return {
    gradesId: 1,
    semester: "Fall 2020",
    subject: "CS",
    catalogNumber: "1337",
    courseName: null,
    section: "001",
    instructor1: "John Smith",
    aPlus: 0,
    a: 0,
    aMinus: 0,
    bPlus: 0,
    b: 0,
    bMinus: 0,
    cPlus: 0,
    c: 0,
    cMinus: 0,
    dPlus: 0,
    d: 0,
    dMinus: 0,
    f: 0,
    cr: 0,
    nc: 0,
    p: 0,
    w: 0,
    i: 0,
    nf: 0,
    ...overrides,
  };
}

describe("mean and median grade calculation", () => {
  test("computes mean GPA and median letter grade for a normal mixed distribution", () => {
    const grades = rowToGrades(buildRow({ a: 10, b: 5 }));

    // 10 A's (4.0) + 5 B's (3.0), over 15 graded students
    expect(grades!.stats.mean).toBeCloseTo((10 * 4.0 + 5 * 3.0) / 15, 4);
    // sorted ascending: positions 1-5 are B, positions 6-15 are A; target = ceil(15/2) = 8th -> A
    expect(grades!.stats.median).toBe("A");
  });

  test("treats F as 0.0 grade points, not a non-graded outcome", () => {
    const grades = rowToGrades(buildRow({ f: 20 }));

    expect(grades!.stats.mean).toBe(0.0);
    expect(grades!.stats.median).toBe("F");
  });

  test("returns null mean and median when there are no graded students", () => {
    const grades = rowToGrades(buildRow({ p: 5, w: 3, i: 2 }));

    expect(grades!.stats.mean).toBeNull();
    expect(grades!.stats.median).toBeNull();
  });

  test("resolves an even split tied across two grades to the lower grade", () => {
    // 2 B+ and 2 A-: sorted ascending, positions 1-2 are B+, positions 3-4 are A-.
    // target = ceil(4/2) = 2nd position, which falls in the lower bucket (B+).
    const grades = rowToGrades(buildRow({ bPlus: 2, aMinus: 2 }));

    expect(grades!.stats.median).toBe("B+");
    expect(grades!.stats.mean).toBeCloseTo((2 * 3.33 + 2 * 3.67) / 4, 4);
  });

  test("picks the unambiguous middle bucket for an odd graded count", () => {
    // 1 B, 1 B+, 1 A-: sorted ascending B, B+, A-. target = ceil(3/2) = 2nd position -> B+.
    const grades = rowToGrades(buildRow({ b: 1, bPlus: 1, aMinus: 1 }));

    expect(grades!.stats.median).toBe("B+");
    expect(grades!.stats.mean).toBeCloseTo((3.0 + 3.33 + 3.67) / 3, 4);
  });
});
