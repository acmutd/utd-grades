// Collapsible sidebar list of next semester's professors for the searched course(s), with each professor's
// combined past grades in that course.
import { DownOutlined, TeamOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import {
  professorSectionId,
  type CourseProfessors,
  type NextSemesterInfo,
  type ProfessorCourseStats,
} from "../utils/nextSemester";
import GradeDot from "./GradeDot";

interface NextSemesterProfessorsProps {
  info: NextSemesterInfo;
  onSelect: (sectionId: number) => void;
}

const formatMean = (mean: number | null) => (mean === null ? "—" : mean.toFixed(2));

function CourseHeading({ course }: { course: CourseProfessors }) {
  return (
    <p className="mb-1 mt-2 font-gilroy-bold text-[13px] text-fg first:mt-0">
      {course.subject} {course.catalogNumber}
      {course.courseName ? <span className="font-gilroy-regular text-muted"> · {course.courseName}</span> : null}
    </p>
  );
}

function ProfessorRow({ p, onSelect }: { p: ProfessorCourseStats; onSelect: (id: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => {
        const id = professorSectionId(p);
        if (id !== undefined) onSelect(id);
      }}
      className="flex w-full cursor-pointer flex-col gap-0.5 rounded bg-transparent px-2 py-1.5 text-left font-gilroy-regular text-[13px] text-fg hover:bg-card-hover"
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span className="truncate font-gilroy-semibold">{p.name}</span>
        <span className="flex flex-shrink-0 items-center gap-3 text-description">
          <span>{formatMean(p.mean)}</span>
          <span className="inline-flex items-center gap-1">
            <GradeDot grade={p.median} />
            {p.median ?? "—"}
          </span>
        </span>
      </span>
      {p.pastSections.length === 0 && <span className="text-[11px] text-muted">New to this course</span>}
    </button>
  );
}

export default function NextSemesterProfessors({ info, onSelect }: NextSemesterProfessorsProps) {
  const [open, setOpen] = useState(false);
  const count = info.courses.reduce((n, c) => n + c.professors.length, 0);
  const multipleCourses = info.courses.length > 1;

  return (
    <div className="border-b border-r border-border px-[25px] py-2">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between bg-transparent p-0 font-gilroy-semibold text-[13px] text-fg"
      >
        <span>
          <TeamOutlined /> {info.semester.season} {info.semester.year} professors ({count})
        </span>
        <DownOutlined className={`text-[10px] text-description [transition:transform_0.2s] ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-2 flex flex-col">
          {info.courses.map((course) => (
            <div key={course.key}>
              {multipleCourses && <CourseHeading course={course} />}
              {course.professors.map((p) => (
                <ProfessorRow key={p.key} p={p} onSelect={onSelect} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
