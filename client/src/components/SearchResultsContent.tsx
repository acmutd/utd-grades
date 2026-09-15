import type { Grades, RMPInstructor } from "@utd-grades/db";
import { Spin } from "antd";
import React from "react";
import SectionContent from "./SectionContent";

interface SearchResultsContentProps {
  section: Grades;
  instructor: RMPInstructor;
  courseRating: number | null;
  relatedSections: Grades[];
  loadingSection: boolean;
  handleRelatedSectionClick: (search: string, id: number) => void;
  error: unknown; // TODO
}

export default function SearchResultsContent({
  section,
  instructor,
  courseRating,
  // relatedSections,
  loadingSection,
  // handleRelatedSectionClick,
  error,
}: SearchResultsContentProps) {
  if (section) {
    return (
      <SectionContent
        section={section}
        instructor={instructor}
        courseRating={courseRating}
        // relatedSections={relatedSections}
        // handleRelatedSectionClick={handleRelatedSectionClick}
      />
    );
  } else if (loadingSection) {
    return (
      <div className="p-[50px]">
        <Spin className="mx-auto !block" />
      </div>
    );
  } else if (error) {
    return (
      <div className="p-[50px]">
        <h2 className="font-gilroy-regular text-[26px] font-light text-muted">
          We had trouble loading that for you, please try again.
        </h2>
      </div>
    );
  } else {
    return (
      <div className="p-[50px]">
        {/* <h2>Nothing to see here, select a section!</h2> */}
      </div>
    );
  }
}
