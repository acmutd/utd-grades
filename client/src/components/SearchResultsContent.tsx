import type { Grades, RMPInstructor } from "@utd-grades/db";
import { Spin } from "antd";
import React from "react";
import styled from "styled-components";
import SectionContent from "./SectionContent";

const LoadingContainer = styled.div`
  padding: 50px;
`;

const EmptyContainer = styled.div`
  padding: 50px;
`;

const Empty = styled.h2`
  font-family: var(--font-family);
  color: #a4a4a4;
  font-weight: 300;
  font-size: 26px;
`;

const Spinner = styled(Spin)`
  margin-left: auto;
  margin-right: auto;
  display: block !important;
`;

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
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  } else if (error) {
    return (
      <EmptyContainer>
        <Empty>We had trouble loading that for you, please try again.</Empty>
      </EmptyContainer>
    );
  } else {
    return (
      <EmptyContainer>
        {/* <Empty>Nothing to see here, select a section!</Empty> */}
      </EmptyContainer>
    );
  }
}
