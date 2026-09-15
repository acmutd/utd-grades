import type { ReactNode } from "react";
import Animation from "./Animation";

interface FadeInProps {
  delay: number;
  children: ReactNode;
}

export default function FadeIn({ delay, children }: FadeInProps) {
  return (
    <Animation animation="fadeIn" delay={delay}>
      {children}
    </Animation>
  );
}
