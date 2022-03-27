import React, { useState, useEffect } from 'react';

const defaultStyle = {
  transition: 'opacity 300ms ease-out',
  opacity: 0,
};

const transitionStyles = {
  entering: {
    opacity: 0,
  },
  entered: {
    opacity: 1,
  },
};

export default function FadeIn({ startAt, children }) {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    setTimeout(() => setDisplay(true), startAt);
  }, [startAt]);

  return React.cloneElement(children, {
    style: {
      ...defaultStyle,
      ...transitionStyles[display ? 'entered' : 'entering'],
    },
  });
}
