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
import type { UserFriendlyGrades } from "../types";
import { extractGrades, getColors } from "../utils";

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip);

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
    <div className="flex h-screen flex-col bg-card pb-[50px] pt-5 max-992:h-auto max-992:px-[25px] min-992:px-[50px]">
      <div className="mb-4 flex flex-shrink-0 flex-col">
        <div className="flex flex-row items-start justify-between max-992:flex-wrap max-992:gap-4">
          <div className="flex min-w-0 flex-shrink-0 flex-col first:flex-1">
            <h3 className="mb-0 mt-0 font-gilroy-bold text-[48px] text-fg">
              {section.subject} {section.catalogNumber}
              <span className="font-gilroy-regular font-normal text-[#c7c7c7]">.{section.section}</span>
            </h3>
            {section.courseName ? (
              <h5 className="mb-0 mt-[0.2rem] break-words font-gilroy-semibold text-[22px] font-semibold text-muted max-992:text-[18px]">
                {section.courseName}
              </h5>
            ) : null}
            <h5 className="mb-0 mt-[0.25rem] break-words font-gilroy-semibold text-[22px] font-semibold text-muted max-992:text-[18px]">
              {/* FIXME (no professor): non null assertion */}
              {section.instructor1!.last}, {section.instructor1!.first} -{" "}
              {`${section.semester.season} ${section.semester.year}`}
            </h5>
          </div>
          <div className="flex min-w-0 flex-shrink-0 flex-col first:flex-1">
            <h3 className="mb-0 mt-0 font-gilroy-bold text-[48px] text-fg">
              <span className="leading-none text-fg max-992:text-[24px] max-992:font-bold min-992:text-[3rem]">
                {courseRating ? courseRating : "N/A"}
              </span>
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
            </h3>
            <Row className="mt-[0.25rem] items-center justify-center gap-2">
              <h5 className="mb-0 mt-0 break-words font-gilroy-semibold text-[22px] font-semibold text-muted max-992:mt-2 max-992:text-[14px] min-992:mt-0">
                Course Rating
              </h5>
              <Tooltip
                placement="bottom"
                title={"Average students' grade for this instructor in this course"}
              >
                <InfoCircleOutlined style={{ marginTop: "0.3rem" }} />
              </Tooltip>
            </Row>
          </div>
        </div>
        <h5 className="mb-0 mt-0 font-gilroy-semibold text-[18px] font-semibold text-muted">
          Total Students <span className="text-fg">{section.totalStudents}</span>
        </h5>
      </div>

      <Row style={{ marginBottom: "0.5rem" }}>
        <Col xs={24} sm={24} md={24}>
          <div className="min-h-[250px] w-full max-h-[400px] bg-card max-992:max-h-[300px] max-992:min-h-[200px] max-992:flex-none max-992:h-[30vh] max-992:pt-5 min-992:rounded-[5px] min-992:p-5 min-992:shadow-section-card">
            <Bar options={{ ...options, responsive: true, maintainAspectRatio: false }} data={data} />
          </div>
        </Col>
      </Row>

      <div className="mt-4 w-full flex-shrink-0 bg-card max-992:pt-5 min-992:rounded-[5px] min-992:p-5 min-992:shadow-section-card">
        <Row gutter={[16, 4]}>
          <Col span={24}>
            <a
              href={instructor?.url || "#"}
              target={instructor?.url ? "_blank" : "_self"}
              rel={instructor?.url ? "noreferrer" : undefined}
              style={{ position: "relative" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              ref={rmpLinkRef}
              className={`mb-2 inline-flex items-center gap-2 font-gilroy-bold text-[1.15rem] font-bold !text-fg !no-underline [transition:color_0.2s_ease] hover:!text-muted max-768:text-[0.8rem] ${
                instructor?.url && instructor.url !== "#" ? "border-b border-b-rmp-underline" : "border-b-0"
              }`}
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
            </a>
            {!instructor && (
              <p className="mb-0 mt-2 text-[0.95rem] font-normal text-muted [font-family:var(--font-family)]">
                N/A
              </p>
            )}
          </Col>
          {instructor ? (
            <>
              <Col xs={12} md={6}>
                <h5 className="mb-0 mt-0 font-extrabold text-fg [font-family:var(--font-family)] max-1200:text-[1.1rem] min-1200:text-[1.6rem] min-1200:leading-[1.3]">
                  {instructor?.quality_rating ? (
                    <span style={{ color: getRMPColor(instructor.quality_rating) }}>
                      {instructor.quality_rating}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </h5>
                <p className="mb-0 mt-0 font-gilroy-regular font-medium text-muted max-1200:text-[0.9rem] min-1200:text-[1rem]">
                  RMP Score
                </p>
              </Col>
              <Col xs={12} md={6}>
                <h5 className="mb-0 mt-0 font-extrabold text-fg [font-family:var(--font-family)] max-1200:text-[1.1rem] min-1200:text-[1.6rem] min-1200:leading-[1.3]">
                  {instructor?.difficulty_rating ? (
                    <span style={{ color: getDifficultyColor(instructor.difficulty_rating) }}>
                      {instructor.difficulty_rating}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </h5>
                <p className="mb-0 mt-0 font-gilroy-regular font-medium text-muted max-1200:text-[0.9rem] min-1200:text-[1rem]">
                  Level of difficulty
                </p>
              </Col>
              <Col xs={12} md={6}>
                <h5 className="mb-0 mt-0 font-extrabold text-fg [font-family:var(--font-family)] max-1200:text-[1.1rem] min-1200:text-[1.6rem] min-1200:leading-[1.3]">
                  {instructor?.would_take_again ? `${instructor.would_take_again}%` : `N/A`}
                </h5>
                <p className="mb-0 mt-0 font-gilroy-regular font-medium text-muted max-1200:text-[0.9rem] min-1200:text-[1rem]">
                  Would take again
                </p>
              </Col>
              <Col xs={12} md={6}>
                <h5 className="mb-0 mt-0 font-extrabold text-fg [font-family:var(--font-family)] max-1200:text-[1.1rem] min-1200:text-[1.6rem] min-1200:leading-[1.3]">
                  {instructor?.ratings_count ? instructor.ratings_count : `N/A`}
                </h5>
                <p className="mb-0 mt-0 font-gilroy-regular font-medium text-muted max-1200:text-[0.9rem] min-1200:text-[1rem]">
                  Ratings count
                </p>
              </Col>
            </>
          ) : null}
        </Row>

        {instructor?.tags && (
          <>
            <h4 className="mb-2 mt-6 inline-flex items-center gap-2 font-gilroy-bold text-[1.15rem] font-bold text-fg no-underline">
              Tags
            </h4>
            <Row wrap={true} gutter={0} style={{ gap: "1.0rem" }}>
              {instructor.tags.split(",").map((tag) => (
                <p
                  key={tag}
                  className="rounded font-gilroy-regular font-medium text-fg shadow-[0_2px_4px_rgba(0,0,0,0.1)] [transition:all_0.2s_ease-in-out] hover:-translate-y-px hover:bg-card-hover hover:shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
                  style={{ padding: "0.4rem 0.4rem", backgroundColor: "var(--card-bg)" }}
                >
                  {tag}
                </p>
              ))}
            </Row>
          </>
        )}
      </div>
    </div>
  );
});

export default SectionContent;
