import { Col } from "antd";
import Image from "next/image";
import Router from "next/router";
import React from "react";
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
  font-family: var(--font-family);
  text-transform: uppercase;
  text-align: center;
  color: rgb(78, 78, 78);
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
  font-family: var(--font-family);
  text-align: center;
  color: #95989a;
  font-weight: 400;
  font-size: 18px;
  margin-bottom: 30px;
`;

const HeaderBold = styled.span`
  font-weight: 700;
`;

const ByACM = styled.span`
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 1px;
  color: #95989a;
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



export default function Home() {
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
        <Main>
          <Col lg={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
            <FadeIn delay={0}>
              <Header>
                <Image src="/ACMDev-logo.png" alt="ACM Dev Logo" width={52} height={52} style={Logo} />
                <div>
                  <HeaderBold>UTD</HeaderBold> GRADES
                  <ByACM>by <HeaderBold>ACM</HeaderBold></ByACM>
                </div>
              </Header>
            </FadeIn>
            <FadeIn delay={300}>
              <Description>
                See how students did in any given class. And it&apos;s<strong> free, forever.</strong>
              </Description>
            </FadeIn>
            <Search onSubmit={handleSubmit} />
          </Col>
        </Main>
      </Content>
    </Core>
  );
}
