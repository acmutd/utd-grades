import { type ReactNode } from 'react';
import styled, { type Keyframes } from 'styled-components';

const Wrapper = styled.div<AnimationProps>`
  animation: ${(props) => props.keyframes} 300ms ease-out;
  animation-delay: ${(props) => props.delay}ms;
  animation-fill-mode: backwards;
`;

interface AnimationProps {
  keyframes: Keyframes;
  delay: number;
  children: ReactNode;
}

export default function Animation({
  keyframes,
  delay,
  children,
}: AnimationProps) {
  return (
    // Use random key to force animation to play on re-render
    <Wrapper key={Math.random()} keyframes={keyframes} delay={delay}>
      {children}
    </Wrapper>
  );
}
