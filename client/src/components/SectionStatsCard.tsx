import type { Grades } from "@utd-grades/db";
import React from "react";
import HoverTip, { MEAN_TIP, MEDIAN_TIP, STUDENTS_TIP } from "./HoverTip";

// Card styled to match the Professor Details card in SectionContent.
export default function SectionStatsCard({ section }: { section: Grades }) {
  return (
    <div className="mt-4 flex w-full flex-shrink-0 flex-wrap items-center gap-x-6 gap-y-1 bg-card max-992:pt-5 min-992:rounded-[5px] min-992:p-5 min-992:shadow-section-card">
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
