import React, { useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';

const defaultStyle = {
  transition: 'all 300ms ease-out',
  opacity: 0,
};

const transitionStyles = {
  entering: {
    opacity: 0,
    transform: 'translateY(20%)',
  },
  entered: {
    opacity: 1,
    transform: 'translateY(0%)',
  },
  exiting: {
    opacity: 1,
    transform: 'translateY(0%)',
  },
  exited: {
    opacity: 0,
    transform: 'scale(0.9) translateY(50%)',
  },
};

export default function SlideUp({ startAt, children }) {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    setTimeout(() => setDisplay(true), startAt);
  }, [startAt]);

  return (
    <Transition in={display} timeout={300} appear={true} unmountOnExit={true}>
      {(state) =>
        React.cloneElement(children, {
          style: {
            ...defaultStyle,
            ...transitionStyles[state],
          },
        })
      }
    </Transition>
  );
}
