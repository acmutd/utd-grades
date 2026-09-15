import { Col } from "antd";
import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import FadeIn from "../components/animations/FadeIn";
import Core from "../components/Core";
import Search from "../components/Search";
import type { SearchQuery } from "../types";

const Logo = {
  height: "52px",
  width: "52px",
  flexShrink: 0,
};

const SunIcon = () => (
  <svg
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    className="h-4 w-4"
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
    className="h-4 w-4"
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
      <div className="relative flex w-full items-center">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[--toggle-border,#e4e4e7] bg-[--toggle-bg] text-fg [transition:all_0.2s_ease] hover:bg-[--toggle-hover-bg] hover:text-[--toggle-hover-color,#333333] [@media(prefers-color-scheme:light)]:border-white/10 [@media(prefers-color-scheme:light)]:bg-white/5 [@media(prefers-color-scheme:light)]:hover:bg-white/10 [@media(prefers-color-scheme:light)]:hover:text-[#727272]"
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
        <div className="mt-[50px] w-full">
          <Col lg={{ span: 10, offset: 7 }} xs={{ span: 20, offset: 2 }}>
            <FadeIn delay={0}>
              <h1 className="mb-5 flex items-center justify-center gap-4 text-center font-gilroy text-[48px] font-light uppercase tracking-[3px] text-header max-1212:gap-3 max-1212:text-[36px] max-1212:tracking-[2px] max-768:gap-3 max-768:text-[36px] max-768:tracking-[2px] max-480:gap-2 max-480:text-[28px] max-480:tracking-[1px] max-380:gap-2 max-380:text-[20px] max-380:tracking-[1px]">
                <div className="h-[52px] w-[52px] flex-shrink-0 max-768:h-10 max-768:w-10 max-480:h-[34px] max-480:w-[34px]">
                <Image
                  src={theme === "light" ? "/ACMDev-logo.svg" : "/ACMDev-logo-white.svg"}
                  alt="ACM Dev Logo"
                  width={52}
                  height={52}
                  style={Logo}
                />
                </div>

                <div>
                  <span className="font-gilroy-bold font-bold">UTD</span> <span className="font-gilroy-light font-light">GRADES</span>
                  <span className="ml-3 text-[16px] font-normal tracking-[1px] text-[rgb(159,159,159)] max-768:ml-2 max-768:text-[14px] max-480:ml-1.5 max-480:text-[12px]">
                    by <span className="font-gilroy-bold font-bold">ACM Dev</span>
                  </span>
                </div>
              </h1>
            </FadeIn>
            <FadeIn delay={300}>
              <p className="mb-[30px] text-center text-[18px] font-gilroy-regular font-normal text-description [&_strong]:font-gilroy-bold max-320:text-[14px]">
                See how students did in any given class. And it&apos;s <strong>free, forever.</strong>
              </p>
            </FadeIn>
            <Search onSubmit={handleSubmit} showSage={false} />
          </Col>
        </div>
      </div>
    </Core>
  );
}
