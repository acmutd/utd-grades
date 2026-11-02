import { GPA_POINTS, LETTER_GRADES } from "@utd-grades/db";
import type { Grades, GradesDatabase, LetterGrade, Semester } from "@utd-grades/db";
import { compareSectionRecency, isSameCourse, isUpcomingSection } from "./index";

export interface ProfessorCourseStats {
  key: string;
  name: string;
  /** This professor's sections of the course next semester. */
  upcomingSectionIds: number[];
  /** This professor's graded sections of the course, newest first. */
  pastSections: Grades[];
  totalStudents: number;
  mean: number | null;
  median: LetterGrade | null;
}

export interface CourseProfessors {
  key: string;
  subject: string;
  catalogNumber: string;
  courseName: string | null;
  /** Best mean GPA first; professors who've never taught the course last. */
  professors: ProfessorCourseStats[];
}

export interface NextSemesterInfo {
  semester: Semester;
  courses: CourseProfessors[];
  /** Whether this section's professor teaches the same course next semester. */
  teachesNextSemester: (section: Grades) => boolean;
}

function courseKey(section: Pick<Grades, "subject" | "catalogNumber">): string {
  return `${section.subject} ${section.catalogNumber}`;
}

// Older data files have no NetIDs and spell first names inconsistently ("Jason W" vs "Jason"),
// so name matching uses the last name plus the first word of the first name.
function nameKey(section: Grades): string | null {
  const instructor = section.instructor1;
  if (!instructor?.last) return null;
  const first = (instructor.first ?? "").trim().split(/\s+/)[0] ?? "";
  return `${instructor.last.trim()}|${first}`.toLowerCase();
}

function sameProfessor(a: Grades, b: Grades): boolean {
  if (a.instructor1NetId && b.instructor1NetId) return a.instructor1NetId === b.instructor1NetId;
  const keyA = nameKey(a);
  return keyA !== null && keyA === nameKey(b);
}

function professorName(section: Grades): string {
  const instructor = section.instructor1;
  return instructor ? `${instructor.last}, ${instructor.first ?? ""}`.replace(/, $/, "") : "Staff";
}

function letterGradeCounts(s: Grades): number[] {
  return [s.aPlus, s.a, s.aMinus, s.bPlus, s.b, s.bMinus, s.cPlus, s.c, s.cMinus, s.dPlus, s.d, s.dMinus, s.f];
}

/** Combined mean GPA and median letter grade across sections (same conventions as the per-section stats). */
export function aggregateStats(sections: Grades[]): Pick<ProfessorCourseStats, "totalStudents" | "mean" | "median"> {
  const counts = LETTER_GRADES.map(() => 0);
  let totalStudents = 0;
  for (const section of sections) {
    letterGradeCounts(section).forEach((count, i) => (counts[i] = (counts[i] ?? 0) + count));
    totalStudents += section.totalStudents;
  }

  const graded = counts.reduce((sum, count) => sum + count, 0);
  if (graded === 0) return { totalStudents, mean: null, median: null };

  const points = counts.reduce((sum, count, i) => sum + count * GPA_POINTS[LETTER_GRADES[i]!], 0);

  // Lower median: walk from F up to A+ until half the graded students are covered.
  const target = Math.ceil(graded / 2);
  let cumulative = 0;
  let median: LetterGrade | null = null;
  for (let i = LETTER_GRADES.length - 1; i >= 0; i--) {
    cumulative += counts[i] ?? 0;
    if (cumulative >= target) {
      median = LETTER_GRADES[i]!;
      break;
    }
  }

  return { totalStudents, mean: points / graded, median };
}

export function computeNextSemesterInfo(
  db: GradesDatabase,
  sections: Grades[],
  upcoming: Semester | null
): NextSemesterInfo | null {
  if (!upcoming) return null;

  const coursesInResults = new Map<string, Grades>();
  for (const section of sections) coursesInResults.set(courseKey(section), section);

  const courses: CourseProfessors[] = [];
  const upcomingByCourse = new Map<string, Grades[]>();

  for (const [key, sample] of coursesInResults) {
    // Full history of the course, independent of how narrow the user's search was.
    const history = db
      .getSectionsBySearch(`${sample.subject} ${sample.catalogNumber}`)
      .filter((s) => isSameCourse(s, sample));
    const upcomingSections = history.filter((s) => isUpcomingSection(s, upcoming) && s.instructor1);
    if (upcomingSections.length === 0) continue;
    upcomingByCourse.set(key, upcomingSections);

    const professors: ProfessorCourseStats[] = [];
    const representatives: Grades[] = []; // one upcoming section per professor, parallel to `professors`
    for (const section of upcomingSections) {
      const matchIndex = representatives.findIndex((rep) => sameProfessor(rep, section));
      if (matchIndex !== -1) {
        professors[matchIndex]!.upcomingSectionIds.push(section.id);
        continue;
      }
      representatives.push(section);
      const pastSections = history
        .filter((s) => s.totalStudents > 0 && sameProfessor(s, section))
        .sort(compareSectionRecency);
      professors.push({
        key: `${key}|${section.instructor1NetId ?? nameKey(section) ?? section.id}`,
        name: professorName(section),
        upcomingSectionIds: [section.id],
        pastSections,
        ...aggregateStats(pastSections),
      });
    }

    professors.sort((a, b) => {
      if (a.mean === null && b.mean === null) return a.name.localeCompare(b.name);
      if (a.mean === null) return 1;
      if (b.mean === null) return -1;
      return b.mean - a.mean;
    });

    courses.push({
      key,
      subject: sample.subject,
      catalogNumber: sample.catalogNumber,
      courseName: sample.courseName,
      professors,
    });
  }

  return {
    semester: upcoming,
    courses,
    teachesNextSemester: (section) =>
      upcomingByCourse.get(courseKey(section))?.some((u) => sameProfessor(u, section)) ?? false,
  };
}

/** The section to open when a professor is picked: their latest graded section, else their next-semester section. */
export function professorSectionId(professor: ProfessorCourseStats): number | undefined {
  return professor.pastSections[0]?.id ?? professor.upcomingSectionIds[0];
}
