import React from 'react';
import { ReactLabelComp } from '@undp_sdg_ai_lab/undp-radar';

const style = { cursor: 'pointer' };

const HEIGHT = 3;
const WIDTH = 20;
const SPACE = 2;
const O = -15;
const O1 = O + 1 * HEIGHT + 1 * SPACE;
const O2 = O + 2 * HEIGHT + 2 * SPACE;
const O3 = O + 3 * HEIGHT + 3 * SPACE;
const O4 = O + 4 * HEIGHT + 4 * SPACE;

export const HorizonsNameComp: ReactLabelComp = ({
  onMouseEnter,
  onMouseMove,
  onMouseOut,
  onMouseUp,
  textAnchor,
  className
}) => (
  <g
    style={style}
    className={className}
    textAnchor={textAnchor}
    onMouseEnter={onMouseEnter}
    onMouseMove={onMouseMove}
    onMouseOut={onMouseOut}
    onMouseUp={onMouseUp}
  >
    <rect
      x={-SPACE}
      y={O1 - SPACE}
      width={WIDTH + SPACE * 2}
      height={HEIGHT + HEIGHT * 4 + SPACE * 4}
      fill={'white'}
      strokeWidth={1}
      stroke={'black'}
    />
    <rect
      y={O1}
      width={WIDTH}
      height={HEIGHT}
      fill={'green'}
      style={{ pointerEvents: 'none' }}
    />
    <rect
      y={O2}
      width={WIDTH}
      height={HEIGHT}
      fill={'green'}
      style={{ pointerEvents: 'none' }}
    />
    <rect
      y={O3}
      width={WIDTH}
      height={HEIGHT}
      fill={'green'}
      style={{ pointerEvents: 'none' }}
    />
    <rect
      y={O4}
      width={WIDTH}
      height={HEIGHT}
      fill={'green'}
      style={{ pointerEvents: 'none' }}
    />
  </g>
);
