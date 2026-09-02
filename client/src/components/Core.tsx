import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import SageAd from "./SageAd";

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

/*const BuiltWithLove = styled.p`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  margin: 0.3rem 0;
  font-weight: 550;
`;*/

const CreditsText = styled.p`
  font-family: 'Gilroy-Bold', sans-serif;
  color: var(--muted-text);
  margin: 0.2rem 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const GitHubLink = styled.a`
  color: var(--link-color) !important;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

interface CoreProps {
  children: ReactNode;
  showSageAd?: boolean;
}

function Core({ children, showSageAd = false }: CoreProps) {
  const [, setTheme] = useState<"light" | "dark" | null>(null);

  // Initialize theme on start
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = prefersDark ? "dark" : "light";
    setTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  useEffect(() => {
    const handleThemeChange = (e: StorageEvent) => {
      if ((e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue);
        document.documentElement.setAttribute("data-theme", e.newValue);
      }
    };

    window.addEventListener("storage", handleThemeChange);
    return () => window.removeEventListener("storage", handleThemeChange);
  }, []);
  
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

  return (
    <Container>
      <Body>{children}</Body>
      <Footer>
        {showSageAd && <SageAd />}
        <CreditsText>
         {/*Designed by <a href="https://www.arimilli.io" target={"blank"}>Bharat Arimilli</a>. Thanks to{" "}
          <a href="https://garrettgu.com/" target={"blank"}>Garrett Gu</a>,{" "}
          <a href="https://jeffw.xyz/" target={"blank"}>Jeffrey Wang</a>,{" "}
          <a href="https://www.linkedin.com/in/josephwickline/" target={"blank"}>Joseph Wickline</a> and our{" "}
          <Popover content={donors}>
            <span style={{ textDecoration: "underline" }}>donors</span>.
          </Popover>*/}
          See the full source code on our <GitHubLink href="https://github.com/acmutd/utd-grades" target="_blank">GitHub</GitHubLink>

        </CreditsText>
      </Footer>
    </Container>
  );
}

export default Core;
