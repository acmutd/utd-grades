import type { Grades } from "@utd-grades/db";
import React from "react";
import SlideUp from "./animations/SlideUp";

interface SectionCardProps {
  section: Grades;
  handleRelatedSectionClick: (search: string, id: number) => void;
}

export default function SectionCard({ section, handleRelatedSectionClick }: SectionCardProps) {
  return (
    <SlideUp delay={100}>
      <div
        onClick={() =>
          handleRelatedSectionClick(`${section.subject} ${section.catalogNumber}`, section.id)
        }
        className="relative mb-5 mr-5 flex-1 cursor-pointer rounded-md bg-white p-5 shadow-inactive [transition:all_0.3s] hover:shadow-active max-768:w-full"
        style={{ minWidth: "180px" }}
      >
        <p className="text-[20px] font-semibold text-black/65 [font-family:var(--font-family)]">
          {section.subject} {section.catalogNumber}.{section.section}
        </p>
        <p className="-mt-[15px] mb-0 text-[14px] text-black/45 [font-family:var(--font-family)]">
          {/* FIXME (no professor): non null assertion */}
          {section.instructor1!.first} {section.instructor1!.last} -{" "}
          {`${section.semester.season} ${section.semester.year}`}
        </p>
      </div>
    </SlideUp>
  );
}
