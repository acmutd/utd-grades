import { HomeOutlined } from "@ant-design/icons";
import { Button, Row, Segmented } from "antd";
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

const ThemeSegmented = styled(Segmented)`
  position: relative;
  background: var(--toggle-bg);
  border: none;
  border-radius: 999px;
  box-shadow: none;
  color: var(--card-bg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  svg { width: 18px; height: 18px; }

  .ant-segmented-item {
    background: none;  
    border-radius: 999px;
    padding: 4px 14px;
    color: var(--text-color);
    opacity: 0.5;
    font-weight: 500;
  }

  .ant-segmented-item-selected {
    background: var(--result-container-bg);
    opacity: 1;
  }
`;



const HeaderText = styled.a`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "light";
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
        <ThemeSegmented
          value={theme}
          onChange={(value) => setTheme(value as "light" | "dark")}
          options={[
            {
              value: "light",
              label: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden>
                    <path
                      d="M6.76 4.84l-1.8-1.79L3.17 4.83l1.79 1.79 1.8-1.78zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm7.03-2.03l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79zM12 6a6 6 0 100 12 6 6 0 000-12z"
                      fill="currentColor"
                    />
                  </svg>
                  Light
                </span>
              ),
            },
            {
              value: "dark",
              label: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden>
                    <path
                      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                      fill="currentColor"
                    />
                  </svg>
                  Dark
                </span>
              ),
            },
          ]}
        />
    </Menu>
  );
}
