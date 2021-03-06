import React from 'react';
import styled from 'styled-components';
import { Row, Button } from 'antd';
import Router from 'next/router';
import { HomeOutlined } from '@ant-design/icons';

const Menu = styled(Row)`
  padding: 30px;
  display: flex;
  align-items: center;
`;

const Back = styled(Button)`
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
  outline: none;
  border: none;
  box-shadow: none;
  visibility: ${props => props.dummy ? 'hidden' : 'visible'};
`;

const HeaderText = styled.a`
  margin-right: auto;
  margin-left: auto;
  display: block;  

  & h2 {
    font-family: var(--font-family);
    text-transform: uppercase;
    color: rgb(78, 78, 78);
    font-weight: 300;
    letter-spacing: 2px;
    font-size: 24px;
    margin-bottom: 0px;
  }
`;

const HeaderBold = styled.span`
  font-weight: 700;
`;

export default function Header() {
  function goHome() {
    Router.push('/');
  }

  return (
    <Menu>
      <Back onClick={goHome} type="ghost" icon={<HomeOutlined />} shape="circle" size="large" />
      <HeaderText href="#" onClick={goHome}><h2><HeaderBold>UTD</HeaderBold> Grades</h2></HeaderText>
      <Back dummy={true} onClick={goHome} type="ghost" icon={<HomeOutlined />} shape="circle" size="large" />
    </Menu>
  );
}
