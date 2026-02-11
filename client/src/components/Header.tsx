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
  justify-content: space-between;
  width: 100%;
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
  &:hover,
  &:focus,
  &:active {
    color: rgb(198, 198, 198) !important;
    background: none !important;
  }

  &:hover .anticon,
  &:focus .anticon,
  &:active .anticon {
    color: rgb(198, 198, 198) !important;
  }
`;

const ThemeToggle = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 9999px;
  border: 1px solid var(--toggle-border, #e4e4e7);
  background: var(--toggle-bg, #ffffff);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--toggle-hover-bg, #f4f4f5);
    color: var(--toggle-hover-color, #333333);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #727272;
    }
  }
`;

const SunIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);



const HeaderText = styled.a`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: block;

  & h2 {
    color: var(--header-color);
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
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "light";
  });

  const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

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
        <ThemeToggle onClick={toggleTheme} aria-label="Toggle Dark Mode">
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </ThemeToggle>
    </Menu>
  );
}
