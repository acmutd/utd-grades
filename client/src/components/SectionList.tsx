import { FrownTwoTone, UserOutlined, LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import type { Grades } from "@utd-grades/db";
import { List, Popover, Spin } from "antd";
import React, { ReactNode} from "react";
// FIXME (median)
// import { getLetterGrade, getLetterGradeColor } from "../utils";

interface IconTextProps {
  icon: ReactNode;
  child: ReactNode;
}

const IconText = ({ icon, child }: IconTextProps) => (
  <span>
    <span className="mr-2 text-description">{icon}</span>
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
}

export function SectionList({ loading, id, data, onClick, error, page, setPage }: SectionListProps) {
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

      return (
                <>
          <List<Grades>
            itemLayout="vertical"
            size="large"
            dataSource={currentPageData}
            style={{ width: "100%", minWidth: "100%" }}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                className={`section-list-item ${item.id == id ? "section-list-item--selected" : ""}`}
                actions={[
                  <IconText
                    icon={<UserOutlined />}
                    child={<span className="text-description">{item.totalStudents.toString()}</span>}
                    key="students-total"
                  />,
                  // FIXME (median)
                  // <IconText
                  //   icon={<BarChartOutlined />}
                  //   child={
                  //     <AverageWrapper average={item.average}>
                  //       {getLetterGrade(item.average)}
                  //     </AverageWrapper>
                  //   }
                  //   key="average"
                  // />,
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
            )}
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
