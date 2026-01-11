import { HeartTwoTone } from "@ant-design/icons";
import { Popover } from "antd";
import type { ReactNode } from "react";
import { useEffect } from "react";
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

const SageLink = styled.a`
  background: linear-gradient(90deg, rgba(7,67,37,1) 0%, rgba(22,50,36,1) 100%);
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.6rem 1.2rem;
  margin-bottom: 0.3rem;
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
  line-height: 1.2rem;
  margin-bottom: 0;
  font-size: 0.9rem;
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

const SageLogo = styled.img`
  height: 1.2rem;
  margin-right: 0.4rem;
  filter: drop-shadow(0 0 4px rgb(0 0 0 / 0.6));
`;

const SageTextMark = styled.img`
  height: 1.2rem;
`

const CreditsText = styled.p`
  font-size: 0.9rem;
  margin: 0.2rem 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

interface CoreProps {
  children: ReactNode;
}

function Core({ children }: CoreProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)
      ) {
        return;
      }

      if (!(event.ctrlKey || event.metaKey)) return;

      const keyIsSlash = event.key === "/" || event.code === "Slash";
      if (!keyIsSlash) return;

      event.preventDefault();

      const inputEl = document.getElementById("search-bar");
      let input: HTMLInputElement | null = null;

      if (inputEl) {
        if (inputEl instanceof HTMLInputElement) {
          input = inputEl;
        } else {
          input = inputEl.querySelector<HTMLInputElement>("input");
        }
      }

      if (!input) {
        input = document.querySelector<HTMLInputElement>(
          ".ant-input-search input, input#search-bar, input[placeholder^=\"ex. CS\"]"
        );
      }

      if (input) {
        input.focus();
        try {
          const len = input.value ? input.value.length : 0;
          input.setSelectionRange(len, len);
        } catch (e) {
          // ignore 
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
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
        <CreditsText>
          Designed by <a href="https://www.arimilli.io" target={"blank"}>Bharat Arimilli</a>. Thanks to{" "}
          <a href="https://garrettgu.com/" target={"blank"}>Garrett Gu</a>,{" "}
          <a href="https://jeffw.xyz/" target={"blank"}>Jeffrey Wang</a>,{" "}
          <a href="https://www.linkedin.com/in/josephwickline/" target={"blank"}>Joseph Wickline</a> and our{" "}
          <Popover content={donors}>
            <span style={{ textDecoration: "underline" }}>donors</span>.
          </Popover>

          <a href="https://github.com/acmutd/utd-grades/tree/master/raw_data" target={"blank"}> Raw data available for download</a>

        </CreditsText>
      </Footer>
    </Container>
  );
}

export default Core;
