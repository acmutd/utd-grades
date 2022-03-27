import { type ReactNode } from 'react';
import { keyframes } from 'styled-components';
import Animation from './Animation';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

interface FadeInProps {
  delay: number;
  children: ReactNode;
}

export default function FadeIn({ delay, children }: FadeInProps) {
  return (
    <Animation keyframes={fadeIn} delay={delay}>
      {children}
    </Animation>
  );
}
