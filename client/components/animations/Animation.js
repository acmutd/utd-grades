import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  animation: ${props => props.keyframes} 300ms ease-out;
  animation-delay: ${props => props.delay}ms;
  animation-fill-mode: backwards;
`

export default function Animation({ keyframes, delay, children }) {
  return (
    // Use random key to force animation to play on re-render
    <Wrapper key={Math.random()} keyframes={keyframes} delay={delay}>
      {children}
    </Wrapper>
  )
}