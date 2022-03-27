import React, { useState, useEffect } from 'react';
import { List, Spin, Popover as AntPopover } from 'antd';
import { FrownTwoTone, UserOutlined } from '@ant-design/icons';
import general from '../../../../utils/general';
import styled, { css } from 'styled-components';

const Item = styled(List.Item)`
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

  ${(props) => (props.selected ? selectedStyles : '')}
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

const IconText = ({ icon, text }) => (
  <span>
    {React.createElement(icon, { style: { marginRight: 8 } })}
    {text}
  </span>
);

export default function ResultsList({ loading, id, data, onClick, error }) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [data]);

  const popover = (
    <Popover>
      <p>
        Because of FERPA restrictions, grade data for certain classes — in
        particular, classes with a small number of students — is unavailable.
      </p>
    </Popover>
  );

  const emptyMessage = (
    <EmptyContainer>
      <StyledIcon />
      <Error>
        We weren&apos;t able to find that. Try searching for something else!
      </Error>
      <Hint content={popover} placement="bottom">
        <span style={{ textAlign: 'center' }}>
          Still can&apos;t find what you&apos;re looking for?{' '}
          <span style={{ textDecoration: 'underline' }}>Learn more.</span>
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
      return (
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            pageSize: 8,
            style: {
              marginRight: '10px',
            },
            showSizeChanger: false,
            current: page,
            onChange: (page) => setPage(page),
          }}
          dataSource={data}
          renderItem={(item) => {
            const totalStudents = general.getTotalStudents(item);

            return (
              <Item
                key={item.id}
                selected={item.id == id}
                actions={[
                  <IconText
                    icon={UserOutlined}
                    text={totalStudents}
                    key="students-total"
                  />,
                ]}
                onClick={() => onClick(item.id)}
              >
                <List.Item.Meta
                  title={
                    <a href="#">
                      {item.subject.name} {item.catalogNumber.name}.
                      {item.section.name}
                    </a>
                  }
                  description={`${item.instructor1.last}, ${item.instructor1.first} - ${item.semester.name}`}
                />
              </Item>
            );
          }}
        />
      );
    }
  } else if (loading) {
    return (
      <List
        itemLayout="vertical"
        size="large"
        pagination={{
          pageSize: 8,
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
