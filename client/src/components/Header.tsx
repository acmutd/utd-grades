import { HomeOutlined } from "@ant-design/icons";
import { Button, Row } from "antd";
import Image from "next/image";
import Router from "next/router";
import React, { useEffect, useState } from "react";

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

const Logo = {
  height: "36px",
  width: "36px",
};

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("theme");
    if (saved === "light" || saved === "dark") return saved;
    return "light";
  });

  const toggleTheme = () => {
      setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
    };

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
    } catch (e) {
      // ignore during SSR
    }
  }, [theme]);

  function goHome() {
    (async function () {
      await Router.push("/");
    })();
  }

  return (
    <Row className="flex w-full items-center justify-between p-[30px]">
      <Button
        onClick={goHome}
        type="ghost"
        icon={<HomeOutlined />}
        shape="circle"
        size="large"
        className="header-back-btn"
      />
      <a
        href="#"
        onClick={goHome}
        className="absolute left-1/2 block -translate-x-1/2"
      >
        <h2 className="mb-0 flex items-center gap-2 text-[24px] font-light tracking-[2px] text-header">
          <Image
            src={theme === "light" ? "/ACMDev-logo.svg" : "/ACMDev-logo-white.svg"}
            alt="ACM Dev Logo"
            width={24}
            height={24}
            style={Logo}
          />
          <span className="font-gilroy-bold font-bold">UTD</span>{" "}
          <span className="font-gilroy-light">GRADES</span>
        </h2>
      </a>
      <button
        onClick={toggleTheme}
        aria-label="Toggle Dark Mode"
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-[--toggle-border,#e4e4e7] bg-[--toggle-bg] text-fg transition-all duration-200 ease-in-out hover:bg-[--toggle-hover-bg] hover:text-[--toggle-hover-color,#333333] [@media(prefers-color-scheme:light)]:border-white/10 [@media(prefers-color-scheme:light)]:bg-white/5 [@media(prefers-color-scheme:light)]:hover:bg-white/10 [@media(prefers-color-scheme:light)]:hover:text-[#727272]"
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </Row>
  );
}
