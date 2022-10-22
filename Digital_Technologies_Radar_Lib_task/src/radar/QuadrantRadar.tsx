import React, { useEffect } from 'react';

import { useDataState } from '../stores/data.state';
import { useRadarState } from '../stores/radar.state';

import { RadarSVG } from './svg_comps/RadarSVG';

interface Props {
  w?: number;
  h?: number;
}

export const QuadrantRadar: React.FC<Props> = ({ w = 600, h = 600 }) => {
  const {
    state: { blips, useCaseFilter, disasterTypeFilter },
    processes: { setFilteredBlips }
  } = useRadarState();

  const {
    state: {
      radarOptions,
      keys: { useCaseKey, disasterTypeKey }
    },
    processes: { setRadarConf }
  } = useDataState();

  useEffect(() => {
    setRadarConf({ ...radarOptions, width: w, height: h });
  }, [w, h]);

  useEffect(() => {
    let isFiltered = false;
    let newFiltered = blips;
    if (useCaseFilter !== 'all') {
      isFiltered = true;
      newFiltered = newFiltered.filter((i) => i[useCaseKey] === useCaseFilter);
    }
    if (disasterTypeFilter !== 'all') {
      isFiltered = true;
      newFiltered = newFiltered.filter(
        (i) => i[disasterTypeKey] === disasterTypeFilter
      );
    }
    setFilteredBlips(isFiltered, newFiltered);
  }, [blips]);

  return <RadarSVG dimensions={{ w, h }} />;
};
