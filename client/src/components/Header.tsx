import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState, type ReactNode } from "react";

const SunIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = () => (
  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

export default function Header({ center }: { center: ReactNode }) {
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

  return (
    <header className="grid w-full grid-cols-[1fr_minmax(0,520px)_1fr] items-center gap-x-6 px-[30px] pb-[30px] pt-5 max-992:grid-cols-[1fr_auto] max-992:gap-y-4">
      <Link href="/">
        <a className="block justify-self-start">
          <h2 className="mb-0 flex items-center gap-2 text-[27px] font-light tracking-[2px] text-header">
            <Image
              src={theme === "light" ? "/ACMDev-logo.svg" : "/ACMDev-logo-white.svg"}
              alt="ACM Dev Logo"
              width={56}
              height={56}
            />
            <span className="font-gilroy-bold font-bold">UTD</span>{" "}
            <span className="font-gilroy-light">GRADES</span>
          </h2>
        </a>
      </Link>
      <div className="max-992:col-span-2 max-992:row-start-2">{center}</div>
      <button
        onClick={toggleTheme}
        aria-label="Toggle Dark Mode"
        className="flex h-9 w-9 justify-self-end items-center justify-center rounded-full border border-[var(--toggle-border)] bg-[var(--toggle-bg)] text-fg [transition:all_0.2s_ease] hover:bg-[var(--toggle-hover-bg)] hover:text-[#727272]"
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}
