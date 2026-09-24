import { BarChartOutlined, FrownTwoTone, UserOutlined, LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import type { Grades } from "@utd-grades/db";
import { List, Popover, Spin } from "antd";
import React, { ReactNode } from "react";
import GradeDot from "./GradeDot";

interface IconTextProps {
  icon: ReactNode;
  child: ReactNode;
  tooltip?: string | undefined;
}

// Padding enlarges the tooltip's hover target; the negative margin cancels it so layout is unchanged.
const IconText = ({ icon, child, tooltip }: IconTextProps) => (
  <span title={tooltip} className={tooltip ? "-mx-2 -my-1 inline-block px-2 py-1" : undefined}>
    <div className="text-description">{icon}</div>
    {child}
  </span>
);

interface SectionListProps {
  loading: boolean;
  id: number;
  data: Grades[] | undefined;
  onClick: (id: number) => void;
  error: unknown;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  filterGroups: FilterGroups | undefined;
}

interface FilterGroups {
  matchCount: number;
  label: string;
}

function OutsideFilterSeparator({ restCount }: { restCount: number }) {
  return (
    <li role="separator" className="relative list-none border-r border-border py-3">
      <div className="absolute inset-x-0 top-1/2 h-px bg-description opacity-40" />
      <span className="relative mx-auto block w-fit rounded-full bg-chip px-3 py-0.5 font-gilroy-semibold text-[12px] text-description shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
        {restCount} outside filter
      </span>
    </li>
  );
}

export function SectionList({ loading, id, data, onClick, error, page, setPage, filterGroups }: SectionListProps) {
  const pageSize = 5;
  const totalPages = data ? Math.ceil(data.length / pageSize) : 0;

  // Calculate which pages to show (max 3 pages)
  const getPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show current page and try to show 1 before and 1 after
    if (page === 1) {
      return [1, 2, 3];
    } else if (page === totalPages) {
      return [totalPages - 2, totalPages - 1, totalPages];
    } else {
      return [page - 1, page, page + 1];
    }
  };

  const popover = (
    <div className="w-[200px] [font-family:var(--font-family)]">
      <p>
        Because of FERPA restrictions, grade data for certain classes — in particular, classes with
        a small number of students — is unavailable.
      </p>
    </div>
  );

  const emptyMessage = (
    <div className="p-[30px]">
      <FrownTwoTone className="mx-auto mb-[15px] block w-[43px] text-[42px]" />
      <p className="text-center text-[22px] font-light text-muted [font-family:var(--font-family)]">
        We weren&apos;t able to find that. Try searching for something else!
      </p>
      <Popover
        className="mx-auto mt-[25px] block text-description [font-family:var(--font-family)]"
        content={popover}
        placement="bottom"
      >
        <span style={{ textAlign: "center" }}>
          Still can&apos;t find what you&apos;re looking for?{" "}
          <span style={{ textDecoration: "underline" }}>Learn more.</span>
        </span>
      </Popover>
    </div>
  );

  const errorMessage = (
    <div className="p-[30px]">
      <FrownTwoTone className="mx-auto mb-[15px] block w-[43px] text-[42px]" />
      <p className="text-center text-[22px] font-light text-muted [font-family:var(--font-family)]">
        We had trouble getting that for you, please try again.
      </p>
    </div>
  );

  if (data) {
    if (data.length < 1) {
      return emptyMessage;
    } else {
      const pageNumbers = getPageNumbers();
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const currentPageData = data.slice(startIndex, endIndex);
      const restCount = filterGroups ? data.length - filterGroups.matchCount : 0;

      return (
                <>
          {filterGroups?.matchCount === 0 && page === 1 && (
            <div className="border-b border-r border-border px-[25px] py-4 font-gilroy-regular text-[14px] text-description">
              No sections match <span className="text-fg">{filterGroups.label}</span>. Showing all sections instead.
            </div>
          )}
          <List<Grades>
            itemLayout="vertical"
            size="large"
            dataSource={currentPageData}
            style={{ width: "100%", minWidth: "100%" }}
            renderItem={(item, index) => {
              const globalIndex = startIndex + index;
              const showSeparator =
                filterGroups !== undefined && filterGroups.matchCount > 0 && globalIndex === filterGroups.matchCount;
              const dimmed = filterGroups !== undefined && globalIndex >= filterGroups.matchCount && item.id != id;
              return (
              <React.Fragment key={item.id}>
              {showSeparator && <OutsideFilterSeparator restCount={restCount} />}
              <List.Item
                className={`section-list-item ${item.id == id ? "section-list-item--selected" : ""} ${
                  dimmed ? "opacity-60 hover:opacity-100" : ""
                }`}
                actions={[
                  <IconText
                    icon={<UserOutlined />}
                    tooltip="Total students, including W, P, CR, NC, I, and NF grades"
                    child={<span className="text-description">{item.totalStudents.toString()}</span>}
                    key="students-total"
                  />,
                  <IconText
                    icon={<BarChartOutlined />}
                    tooltip="Mean GPA of students who received a letter grade"
                    child={
                      <span className="text-description">
                        {item.stats.mean === null ? "—" : item.stats.mean.toFixed(2)}
                      </span>
                    }
                    key="mean-gpa"
                  />,
                  <IconText
                    icon={<GradeDot grade={item.stats.median} />}
                    tooltip="Median grade of students who received a letter grade"
                    child={<span className="text-description">{item.stats.median ?? "—"}</span>}
                    key="median-grade"
                  />,
                ]}
                onClick={() => onClick(item.id)}
              >
                <List.Item.Meta
                  title={
                    <a href="#">
                      {item.subject} {item.catalogNumber}.{item.section}
                      {item.courseName ? (
                        <div className="mt-[0.15rem] text-[14px] text-muted [font-family:var(--font-family)]">
                          {item.courseName}
                        </div>
                      ) : null}
                    </a>
                  }
                  // FIXME (no professor): non null assertion
                  description={`${item.instructor1!.last}, ${item.instructor1!.first} - ${
                    item.semester.season
                  } ${item.semester.year}`}
                />
              </List.Item>
              </React.Fragment>
              );
            }}
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 px-2.5 py-4 [font-family:var(--font-family)]">
              <PaginationButton
                disabled={page === 1}
                onClick={() => setPage(1)}
                aria-label="First page"
                title="First page"
              >
                <DoubleLeftOutlined />
              </PaginationButton>

              <PaginationButton
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                aria-label="Previous page"
                title="Previous page"
              >
                <LeftOutlined />
              </PaginationButton>

              {pageNumbers.map((pageNum) => (
                <PaginationButton
                  key={pageNum}
                  active={pageNum === page}
                  onClick={() => setPage(pageNum)}
                  title={`Page ${pageNum}`}
                >
                  {pageNum}
                </PaginationButton>
              ))}

              <PaginationButton
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                aria-label="Next page"
                title="Next page"
              >
                <RightOutlined />
              </PaginationButton>

              <PaginationButton
                disabled={page === totalPages}
                onClick={() => setPage(totalPages)}
                aria-label="Last page"
                title="Last page"
              >
                <DoubleRightOutlined />
              </PaginationButton>
            </div>
          )}
        </>
      );
    }
  } else if (loading) {
    return (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 5,
        }}
      >
        <List.Item className="section-list-loading-item">
          <Spin />
        </List.Item>
      </List>
    );
  } else if (error) {
    return errorMessage;
  } else {
    return emptyMessage;
  }
}

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

function PaginationButton({ active, disabled, className, children, ...rest }: PaginationButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`flex h-7 min-w-[28px] items-center justify-center rounded-sm border px-2 text-[14px] [font-family:var(--font-family)] focus:outline-none ${
        active
          ? "border-pagination-border-active bg-pagination-bg-active text-pagination-text-active cursor-pointer"
          : disabled
          ? "cursor-not-allowed border-pagination-border bg-pagination-bg-disabled text-pagination-text-disabled"
          : "cursor-pointer border-pagination-border bg-pagination-bg text-pagination-text hover:border-pagination-hover-border hover:bg-pagination-hover-bg hover:text-pagination-hover-text"
      } ${className ?? ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
