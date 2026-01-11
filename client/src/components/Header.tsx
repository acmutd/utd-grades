import { HomeOutlined } from "@ant-design/icons";
import { Button, Row } from "antd";
import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
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
  color: var(--text-color);
  svg {
    color: inherit;
  }
  visibility: ${(props) => (props.$dummy ? "hidden" : "visible")};
`;

const Toggle = styled(Button)`
  background: none;
  outline: none;
  border: none;
  cursor: pointer;
  box-shadow: none;
  color: var(--muted-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  svg {
    width: 18px;
    height: 18px;
  }
`;

const HeaderText = styled.a`
  margin-right: auto;
  margin-left: auto;
  display: block;

  & h2 {
    color: var(--text-color);
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
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "dark";
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    } catch (e) {
      // ignore during SSR
    }
  }, [theme]);

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
          <Image
            src={theme === "light" ? "/ACMDev-logo.svg" : "/ACMDev-logo-white.svg"}
            alt="ACM Dev Logo"
            width={24}
            height={24}
            style={Logo}
          />
          <HeaderBold>UTD</HeaderBold> <HeaderLight>GRADES</HeaderLight>
        </h2>
      </HeaderText>
      <Toggle
        onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        type="ghost"
        shape="circle"
        size="large"
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M6.76 4.84l-1.8-1.79L3.17 4.83l1.79 1.79 1.8-1.78zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm7.03-2.03l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM17.24 4.84l1.8-1.79L19.83 1.2l-1.79 1.79-0.8 1.85zM12 6a6 6 0 100 12 6 6 0 000-12z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor" />
          </svg>
        )}
      </Toggle>
    </Menu>
  );
}
