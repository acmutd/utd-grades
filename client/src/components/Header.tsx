import { HomeOutlined } from "@ant-design/icons";
import { Button, Row } from "antd";
import Image from "next/image";
import Router from "next/router";
import React from "react";
import styled from "styled-components";

const Menu = styled(Row)`
  padding: 30px;
  display: flex;
  align-items: center;
`;

const Back = styled(Button) <{ $dummy?: boolean }>`
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

const Logo = {
  height: "36px",
  width: "36px",
  marginTop: "-8px",
};

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
          <Image src="/ACMDev-logo.png" alt="ACM Dev Logo" width={24} height={24} style={Logo} /> <HeaderBold>UTD</HeaderBold> Grades
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
