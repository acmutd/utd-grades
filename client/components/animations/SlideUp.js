import React from 'react';
import { keyframes } from 'styled-components';
import Animation from './Animation';

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }

  to {
    transform: translateY(0%);
    opacity: 1;
  }
`

export default function FadeIn({ delay, children }) {
  return <Animation keyframes={slideUp} delay={delay} children={children} />
}
