import type { RMPInstructor } from "@utd-grades/db";
import { Col, Row } from "antd";
import debounce from "lodash.debounce";
import type { NextRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "react-query";
import { animateScroll as scroll } from "react-scroll";
import styled from "styled-components";
import type { SearchQuery } from "../types";
import { normalizeName } from "../utils/index";
import { useDb } from "../utils/useDb";
import Search from "./Search";
import SearchResultsContent from "./SearchResultsContent";
import {SectionList} from "./SectionList";

const Container = styled.div`
  display: block;
  position: relative;
`;

const ResultsContainer = styled(Col)`
  padding-bottom: 20px;
  margin-top: 35px;
  border-radius: 5px;
  color: var(--text-color);

  & .ant-list-pagination {
    padding-left: 10px;
  }

  & .ant-list-pagination li {
    margin-bottom: 10px;
    font-family: var(--font-family);
  }

  & .ant-list-item-meta-title, .ant-card {
    color: var(--text-color) !important;
    background: transparent !important;
  }

  & .ant-list-item-meta-description {
    color: var(--muted-text) !important;
  }

  @media (max-width: 992px) {
    & {
      box-shadow: none;
    }
  }
  @media (min-width: 992px) {
    & {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }
`;

interface ResultsProps {
  search: string;
  sectionId: number;
  router: NextRouter;
}

const Results = React.memo(function Results({ search, sectionId, router }: ResultsProps) {
    // Track current page for SectionList pagination
  const [currentPage, setCurrentPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasAutoSelected = useRef(false);

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
    {
      enabled: !!db && !!search,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false, // Don't refetch when window gets focus
      refetchOnReconnect: false, // Don't refetch on network reconnect
    }
  );

  // Auto-select first section when sections load and no section is selected
  useEffect(() => {
    if (sections && sections.length > 0 && !sectionId && !hasAutoSelected.current) {
      hasAutoSelected.current = true;
      const firstSection = sections[0];
      if (firstSection) {
        void router.push({
          pathname: "/results",
          query: { search, sectionId: firstSection.id },
        }, undefined, { shallow: true });
      }
    }
  }, [sections, sectionId, search, router]);

  // Reset auto-select flag when search changes
  useEffect(() => {
    hasAutoSelected.current = false;
  }, [search]);

  // Update page when sectionId changes (arrow navigation or click)
  useEffect(() => {
    if (sections && sections.length > 0) {
      const idx = sections.findIndex(s => s.id === sectionId);
      if (idx !== -1) {
        const newPage = Math.floor(idx / 5) + 1;
        setCurrentPage(newPage);
      }
    }
  }, [sectionId, sections]);


  // get the section data
  const {
    data: section,
    status: sectionStatus,
    error: sectionError,
    // db can't be undefined, because it's only enabled once db is defined
  } = useQuery(["section", sectionId], () => db!.getSectionById(sectionId), {
    enabled: !!db && !isNaN(sectionId) && sectionId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Don't refetch when window gets focus
    refetchOnReconnect: false, // Don't refetch on network reconnect
  });

  const { data: relatedSections } = useQuery(
    [
      "relatedSections",
      section?.catalogNumber,
      section?.subject,
    ],
    () =>
      // TODO (field search)
      // db can't be undefined, because it's only enabled once section is defined which implies db is defined
      db!.getSectionsBySearch(
        `${section!.catalogNumber} ${section!.subject}` // can't be null because we guard on `section`
      ),
    {
      enabled: !!section && !!db,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  // some professors have the same name so we need to get the whole list
  const normalName: string[] = useMemo(() =>
    section ? normalizeName(`${section.instructor1?.first} ${section.instructor1?.last}`) : [],
    [section]
  );

  const { data: instructors } = useQuery<RMPInstructor[]>(
    ["instructors", section?.instructor1?.first, section?.instructor1?.last],
    async () => {
      if (!normalName.length || !db) return [];
      const results = await Promise.all(normalName.map((name) => db.getInstructorsByName(name)));
      return results.flat();
    },
    {
      enabled: !!section && !!db && normalName.length > 0,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  // Minimal debug logging
  // from that list, we need to find the one that holds the session -> update the instructor and course rating
  const [instructor, setInstructor] = useState<RMPInstructor>();
  const [courseRating, setCourseRating] = useState<number | null>(null);

  useEffect(() => {
    if (!instructors || !section || !db) {
      setInstructor(undefined);
      setCourseRating(null);
      return;
    }

    // when there is only professor that matches the needed name -> set the instructor to that prof
    // this helps prevent that some of the courses may not be listed in the RMP data but we still want to the prof data

    // however, if there're 2 profs with the same name and the course we're looking for is not listed in either instructor's RMP courses
    // then we don't know who to return
    // this will not be a problem when the new RMP data is updated
    if (instructors.length === 1) {
      const inst = instructors[0];
      setInstructor(inst);
      const rating = db.getCourseRating(
        inst!.instructor_id,
        `${section.subject}${section.catalogNumber}`
      );
      setCourseRating(rating);
    } else {
      let foundInstructor: RMPInstructor | undefined;
      let foundRating: number | null = null;

      for (const ins of instructors) {
        const rating = db.getCourseRating(
          ins.instructor_id,
          `${section.subject}${section.catalogNumber}`
        );
        if (rating) {
          foundInstructor = ins;
          foundRating = rating;
          break;
        }
      }

      setInstructor(foundInstructor);
      setCourseRating(foundRating);
    }
  }, [instructors, section, db]);

  const stableRouter = useRef(router);
  const stableSearch = useRef(search);
  const navigationInProgress = useRef(false);

  // Update refs when props change
  useEffect(() => {
    stableRouter.current = router;
    stableSearch.current = search;
  }, [router, search]);

  // Debounced navigation to prevent rapid clicks
  const debouncedNavigate = useMemo(
    () => debounce(async (id: number) => {
      if (navigationInProgress.current) {
        return;
      }

      navigationInProgress.current = true;

      try {
        // Use shallow routing to prevent page scroll reset
        await stableRouter.current.push({
          pathname: "/results",
          query: { search: stableSearch.current, sectionId: id },
        }, undefined, { shallow: false, scroll: false });

        // Always scroll to show the graph/content area when a section is clicked
        if (scrollRef.current) {
          const contentArea = scrollRef.current;
          const contentRect = contentArea.getBoundingClientRect();
          const offset = window.innerWidth <= 992 ? 5 : 35;  // diff offsets for mobile vs desktop
          const targetScrollY = window.scrollY + contentRect.top - offset;

          scroll.scrollTo(Math.max(0, targetScrollY), {
            duration: 400,
            smooth: true
          });
        }
      } catch (error: unknown) {
        if (error instanceof Error && !error.message.includes('Abort')) {
          console.error('Navigation error:', error);
        }
      } finally {
        navigationInProgress.current = false;
      }
    }, 300),
    []
  );

  const handleClick = useCallback((id: number) => {
    if (!scrollRef.current) return;

    // Don't navigate if we're already on this section
    if (id === sectionId) {
      return;
    }

    void debouncedNavigate(id);
  }, [sectionId, debouncedNavigate]);

  // Arrow key navigation between sections
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle arrow keys if user is typing in an input field or textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Only handle arrow keys when a section is selected
      if (!sections || sections.length === 0 || !sectionId) {
        return;
      }

      // Find the current section index
      const currentIndex = sections.findIndex((s) => s.id === sectionId);
      
      if (currentIndex === -1) {
        return;
      }

      let newIndex = -1;

      if (event.key === "ArrowLeft") {
        // Navigate to previous section
        newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        event.preventDefault();
      } else if (event.key === "ArrowRight") {
        // Navigate to next section
        newIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : currentIndex;
        event.preventDefault();
      }

    // Navigate to the new section if index changed
          if (newIndex !== -1 && newIndex !== currentIndex) {
            const target = sections[newIndex];
            if (target && typeof target.id === "number") {
              handleClick(target.id);
            }
          }
        };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sections, sectionId, handleClick]);
  // Arrow key navigation between sections
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't handle arrow keys if user is typing in an input field or textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Only handle arrow keys when a section is selected
      if (!sections || sections.length === 0 || !sectionId) {
        return;
      }

      // Find the current section index
      const currentIndex = sections.findIndex((s) => s.id === sectionId);
      
      if (currentIndex === -1) {
        return;
      }

      let newIndex = -1;

      if (event.key === "ArrowLeft") {
        // Navigate to previous section
        newIndex = currentIndex > 0 ? currentIndex - 1 : currentIndex;
        event.preventDefault();
      } else if (event.key === "ArrowRight") {
        // Navigate to next section
        newIndex = currentIndex < sections.length - 1 ? currentIndex + 1 : currentIndex;
        event.preventDefault();
      }

    // Navigate to the new section if index changed
          if (newIndex !== -1 && newIndex !== currentIndex) {
            const target = sections[newIndex];
            if (target && typeof target.id === "number") {
              handleClick(target.id);
            }
          }
        };

    // Add event listener
    window.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [sections, sectionId, handleClick]);

  const handleSubmit = useCallback(({ search }: SearchQuery) => {
    void stableRouter.current.push({
      pathname: "/results",
      query: { search },
    }).catch((error: unknown) => {
      console.error('Navigation error:', error);
    });
  }, []);

  const handleRelatedSectionClick = useCallback((search: string, id: number) => {
    void stableRouter.current.push({
      pathname: "/results",
      query: { search, sectionId: id },
    }, undefined, { shallow: false, scroll: false }).then(() => {
      if (!scrollRef.current) return;

      const contentArea = scrollRef.current;
      const contentRect = contentArea.getBoundingClientRect();
      const offset = window.innerWidth <= 992 ? 5 : 35;  // diff offsets for mobile vs desktop
      const targetScrollY = window.scrollY + contentRect.top - offset;

      scroll.scrollTo(Math.max(0, targetScrollY), {
        duration: 400,
        smooth: true
      });
    }).catch((error: unknown) => {
      console.error('Navigation error:', error);
    });
  }, []);

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
                page={currentPage}
                setPage={setCurrentPage}
                
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
}, (prevProps, nextProps) => {
  return prevProps.search === nextProps.search &&
    prevProps.sectionId === nextProps.sectionId;
});

export default Results;