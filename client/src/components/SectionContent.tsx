import { InfoCircleOutlined, LinkOutlined } from "@ant-design/icons";
import type { Grades, RMPInstructor } from "@utd-grades/db";
import { Col, Row, Tooltip } from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  LinearScale,
  Tooltip as ChartTooltip,
} from "chart.js";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import styled from "styled-components";
import type { UserFriendlyGrades } from "../types";
import { extractGrades, getColors } from "../utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip);

const Container = styled.div`
  padding-top: 20px;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: var(--card-bg);

  @media (max-width: 992px) {
    & {
      padding-left: 25px;
      padding-right: 25px;
      height: auto;
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
  min-height: 250px;
  max-height: 400px;
  background-color: var(--card-bg);

  @media (max-width: 992px) {
    & {
      padding-top: 20px;
      height: 30vh;
      min-height: 200px;
      max-height: 300px;
      flex: none;
    }
  }

  @media (min-width: 992px) {
    & {
      box-shadow: 0 5px 10px rgba(70, 70, 70, 0.7);
      border-radius: 5px;
      padding: 20px;
    }
  }
`;

const ProfessorDetailsContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  flex-shrink: 0;
  background-color: var(--card-bg);

  @media (max-width: 992px) {
    & {
      padding-top: 20px;
    }
  }

  @media (min-width: 992px) {
    & {
      box-shadow: 0 5px 10px rgba(70, 70, 70, 0.7);
      border-radius: 5px;
      padding: 20px;
    }
  }
`;

const Header = styled.h3`
  font-family: 'Gilroy-Bold', sans-serif;
  font-size: 48px;
  margin-bottom: 0px !important;
  margin-top: 0px !important;
  color: var(--text-color);
`;

const SubHeader = styled.h5`
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-weight: 600;
  font-size: 22px;
  color: var(--muted-text);
  margin-top: 0.25rem !important;
  margin-bottom: 0rem !important;
  word-wrap: break-word;
  overflow-wrap: break-word;

  @media (max-width: 992px) {
    & {
      font-size: 18px;
    }
  }
`;

const Stat = styled.h5`
  font-family: 'Gilroy-SemiBold', sans-serif;
  font-weight: 600;
  font-size: 18px;
  color: var(--muted-text);
  margin-top: 0px !important;
  margin-bottom: 0px !important;
`;

const RMPScore = styled.span`
  color: var(--text-color);
  line-height: 1;

  @media (max-width: 992px) {
    & {
      font-size: 24px;
      font-weight: 700;
    }
  }

  @media (min-width: 992px) {
    & {
      font-size: 3rem;
    }
  }
`;

const RMPTooltip = styled(Row)`
  justify-content: center;
  align-items: center;
  margin-top: 0.25rem !important;
  gap: 0.5rem;
`;

const RMPSubHeader = styled(SubHeader)`
  margin-top: 0rem !important;

  @media (max-width: 992px) {
    & {
      font-size: 14px;
      margin-top: 0.5rem !important;
    }
  }
`;

const RMPStat = styled.h5`
  font-family: var(--font-family);
  font-weight: 800;
  color: var(--text-color);
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
  font-family: 'Gilroy-Regular', sans-serif;
  font-weight: 500;
  color: var(--muted-text);
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
  font-family: 'Gilroy-Regular', sans-serif;
  font-weight: 500;
  color: var(--text-color);
  border-radius: 4px;
  background-color: var(--card-bg);
  padding: 0.4rem 0.4rem;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: var(--card-hover-bg);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const TagsHeader = styled.h4`
  font-family: 'Gilroy-Bold', sans-serif;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--text-color);
  text-decoration: none;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
`;

const RMPHeader = styled.a`
  font-family: 'Gilroy-Bold', sans-serif;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--text-color) !important;
  text-decoration: none !important;
  border-bottom: ${(props) => (props.href && props.href !== "#" ? "1px solid var(--rmp-link-underline)" : "none")};
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: var(--muted-text) !important;
  }

  @media (max-width: 768px) {
    & {
      font-size: 0.8rem;
    }
  }
`;

const Section = styled.span`
  font-family: 'Gilroy-Regular', sans-serif;
  font-weight: 400;
  color: #c7c7c7ff;
`;

// const OtherSectionsHeader = styled.p`
//   font-family: var(--font-family);
//   font-weight: 700;
//   text-transform: uppercase;
//   font-size: 16px;
// `;

// const OtherSectionsRow = styled(Row)`
//   padding-top: 3rem;
// `;

// const SectionsContainer = styled.div`
//   display: flex;
//   justify-content: space-between;
//   flex-flow: row nowrap;
//   align-content: flex-start;
//   overflow-x: auto;
//   overflow-y: hidden;
//   -webkit-overflow-scrolling: touch;
//   padding: 10px;
//   margin-left: -10px;
//   width: 100%;
// `;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;

  @media (max-width: 992px) {
    &:first-child {
      flex: 1;
      min-width: 0; /* Allow text to wrap */
    }
  }
`;

const FlexSmall = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  @media (max-width: 992px) {
    & {
      gap: 1rem;
      flex-wrap: wrap;
    }
  }
`;

interface SectionContentProps {
  section: Grades;
  instructor: RMPInstructor;
  courseRating: number | null;
  relatedSections?: Grades[];
  handleRelatedSectionClick?: (search: string, id: number) => void;
}

const getDifficultyColor = (difficulty: number): string => {
  if (difficulty <= 1) return "#2ecc71"; // Very green
  if (difficulty <= 2) return "#27ae60"; // Green
  if (difficulty <= 3) return "#f1c40f"; // Yellow
  if (difficulty <= 4) return "#e67e22"; // Orange
  return "#e74c3c"; // Red
};

const getRMPColor = (rating: number): string => {
  if (rating >= 4.5) return "#2ecc71"; // Very green
  if (rating >= 3.75) return "#27ae60"; // Yellow green
  if (rating >= 3) return "#f1c40f"; // Yellow
  if (rating >= 2) return "#e67e22"; // Orange
  return "#e74c3c"; // Red
};

const SectionContent = React.memo(function SectionContent({
  section,
  instructor,
  courseRating,
}: SectionContentProps) {
  const [hovered, setHovered] = useState<"rmpLink" | null>(null);
  const rmpLinkRef = useRef<HTMLAnchorElement>(null);

  const handleMouseEnter = useCallback(() => setHovered("rmpLink"), []);
  const handleMouseLeave = useCallback(() => setHovered(null), []);

  const grades = extractGrades(section);
  const keys = Object.keys(grades) as (keyof UserFriendlyGrades)[]; // we can be confident only these keys exist
  const values = Object.values(grades);

  const data = {
    labels: keys,
    datasets: [{ backgroundColor: getColors(keys), data: values }],
  };

// READ: I had to hardcode the colors to a color in between light and dark mode here because using CSS variables in ChartJS options was not working properly. If someone has a better solution, please help.
const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
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
    scales: {
      x: {
        grid: {
          color: "#87878747",
          borderColor: "#87878747",
        },
        ticks: {
          color: "#868686",
        },
      },
      y: {
        grid: {
          color: "#87878747",
          borderColor: "#87878747",
        },
        ticks: {
          color: "#868686",
        },
      },
    },
  };

  // FIXME (median)
  // const averageLetter = getLetterGrade(section.average);

  return (
    <Container>
      <Stack style={{ marginBottom: "1rem" }}>
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
          <Stack>
            <Header>
              <RMPScore>{courseRating ? courseRating : "N/A"}</RMPScore>
              <span
                style={{
                  fontFamily: "var(--font-family)",
                  fontWeight: "550",
                  fontSize: "20px",
                  color: "var(--muted-text)",
                }}
              >
                {courseRating ? "/5" : ""}
              </span>
            </Header>
            <RMPTooltip>
              <RMPSubHeader>Course Rating</RMPSubHeader>
              <Tooltip
                placement="bottom"
                title={"Average students' grade for this instructor in this course"}
              >
                <InfoCircleOutlined style={{ marginTop: "0.3rem" }} />
              </Tooltip>
            </RMPTooltip>
          </Stack>
        </FlexSmall>
        <Stat>
          Total Students <span style={{ color: "var(--text-color)" }}>{section.totalStudents}</span>
        </Stat>
      </Stack>

      <Row style={{ marginBottom: "0.5rem" }}>
        <Col xs={24} sm={24} md={24}>
          <GraphContainer>
            <Bar options={{ ...options, responsive: true, maintainAspectRatio: false }} data={data} />
          </GraphContainer>
        </Col>
      </Row>

      <ProfessorDetailsContainer>
        <Row gutter={[16, 4]}>
          <Col span={24}>
            <RMPHeader
              href={instructor?.url || "#"}
              target={instructor?.url ? "_blank" : "_self"}
              style={{ position: "relative" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={rmpLinkRef}
            >
              Professor Details
              {instructor?.url && <LinkOutlined style={{ fontSize: "1.2em" }} />}
              {hovered && (
                <>
                  <div
                    style={{
                      position: "absolute",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "0.5rem",
                      transform: "translate(-10%, -100%)",
                      zIndex: 1000,
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.75rem",
                      lineHeight: "1rem",
                      color: "var(--text-color)",
                      whiteSpace: "nowrap",
                      backgroundColor: "var(--card-bg)",
                      boxShadow:
                        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                  >
                    See more on
                    <Image src="/rmp-logo.png" alt="Rate My Professor Logo" width={88} height={18} style={{ height: "1.1rem" }} />
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-5rem",
                      left: "50%",
                      borderTopWidth: "8px",
                      borderRightWidth: "8px",
                      borderLeftWidth: "8px",
                      width: "10",
                      height: "10",
                    }}
                  />
                </>
              )}
            </RMPHeader>
          </Col>
          {instructor ? (
            <>
              <Col xs={12} md={6}>
                <RMPStat>
                  {instructor?.quality_rating ? (
                    <span style={{ color: getRMPColor(instructor.quality_rating) }}>
                      {instructor.quality_rating}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </RMPStat>
                <RMPDescpription>RMP Score</RMPDescpription>
              </Col>
              <Col xs={12} md={6}>
                <RMPStat>
                  {instructor?.difficulty_rating ? (
                    <span style={{ color: getDifficultyColor(instructor.difficulty_rating) }}>
                      {instructor.difficulty_rating}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </RMPStat>
                <RMPDescpription>Level of difficulty</RMPDescpription>
              </Col>
              <Col xs={12} md={6}>
                <RMPStat>
                  {instructor?.would_take_again ? `${instructor.would_take_again}%` : `N/A`}
                </RMPStat>
                <RMPDescpription>Would take again</RMPDescpription>
              </Col>
              <Col xs={12} md={6}>
                <RMPStat>{instructor?.ratings_count ? instructor.ratings_count : `N/A`}</RMPStat>
                <RMPDescpription>Ratings count</RMPDescpription>
              </Col>
            </>
          ) : null}
        </Row>

        {instructor?.tags && (
          <>
            <TagsHeader>Tags</TagsHeader>
            <Row wrap={true} gutter={0} style={{ gap: "1.0rem" }}>
              {instructor.tags.split(",").map((tag) => (
                <RMPTag key={tag}>{tag}</RMPTag>
              ))}
            </Row>
          </>
        )}
      </ProfessorDetailsContainer>
    </Container>
  );
});

export default SectionContent;
