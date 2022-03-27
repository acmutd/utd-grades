import React from 'react';
import styled from 'styled-components';
import SectionContent from './SectionContent';
import { Spin } from 'antd';

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

export default function SearchResultsContent({
  section,
  relatedSections,
  loadingSection,
  handleRelatedSectionClick,
  error,
}) {
  if (section) {
    return (
      <SectionContent
        section={section}
        relatedSections={relatedSections}
        handleRelatedSectionClick={handleRelatedSectionClick}
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
        <Empty>Nothing to see here, select a section!</Empty>
      </EmptyContainer>
    );
  }
}
