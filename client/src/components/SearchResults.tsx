import type { RMPInstructor } from "@utd-grades/db";
import { Col, Row } from "antd";
import type { NextRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { animateScroll as scroll } from "react-scroll";
import styled from "styled-components";
import type { SearchQuery } from "../types";
import { normalizeName } from "../utils/index";
import { useDb } from "../utils/useDb";
import Search from "./Search";
import SearchResultsContent from "./SearchResultsContent";
import SectionList from "./SectionList";

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

  const { data: db } = useDb();

  // this is to get all of the other sections of the same class (for the side bar)
  const {
    data: sections,
    status: sectionsStatus,
    error: sectionsError,
  } = useQuery(
    ["sections", search],
    // db can't be undefined, because it's only enabled once db is defined
    () => db!.getSectionsBySearch(search),
    { enabled: !!db }
  );

  // get the section data
  const {
    data: section,
    status: sectionStatus,
    error: sectionError,
    // db can't be undefined, because it's only enabled once db is defined
  } = useQuery(["section", sectionId], () => db!.getSectionById(sectionId), {
    enabled: !!db,
  });

  const { data: relatedSections } = useQuery(
    [
      "relatedSections",
      section && {
        courseNumber: section.catalogNumber,
        coursePrefix: section.subject,
      },
    ],
    () =>
      // TODO (field search)
      // db can't be undefined, because it's only enabled once section is defined which implies db is defined
      db!.getSectionsBySearch(
        `${section!.catalogNumber} ${section!.subject}` // can't be null because we guard on `section`
      ),
    { enabled: !!section }
  );

  // some professors have the same name so we need to get the whole list
  const normalName: string[] = normalizeName(
    `${section?.instructor1?.first} ${section?.instructor1?.last}`
  );

  const { data: instructors } = useQuery<RMPInstructor[]>(
    ["instructors", sectionId],
    async () => {
      const results = await Promise.all(normalName.map((name) => db!.getInstructorsByName(name)));
      return results.flat();
    },
    { enabled: !!section }
  );

  // from that list, we need to find the one that holds the session -> update the instructor and course rating
  const [instructor, setInstructor] = useState<RMPInstructor>();
  const [courseRating, setCourseRating] = useState<number | null>(null);

  useEffect(() => {
    if (instructors && section) {
      // when there is only professor that matches the needed name -> set the instructor to that prof
      // this helps prevent that some of the courses may not be listed in the RMP data but we still want to the prof data

      // however, if there're 2 profs with the same name and the course we're looking for is not listed in either instructor's RMP courses
      // then we don't know who to return
      // this will not be a problem when the new RMP data is updated
      if (instructors.length === 1) {
        setInstructor(instructors[0]);
        const rating = db!.getCourseRating(
          instructors[0]!.instructor_id,
          `${section.subject}${section.catalogNumber}`
        );
        setCourseRating(rating);
      } else {
        for (const ins of instructors) {
          const rating = db!.getCourseRating(
            ins.instructor_id,
            `${section.subject}${section.catalogNumber}`
          );
          if (rating) {
            setInstructor(ins);
            setCourseRating(rating);
            break;
          }
        }
      }
    } else {
      setInstructor(undefined);
      setCourseRating(null);
    }
  }, [instructors, section, db]);

  const handleClick = useCallback((id: number) => {
    (async function () {
      await router.push({
        pathname: "/results",
        query: { search, sectionId: id },
      });
    })();

    const scrollDistance = window.scrollY + scrollRef.current!.getBoundingClientRect().top;

    scroll.scrollTo(scrollDistance);
  }, [router, search]);

  useEffect(() => {
    // Automatically select section if there is only one choice
    if (sections && sections.length == 1) {
      handleClick(sections[0]!.id);
    }
  }, [sections, handleClick]);

  function handleSubmit({ search }: SearchQuery) {
    (async function () {
      await router.push({
        pathname: "/results",
        query: { search },
      });
    })();
  }

  function handleRelatedSectionClick(search: string, id: number) {
    (async function () {
      await router.push({
        pathname: "/results",
        query: { search, sectionId: id },
      });
    })();

    const scrollDistance = window.scrollY + scrollRef.current!.getBoundingClientRect().top;

    scroll.scrollTo(scrollDistance);
  }

  return (
    <Container>
      <Row>
        <Col lg={{ span: 8, offset: 8 }} sm={{ span: 18, offset: 3 }} xs={{ span: 20, offset: 2 }}>
          <Search onSubmit={handleSubmit} initialSearchValue={search} />
        </Col>
      </Row>

      <Row>
        <ResultsContainer lg={{ span: 20, offset: 2 }} xs={{ span: 24, offset: 0 }}>
          <Row>
            <Col lg={6} xs={24}>
              <SectionList
                data={sections}
                onClick={handleClick}
                loading={sectionsStatus === "loading"}
                id={sectionId}
                error={sectionsError}
              />
            </Col>

            <Col lg={18} xs={24}>
              <div style={{ width: "100%", height: "100%" }} ref={scrollRef}>
                <SearchResultsContent
                  section={section!} // FIXME: need to actually do something if these are null
                  relatedSections={relatedSections!}
                  instructor={instructor!}
                  courseRating={courseRating}
                  loadingSection={sectionStatus === "loading"}
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
