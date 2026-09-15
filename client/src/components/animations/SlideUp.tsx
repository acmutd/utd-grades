import type { ReactNode } from "react";
import Animation from "./Animation";

interface SlideUpProps {
  delay: number;
  children: ReactNode;
}

export default function FadeIn({ delay, children }: SlideUpProps) {
  return (
    <Animation animation="slideUp" delay={delay}>
      {children}
    </Animation>
  );
}
