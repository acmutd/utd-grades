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
  box-shadow: none;
  color: #ffffff;
  svg {
    color: inherit;
  }
  visibility: ${(props) => (props.$dummy ? "hidden" : "visible")};
`;

const HeaderText = styled.a`
  margin-right: auto;
  margin-left: auto;
  display: block;

  & h2 {
    color: #E5E5E5;
    font-weight: 300;
    letter-spacing: 2px;
    font-size: 24px;
    margin-bottom: 0px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const HeaderBold = styled.span`
  font-family: 'Gilroy-Bold', sans-serif;
  font-weight: 700;
`;

const HeaderLight = styled.span`
  font-family: 'Gilroy-Light', sans-serif;
`;

const Logo = {
  height: "36px",
  width: "36px",
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
          <Image src="/ACMDev-logo-white.svg" alt="ACM Dev Logo" width={24} height={24} style={Logo} /> <HeaderBold>UTD</HeaderBold> <HeaderLight>GRADES</HeaderLight>
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
