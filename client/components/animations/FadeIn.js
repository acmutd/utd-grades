import React from 'react';
import { keyframes } from 'styled-components';
import Animation from './Animation';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

export default function FadeIn({ delay, children }) {
  return <Animation keyframes={fadeIn} delay={delay} children={children} />
}
