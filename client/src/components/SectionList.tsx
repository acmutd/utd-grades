import { FrownTwoTone, UserOutlined, LeftOutlined, RightOutlined, DoubleLeftOutlined, DoubleRightOutlined } from "@ant-design/icons";
import type { Grades } from "@utd-grades/db";
import { List, Popover as AntPopover, Spin } from "antd";
import React, { ReactNode, useEffect, useState } from "react";
import styled, { css } from "styled-components";
// FIXME (median)
// import { getLetterGrade, getLetterGradeColor } from "../utils";

const Item = styled(List.Item)<{ selected: boolean }>`
  padding: 25px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  cursor: pointer;
  transition: all 300ms ease-out;
  font-family: var(--font-family);

  &:hover {
    background-color: #fcfcfc;
  }

  &:first-child {
    border-top-left-radius: 5px;
  }

  & .ant-list-item-meta-title a {
    font-weight: 600;
    font-family: var(--font-family);
  }

  & .ant-list-item-meta {
    margin-bottom: 0px;
  }

  ${(props) => (props.selected ? selectedStyles : "")}
`;

const selectedStyles = css`
  border-right: 6px solid rgb(0, 116, 224) !important;
  box-shadow: inset -5px 0px 10px rgba(0, 0, 0, 0.05);
  background-color: #fcfcfc;
`;

const Hint = styled(AntPopover)`
  margin-top: 25px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  font-family: var(--font-family);
  color: #95989a;
`;

const Popover = styled.div`
  font-family: var(--font-family);
  width: 200px;
`;

const EmptyContainer = styled.div`
  padding: 30px;
`;

const Error = styled.p`
  font-family: var(--font-family);
  font-size: 22px;
  text-align: center;
  color: #a4a4a4;
  font-weight: 300;
`;

const StyledIcon = styled(FrownTwoTone)`
  font-size: 42px;
  width: 43px;
  margin-bottom: 15px;
  margin-left: auto;
  margin-right: auto;
  display: block !important;
`;

const LoadingItem = styled(List.Item)`
  &&& {
    padding-top: 40px;
    border: none !important;
    display: flex;
    justify-content: center;
    align-self: center;
  }
`;

const IconWrapper = styled.div`
  margin-right: 8;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 10px;
  font-family: var(--font-family);
`;

const PaginationButton = styled.button<{ active?: boolean; disabled?: boolean }>`
  min-width: 28px;
  height: 28px;
  padding: 0 8px;
  border: 1px solid ${props => props.active ? 'rgb(0, 116, 224)' : '#d9d9d9'};
  background: ${props => props.active ? 'rgb(0, 116, 224)' : props.disabled ? '#f5f5f5' : '#fff'};
  color: ${props => props.active ? '#fff' : props.disabled ? '#bfbfbf' : 'rgba(0, 0, 0, 0.85)'};
  border-radius: 2px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  font-family: var(--font-family);
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    ${props => !props.disabled && !props.active && css`
      border-color: rgb(0, 116, 224);
      color: rgb(0, 116, 224);
    `}
  }

  &:focus {
    outline: none;
  }
`;

// FIXME (median)
// const AverageWrapper = styled.div<{ average: number }>`
//   color: ${(p) => getLetterGradeColor(getLetterGrade(p.average))};
//   font-weight: bold;
// `;

interface IconTextProps {
  icon: ReactNode;
  child: ReactNode;
}

const IconText = ({ icon, child }: IconTextProps) => (
  <span>
    <IconWrapper>{icon}</IconWrapper>
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
    <Popover>
      <p>
        Because of FERPA restrictions, grade data for certain classes — in particular, classes with
        a small number of students — is unavailable.
      </p>
    </Popover>
  );

  const emptyMessage = (
    <EmptyContainer>
      <StyledIcon />
      <Error>We weren&apos;t able to find that. Try searching for something else!</Error>
      <Hint content={popover} placement="bottom">
        <span style={{ textAlign: "center" }}>
          Still can&apos;t find what you&apos;re looking for?{" "}
          <span style={{ textDecoration: "underline" }}>Learn more.</span>
        </span>
      </Hint>
    </EmptyContainer>
  );

  const errorMessage = (
    <EmptyContainer>
      <StyledIcon />
      <Error>We had trouble getting that for you, please try again.</Error>
    </EmptyContainer>
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
            renderItem={(item) => (
              <Item
                key={item.id}
                selected={item.id == id}
                actions={[
                  <IconText
                    icon={<UserOutlined />}
                    child={item.totalStudents.toString()}
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
                    </a>
                  }
                  // FIXME (no professor): non null assertion
                  description={`${item.instructor1!.last}, ${item.instructor1!.first} - ${
                    item.semester.season
                  } ${item.semester.year}`}
                />
              </Item>
            )}
          />
          {totalPages > 1 && (
            <PaginationContainer>
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
            </PaginationContainer>
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
        <LoadingItem>
          <Spin />
        </LoadingItem>
      </List>
    );
  } else if (error) {
    return errorMessage;
  } else {
    return emptyMessage;
  }
}