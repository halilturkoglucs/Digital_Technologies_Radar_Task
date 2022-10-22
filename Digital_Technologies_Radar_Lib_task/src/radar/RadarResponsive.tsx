import React, { useState, useRef, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { RadarQuadrantProps } from '../types';

const DEFAULT_MARGIN = 20;

export const RadarResponsive: React.FC<{
  Spinner: React.ReactNode;
  Component: React.FC<RadarQuadrantProps>;
  margin?: number;
}> = ({ Spinner, Component, margin = DEFAULT_MARGIN }) => {
  const contentRef: React.RefObject<HTMLDivElement> = useRef(null);

  const [resize, setResize] = useState(true);
  const [width, setWidth] = useState(0);

  // Resize
  let setResizeFalseTimer: NodeJS.Timeout | undefined;
  const setResizeFalse = (): void => {
    if (setResizeFalseTimer) clearTimeout(setResizeFalseTimer);
    setResizeFalseTimer = setTimeout(() => {
      console.log('setting resize false');
      setResize(false);
    }, 1000);
  };

  let resizeTimer: NodeJS.Timeout | undefined;
  const resizeEventHandler = useDebouncedCallback((): void => {
    console.log('setting resize true');
    setResize(true);
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (contentRef.current) {
        console.log('setting radar width');
        setWidth(contentRef.current.getBoundingClientRect().width);
      }
      setResizeFalse();
    }, 2000);
  });

  useEffect(() => {
    window.addEventListener('resize', resizeEventHandler);
    resizeEventHandler();
    return (): void => {
      window.removeEventListener('resize', resizeEventHandler);
    };
  }, []);

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
        ref={contentRef}
      >
        <div style={{ flex: 1, justifyContent: 'center', textAlign: 'center' }}>
          {!resize && (
            <Component w={width - 2 * margin} h={width - 2 * margin} />
          )}
        </div>

        {resize && (
          <div
            style={{
              position: 'absolute',
              width,
              height: width,
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            {Spinner}
          </div>
        )}
      </div>
    </div>
  );
};
