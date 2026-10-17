import type { Grades } from "@utd-grades/db";
import React from "react";
import HoverTip, { MEAN_TIP, MEDIAN_TIP, STUDENTS_TIP } from "./HoverTip";

export default function SectionStats({ section }: { section: Grades }) {
  return (
    <div className="mt-4 flex w-full flex-shrink-0 flex-wrap items-center gap-x-6 gap-y-1">
      <HoverTip {...STUDENTS_TIP}>
        <h5 className="mb-0 mt-0 font-gilroy-semibold text-[18px] font-semibold text-muted">
          Total Students <span className="text-fg">{section.totalStudents}</span>
        </h5>
      </HoverTip>
      <HoverTip {...MEAN_TIP}>
        <h5 className="mb-0 mt-0 font-gilroy-semibold text-[18px] font-semibold text-muted">
          Mean GPA{" "}
          <span className={section.stats.mean === null ? "text-muted" : "text-fg"}>
            {section.stats.mean === null ? "—" : section.stats.mean.toFixed(2)}
          </span>
        </h5>
      </HoverTip>
      <HoverTip {...MEDIAN_TIP}>
        <h5 className="mb-0 mt-0 font-gilroy-semibold text-[18px] font-semibold text-muted">
          Median Grade{" "}
          <span className={section.stats.median === null ? "text-muted" : "text-fg"}>
            {section.stats.median ?? "—"}
          </span>
        </h5>
      </HoverTip>
    </div>
  );
}
