import React, { useRef } from 'react';
import SectionList from './SectionList';
import Search from './Search';
import SearchResultsContent from './SearchResultsContent';
import { Row, Col } from 'antd';
import { fetchSections, fetchSection } from '../search';
import styled from 'styled-components';
import { animateScroll as scroll } from 'react-scroll';
import { useQuery } from 'react-query';
import { NextRouter, Router } from 'next/router';
import { UnparsedSearchQuery } from '../types';

const Container = styled.div`
  display: block;
  position: relative;
`;

const ResultsContainer = styled(Col)`
  padding-bottom: 20px;
  margin-top: 35px;
  border-radius: 5px;

  & .ant-list-pagination {
    padding-left: 10px;
  }

  & .ant-list-pagination li {
    margin-bottom: 10px;
    font-family: var(--font-family);
  }

  @media (max-width: 992px) {
    & {
      box-shadow: none;
    }
  }

  @media (min-width: 992px) {
    & {
      box-shadow: 0 15px 50px rgba(233, 233, 233, 0.7);
    }
  }
`;

interface ResultsProps {
  search: string;
  sectionId: number;
  router: NextRouter;
}

export default function Results({ search, sectionId, router }: ResultsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    data: sections,
    status: sectionsStatus,
    error: sectionsError,
  } = useQuery(
    ['sections', search],
    () => fetchSections({ search, sortField: 'year', sortDirection: 'DESC' }),
    { retry: false, enabled: !!search }
  );

  const {
    data: section,
    status: sectionStatus,
    error: sectionError,
  } = useQuery(['section', sectionId], () => fetchSection(sectionId), {
    retry: false,
    enabled: !!sectionId,
  });

  const { data: relatedSections } = useQuery(
    [
      'relatedSections',
      section && {
        courseNumber: section.catalogNumber.name,
        coursePrefix: section.subject.name,
      },
    ],
    () =>
      fetchSections({
        courseNumber: section!.catalogNumber.name, // can't be null because we guard on `section`
        coursePrefix: section!.subject.name,
      }),
    { retry: false, enabled: !!section }
  );

  function handleSubmit({ search } : UnparsedSearchQuery) {
    router.push({
      pathname: '/results',
      query: { search },
    });
  }

  function handleClick(id: string) {
    router.push({
      pathname: '/results',
      query: { search, sectionId: id },
    });

    const scrollDistance =
      window.pageYOffset + scrollRef.current!.getBoundingClientRect().top;

    scroll.scrollTo(scrollDistance);
  }

  function handleRelatedSectionClick(search: string, id: number) {
    router.push({
      pathname: '/results',
      query: { search, sectionId: id },
    });

    const scrollDistance =
      window.pageYOffset + scrollRef.current!.getBoundingClientRect().top;

    scroll.scrollTo(scrollDistance);
  }

  return (
    <Container>
      <Row>
        <Col
          lg={{ span: 8, offset: 8 }}
          sm={{ span: 18, offset: 3 }}
          xs={{ span: 20, offset: 2 }}
        >
          <Search onSubmit={handleSubmit} initialSearchValue={search} />
        </Col>
      </Row>

      <Row>
        <ResultsContainer
          lg={{ span: 20, offset: 2 }}
          xs={{ span: 24, offset: 0 }}
        >
          <Row>
            <Col lg={6} xs={24}>
              <SectionList
                data={sections}
                onClick={handleClick}
                loading={sectionsStatus === 'loading'}
                id={sectionId}
                error={sectionsError}
              />
            </Col>

            <Col lg={18} xs={24}>
              <div style={{ width: '100%', height: '100%' }} ref={scrollRef}>
                <SearchResultsContent
                  section={section!} // FIXME: need to actually do something if these are null
                  relatedSections={relatedSections!}
                  loadingSection={sectionStatus === 'loading'}
                  handleRelatedSectionClick={handleRelatedSectionClick}
                  error={sectionError}
                />
              </div>
            </Col>
          </Row>
        </ResultsContainer>
      </Row>
    </Container>
  );
}
