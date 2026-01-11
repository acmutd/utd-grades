import { Col } from "antd";
import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button } from "antd";
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
  color: var(--text-color);
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
  color: var(--muted-text);
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
  color: var(--muted-text);
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

const PageToggle = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  box-shadow: none;
  color: var(--muted-text);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  svg { width: 18px; height: 18px; }
`;



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

  function handleSubmit({ search }: SearchQuery) {
    (async function () {
      await Router.push({
        pathname: "/results",
        query: { search },
      });
    })();
  }

  return (
    <Core>
      <Content>
        <PageToggle
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
        </PageToggle>
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
                  <ByACM>by <HeaderBold>ACM</HeaderBold></ByACM>
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
