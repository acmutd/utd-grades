import { HeartTwoTone } from "@ant-design/icons";
import { Popover } from "antd";
import type { ReactNode } from "react";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;
  flex: 1;
  position: relative;
  display: flex;
  align-items: stretch;
`;

const Footer = styled.div`
  text-align: center;
  width: 100%;
  display: block;
  font-family: var(--font-family);
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 30px;
  padding-bottom: 15px;

  @media (max-width: 992px) {
    & {
      padding-top: 20px;
    }
  }
`;

const BuiltWithLove = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin: 0.3rem 0;
  font-weight: 550;
`;

const CreditsText = styled.p`
  font-family: 'Gilroy-Bold', sans-serif;
  color: white;
  margin: 0.2rem 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

interface CoreProps {
  children: ReactNode;
}

function Core({ children }: CoreProps) {
  const donors = (
    <div style={{ width: "300px" }}>
      <p>
        Thank you to the following people for donating and making this possible (in order of most
        monetary support): Anthony-Tien Huynh, Adam Butcher, Paul Denino, Thomas Sowders, Xavier
        Brown, Enza Denino, David Garvin, Alastair Feille, Andrew Vaccaro and other anonymous
        donors.
      </p>
    </div>
  );

  return (
    <Container>
      <Body>{children}</Body>
      <Footer>
        {/*<BuiltWithLove>
          Built with <HeartTwoTone twoToneColor="#eb2f96" /> by{" "}
          <a href="https://www.acmutd.co" target={"blank"}>ACM Dev</a>
        </BuiltWithLove>*/}
        <CreditsText>
         {/*Designed by <a href="https://www.arimilli.io" target={"blank"}>Bharat Arimilli</a>. Thanks to{" "}
          <a href="https://garrettgu.com/" target={"blank"}>Garrett Gu</a>,{" "}
          <a href="https://jeffw.xyz/" target={"blank"}>Jeffrey Wang</a>,{" "}
          <a href="https://www.linkedin.com/in/josephwickline/" target={"blank"}>Joseph Wickline</a> and our{" "}
          <Popover content={donors}>
            <span style={{ textDecoration: "underline" }}>donors</span>.
          </Popover>*/}
          See the full source code on our
          <a href="https://github.com/acmutd/utd-grades" target={"blank"}> GitHub</a>

        </CreditsText>
      </Footer>
    </Container>
  );
}

export default Core;
