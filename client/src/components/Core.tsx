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
  padding-top: 150px;
  padding-bottom: 15px;

  @media (max-width: 992px) {
    & {
      padding-top: 15px;
    }
  }
`;

const SageLink = styled.a`
  background: linear-gradient(90deg, rgba(7,67,37,1) 0%, rgba(22,50,36,1) 100%);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 1rem 2rem;
  margin-bottom: 0.5rem;
  border-radius: 100rem;
  color: #5AED86;
  text-shadow: 0 0 4px rgb(0 0 0 / 0.6);
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.2);
  transition: transform cubic-bezier(0.4, 0, 0.2, 1) 150ms, box-shadow cubic-bezier(0.4, 0, 0.2, 1) 150ms;
  &:hover {
    color: #5AED86;
    box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
    transform: scale(1.01);
  }
`;

const SageText = styled.p`
  line-height: 1.375rem;
  margin-bottom: 0;
`;

const BuiltWithLove = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  margin: 0.5rem 0;
  font-weight: 550;
`;

const SageLogo = styled.img`
  height: 1.5rem;
  margin-right: 0.5rem;
  filter: drop-shadow(0 0 4px rgb(0 0 0 / 0.6));
`;

const SageTextMark = styled.img`
  height: 1.375rem;
`

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
        <SageLink href="https://utdsage.com/" target={"blank"}>
          <SageLogo src="/SAGE-Logo.svg" />
          <SageText>Get AI-powered UTD advising with </SageText>
          <SageTextMark src="/SAGE-Textmark.svg" />
        </SageLink>
        <BuiltWithLove>
          Built with <HeartTwoTone twoToneColor="#eb2f96" /> by{" "}
          <a href="https://www.acmutd.co" target={"blank"}>ACM Dev</a>
        </BuiltWithLove>
        <p>
          Designed by <a href="https://www.arimilli.io" target={"blank"}>Bharat Arimilli</a>. Thanks to{" "}
          <a href="https://garrettgu.com/" target={"blank"}>Garrett Gu</a>,{" "}
          <a href="https://jeffw.xyz/" target={"blank"}>Jeffrey Wang</a>,{" "}
          <a href="https://www.linkedin.com/in/josephwickline/" target={"blank"}>Joseph Wickline</a> and our{" "}
          <Popover content={donors}>
            <span style={{ textDecoration: "underline" }}>donors</span>.
          </Popover>

          <a href="https://github.com/acmutd/utd-grades/tree/master/raw_data" target={"blank"}> Raw data available for download</a>

        </p>
      </Footer>
    </Container>
  );
}

export default Core;
