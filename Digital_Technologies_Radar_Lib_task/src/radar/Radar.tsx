import React, { useEffect } from 'react';

import { RadarSVG } from './svg_comps/RadarSVG';
import { useDataState } from '../stores/data.state';

// SCSS
import './RadarSvg.scss';
import { RadarQuadrantProps } from '../types';

export const Radar: React.FC<RadarQuadrantProps> = ({ w = 600, h = 600 }) => {
  const {
    state: { radarOptions },
    processes: { setRadarConf }
  } = useDataState();

  useEffect(() => {
    setRadarConf({ ...radarOptions, width: w, height: h });
  }, [w, h]);

  return <RadarSVG dimensions={{ w, h }} />;
};
