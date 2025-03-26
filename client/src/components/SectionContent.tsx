import type { Grades, RMPInstructor } from "@utd-grades/db";
import { Col, Row, Spin } from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  LinearScale,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import type { UserFriendlyGrades } from "../types";
import { extractGrades, getColors } from "../utils";
import SectionCard from "./SectionCard";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const Container = styled.div`
  padding-top: 20px;
  padding-bottom: 50px;

  @media (max-width: 992px) {
    & {
      padding-left: 25px;
      padding-right: 25px;
    }
  }

  @media (min-width: 992px) {
    & {
      padding-left: 50px;
      padding-right: 50px;
    }
  }
`;

const GraphContainer = styled.div`
  width: 100%;

  @media (max-width: 992px) {
    & {
      padding-top: 20px;
    }
  }

  @media (min-width: 992px) {
    & {
      box-shadow: 0 15px 15px rgba(233, 233, 233, 0.7);
      border-radius: 5px;
      padding: 20px;
    }
  }
`;

const ProfessorDetailsContainer = styled.div`
  width: 100%;
  margin-top: 2rem;

  @media (max-width: 992px) {
    & {
      padding-top: 20px;
    }
  }

  @media (min-width: 992px) {
    & {
      box-shadow: 0 15px 15px rgba(233, 233, 233, 0.7);
      border-radius: 5px;
      padding: 20px;
    }
  }
`;

const Header = styled.h3`
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 48px;
  margin-bottom: 0px !important;
  margin-top: 6px !important;
`;

const SubHeader = styled.h5`
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 22px;
  color: rgb(117, 117, 117);
  margin-top: 1rem !important;
  margin-bottom: 0rem !important;
`;

const Stat = styled.h5`
  font-family: var(--font-family);
  font-weight: 600;
  font-size: 18px;
  color: rgb(117, 117, 117);
  margin-top: 0px !important;
  margin-bottom: 0px !important;
`;

const RMPScore = styled.span`
  color: #333333;

  @media (max-width: 992px) {
    & {
      font-size: 20px;
      padding-left: 0.3rem;
      line-height: 1;
      font-weight: 550;
    }
  }

  @media (min-width: 992px) {
    & {
      font-size: 3.5rem;
      line-height: 0.8;
      font-weight: bolder;
    }
  }
`;

const RMPStat = styled.h5`
  font-family: var(--font-family);
  font-weight: 800;
  color: #333333;
  margin-top: 0px !important;
  margin-bottom: 0px !important;
  @media (max-width: 1200px) {
    & {
      font-size: 1.1rem;
    }
  }

  @media (min-width: 1200px) {
    & {
      font-size: 1.6rem;
      line-height: 1.3;
    }
  }
`;

const RMPDescpription = styled.p`
  font-family: var(--font-family);
  font-weight: 500;
  color: rgb(117, 117, 117);
  margin-top: 0px !important;
  margin-bottom: 0px !important;
  @media (max-width: 768px) {
    & {
      font-size: 0.9rem;
    }
  }

  @media (min-width: 768px) and (max-width: 1200px) {
    & {
      font-size: 0.9rem;
    }
  }

  @media (min-width: 1200px) {
    & {
      font-size: 1rem;
    }
  }
`;

const RMPTag = styled.p`
  font-family: var(--font-family);
  font-weight: 500;
  color: rgb(84, 84, 84);
  border-radius: 1rem;
  background-color: #f5f5f5;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e8e8e8;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const RMPHeader = styled.a`
  font-family: var(--font-family);
  font-weight: 700;
  font-size: 1.15rem;
  text-decoration: ${props => props.href && props.href !== "#" ? "underline" : "none"} !important;
  color: ${props => props.href && props.href !== "#" ? "#1890ff" : "#333"} !important;

  @media (max-width: 768px) {
    & {
      font-size: 0.8rem;
    }
  }
`;

const Section = styled.span`
  color: rgb(198, 198, 198);
  font-weight: 400;
`;

const OtherSectionsHeader = styled.p`
  font-family: var(--font-family);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 16px;
`;

const OtherSectionsRow = styled(Row)`
  padding-top: 3rem;
`;

const SectionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-flow: row nowrap;
  align-content: flex-start;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  padding: 10px;
  margin-left: -10px;
  width: 100%;
`;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderedStack = styled.div`
  @media (max-width: 992px) {
    & {
      display: flex;
      flex-direction: row;
      align-items: flex-end;
    }
  }
  @media (min-width: 992px) {
    & {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-right: 2rem;
    }
  }
`;

const OrderedFirst = styled.div`
  @media (min-width: 992px) {
    & {
      order: 1;
    }
  }
  @media (max-width: 992px) {
    & {
      order: 2;
    }
  }
`;

const OrderedSecond = styled.div`
  font-family: var(--font-family);
  color: rgb(117, 117, 117);
  font-weight: 600;
  font-size: 18px;

  @media (min-width: 992px) {
    & {
      order: 2;
      text-align: center;
    }
  }
  @media (max-width: 992px) {
    & {
      order: 1;
      align-self: center;
      padding-top: 1rem;
    }
  }
`;

const FlexSmall = styled.div`
  @media (min-width: 992px) {
    & {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
`;

interface SectionContentProps {
  relatedSections: Grades[];
  section: Grades;
  instructor: RMPInstructor;
  courseRating: number | null;
  handleRelatedSectionClick: (search: string, id: number) => void;
}

export default function SectionContent({
  relatedSections,
  section,
  instructor,
  courseRating,
  handleRelatedSectionClick,
}: SectionContentProps) {
  const renderRelatedSections = () => {
    if (relatedSections) {
      return relatedSections
        .filter((s) => s.id != section.id)
        .map((s) => (
          <SectionCard
            key={s.id} // FIXME
            section={s}
            handleRelatedSectionClick={handleRelatedSectionClick}
          />
        ));
    }

    return <Spin />;
  };

  const grades = extractGrades(section);
  const keys = Object.keys(grades) as (keyof UserFriendlyGrades)[]; // we can be confident only these keys exist
  const values = Object.values(grades);

  const data = {
    labels: keys,
    datasets: [{ backgroundColor: getColors(keys), data: values }],
  };

  const options: ChartOptions<"bar"> = {
    plugins: {
      tooltip: {
        enabled: true,
        mode: "nearest",
        intersect: true,
        callbacks: {
          label: (context) => {
            const count = context.parsed.y;
            return [
              `Students: ${count}`,
              `Percentage: ${((count / section.totalStudents) * 100).toFixed(2)}%`,
            ];
          },
        },
      },
    },
  };

  // FIXME (median)
  // const averageLetter = getLetterGrade(section.average);

  return (
    <Container>
      <Stack>
        <FlexSmall>
          <Stack>
            <Header>
              {section.subject} {section.catalogNumber}
              <Section>.{section.section}</Section>
            </Header>
            <SubHeader>
              {/* FIXME (no professor): non null assertion */}
              {section.instructor1!.last}, {section.instructor1!.first} -{" "}
              {`${section.semester.season} ${section.semester.year}`}
            </SubHeader>
          </Stack>
          <OrderedStack>
            <OrderedFirst>
              <RMPScore>{instructor?.quality_rating ? instructor.quality_rating : "N/A"}</RMPScore>
              <span
                style={{
                  fontFamily: "var(--font-family)",
                  fontWeight: "550",
                  fontSize: "18px",
                }}
              >
                {instructor?.quality_rating ? "/5" : ""}
              </span>
            </OrderedFirst>

            <OrderedSecond>RMP SCORE</OrderedSecond>
          </OrderedStack>
        </FlexSmall>
        <Stat>
          Total Students <span style={{ color: "#333333" }}>{section.totalStudents}</span>
        </Stat>
      </Stack>

      <Row style={{ marginBottom: "2rem" }}>
        <Col xs={24} sm={24} md={24}>
          <GraphContainer>
            <Bar options={options} data={data} />
          </GraphContainer>
        </Col>
      </Row>

      <ProfessorDetailsContainer>
        <Row gutter={[16, 4]}>
          <Col span={24}>
            <RMPHeader
              href={instructor?.url || "#"}
              target={instructor?.url ? "_blank" : "_self"}
            >
              Professor Details
            </RMPHeader>
          </Col>
          {instructor && courseRating ? (
            <>
              <Col span={12}>
                <RMPStat>{courseRating ? courseRating : `N/A`}</RMPStat>
                <RMPDescpription>Course rating</RMPDescpription>
              </Col>
              <Col span={12}>
                <RMPStat>
                  {instructor?.difficulty_rating ? instructor.difficulty_rating : `N/A`}
                </RMPStat>
                <RMPDescpription>Level of difficulty</RMPDescpription>
              </Col>
              <Col span={12}>
                <RMPStat>
                  {instructor?.would_take_again ? `${instructor.would_take_again}%` : `N/A`}
                </RMPStat>
                <RMPDescpription>Would take again</RMPDescpription>
              </Col>
              <Col span={12}>
                <RMPStat>{instructor?.ratings_count ? instructor.ratings_count : `N/A`}</RMPStat>
                <RMPDescpription>Ratings count</RMPDescpription>
              </Col>
            </>
          ) : null}
        </Row>

        {instructor?.tags && (
          <>
            <h4 style={{ marginTop: "1.5rem", marginBottom: "0.2rem", fontSize: "1.2rem" }}>Tags</h4>
            <Row wrap={true} gutter={0}>
              {instructor.tags.split(",").map((tag) => (
                <RMPTag key={tag}>{tag}</RMPTag>
              ))}
            </Row>
          </>
        )}
      </ProfessorDetailsContainer>
    </Container>
  );
}