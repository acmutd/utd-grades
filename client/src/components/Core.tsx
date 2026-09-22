import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import SageAd from "./SageAd";

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
    <div className="relative flex min-h-full w-full flex-col">
      <div className="flex h-full w-full flex-1 items-stretch">{children}</div>
      <div className="w-full px-2.5 pb-[15px] pt-[30px] text-center font-[family-name:var(--font-family)] max-992:pt-5">
        {showSageAd && <SageAd />}
        <p className="my-[0.2rem] font-gilroy-bold text-muted max-768:hidden">
         {/*Designed by <a href="https://www.arimilli.io" target={"blank"}>Bharat Arimilli</a>. Thanks to{" "}
          <a href="https://garrettgu.com/" target={"blank"}>Garrett Gu</a>,{" "}
          <a href="https://jeffw.xyz/" target={"blank"}>Jeffrey Wang</a>,{" "}
          <a href="https://www.linkedin.com/in/josephwickline/" target={"blank"}>Joseph Wickline</a> and our{" "}
          <Popover content={donors}>
            <span style={{ textDecoration: "underline" }}>donors</span>.
          </Popover>*/}
          See the full source code on our{" "}
          <a
            href="https://github.com/acmutd/utd-grades"
            target="_blank"
            rel="noreferrer"
            className="!text-link no-underline hover:underline"
          >
            GitHub
          </a>
        </p>
      </div>
    </div>
  );
}

export default Core;
