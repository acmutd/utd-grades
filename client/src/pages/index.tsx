import { Col } from "antd";
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

const Header = styled.h2`
  font-family: var(--font-family);
  text-transform: uppercase;
  text-align: center;
  color: rgb(78, 78, 78);
  font-weight: 300;
  letter-spacing: 2px;
  font-size: 26px;
  margin-bottom: 20px;
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

const SmallFont = styled.span`
   font-size: 12px;
`;

const Logo = {
  height: "36px",
  width: "36px",
  marginTop: "-8px",

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
          <Col lg={{ span: 10, offset: 7}} xs={{ span: 20, offset: 2 }}>
            <FadeIn delay={0}>
              <Header>
                <img src="/ACMDev-logo.png" style={Logo}/> <HeaderBold>UTD</HeaderBold> Grades <SmallFont> by <HeaderBold>ACM</HeaderBold></SmallFont>
              </Header>
            </FadeIn>
            <FadeIn delay={300}>
              <Description>
                See how students did in any given class. And it's<strong> free, forever.</strong>
              </Description>
            </FadeIn>
            <Search onSubmit={handleSubmit} />
          </Col>
        </Main>
      </Content>
    </Core>
  );
}
