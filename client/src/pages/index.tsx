import { Col } from "antd";
import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import FadeIn from "../components/animations/FadeIn";
import Core from "../components/Core";
import Search from "../components/Search";
import type { SearchQuery } from "../types";

const Content = styled.div`
  display: block;
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const Main = styled.div`
  width: 100%;
  margin-top: 50px;
`;

const Header = styled.h1`
  font-family: Gilroy, sans-serif;
  text-transform: uppercase;
  text-align: center;
  color: var(--header-color);
  font-weight: 300;
  letter-spacing: 3px;
  font-size: 48px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  
  @media (max-width: 768px) {
    font-size: 36px;
    letter-spacing: 2px;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 28px;
    letter-spacing: 1px;
    gap: 8px;
  }
`;

const Description = styled.p`
  font-family: 'Gilroy-Regular', sans-serif;
  text-align: center;
  color: var(--description-color);
  font-weight: 400;
  font-size: 18px;
  margin-bottom: 30px;

   strong {
    font-family: 'Gilroy-Bold', sans-serif;
  }
`;

const HeaderBold = styled.span`
  font-family: 'Gilroy-Bold', sans-serif;
  font-weight: 700;
`;
const HeaderLight = styled.span`
  font-family: 'Gilroy-Light', sans-serif;
  font-weight: 300;
`;

const ByACM = styled.span`
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 1px;
  color: rgb(159, 159, 159);
  margin-left: 12px;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin-left: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 12px;
    margin-left: 6px;
  }
`;

const Logo = {
  height: "52px",
  width: "52px",
  flexShrink: 0,
};

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
  background: var(--toggle-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--toggle-hover-bg);
    color: var(--toggle-hover-color, #333333);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (prefers-color-scheme: light) {
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



export default function Home() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      if (typeof window === "undefined") return "dark";
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
      const docTheme = document.documentElement.getAttribute("data-theme");
      if (docTheme === "light" || docTheme === "dark") return docTheme;
    } catch (e) {
      /* ignore */
    }
    return "dark";
  });

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    } catch (e) {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  function handleSubmit({ search }: SearchQuery) {
    (async function () {
      await Router.push({
        pathname: "/results",
        query: { search },
      });
    })();
  }

  return (
    <Core showSageAd={true}>
      <Content>
        <ThemeToggle onClick={toggleTheme} aria-label="Toggle Dark Mode">
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </ThemeToggle>
        <Main>
          <Col lg={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
            <FadeIn delay={0}>
              <Header>
                <Image
                  src={theme === "light" ? "/ACMDev-logo.svg" : "/ACMDev-logo-white.svg"}
                  alt="ACM Dev Logo"
                  width={52}
                  height={52}
                  style={Logo}
                />
                <div>
                  <HeaderBold>UTD</HeaderBold> <HeaderLight>GRADES</HeaderLight>
                  <ByACM>by <HeaderBold>ACM Dev</HeaderBold></ByACM>
                </div>
              </Header>
            </FadeIn>
            <FadeIn delay={300}>
              <Description>
                See how students did in any given class. And it&apos;s <strong>free, forever.</strong>
              </Description>
            </FadeIn>
            <Search onSubmit={handleSubmit} />
          </Col>
        </Main>
      </Content>
    </Core>
  );
}
