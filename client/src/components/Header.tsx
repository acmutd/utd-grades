import { HomeOutlined } from "@ant-design/icons";
import { Button, Row } from "antd";
import Router from "next/router";
import React from "react";
import styled from "styled-components";

const Menu = styled(Row)`
  padding: 30px;
  display: flex;
  align-items: center;
`;

const Back = styled(Button)<{ $dummy?: boolean }>`
  color: var(--text-color-primary);
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
  outline: none;
  border: none;
  box-shadow: none;
  visibility: ${(props) => (props.$dummy ? "hidden" : "visible")};
`;

const HeaderText = styled.a`
  margin-right: auto;
  margin-left: auto;
  display: block;

  & h2 {
    font-family: var(--font-family);
    text-transform: uppercase;
    background-color: var(--background-color);
    color: var(--text-color-primary);
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
    (async function () {
      await Router.push("/");
    })();
  }

  return (
    <Menu>
      <Back onClick={goHome} type="ghost" icon={<HomeOutlined />} shape="circle" size="large" />
      <HeaderText href="#" onClick={goHome}>
        <h2>
          <HeaderBold>UTD</HeaderBold> Grades
        </h2>
      </HeaderText>
      <Back
        $dummy
        onClick={goHome}
        type="ghost"
        icon={<HomeOutlined />}
        shape="circle"
        size="large"
      />
    </Menu>
  );
}
