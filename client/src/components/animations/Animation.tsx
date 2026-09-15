import type { ReactNode } from "react";

interface AnimationProps {
  animation: "fadeIn" | "slideUp";
  delay: number;
  children: ReactNode;
}

export default function Animation({ animation, delay, children }: AnimationProps) {
  return (
    // Use random key to force animation to play on re-render
    <div
      key={Math.random()}
      className={animation === "fadeIn" ? "animate-fadeIn" : "animate-slideUp"}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
