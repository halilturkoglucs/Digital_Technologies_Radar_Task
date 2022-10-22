import React, { useEffect } from 'react';

import {
  KeysObject,
  ReactLabelComp,
  ColorsParamType,
  OrdersParamType,
  RadarConfParamType
} from '../types';
import { useDataState } from '../stores/data.state';

interface Props {
  keys: KeysObject;
  radarConf?: RadarConfParamType;
  orders?: OrdersParamType;
  colors?: ColorsParamType;
  disablePopup?: boolean;
  quadrantsDescription?: { [k: string]: string };
  horizonsDescription?: { [k: string]: string };
  QuadrantNameComponent?: ReactLabelComp;
  HorizonsNameComponent?: ReactLabelComp;
}

export const SetData: React.FC<Props> = ({
  keys,
  radarConf,
  orders,
  colors,
  disablePopup = false,
  horizonsDescription,
  quadrantsDescription,
  QuadrantNameComponent,
  HorizonsNameComponent
}) => {
  const {
    actions: {
      setUiPopupDisabled,
      setHorizonPriorityOrder,
      setQuadrantPriorityOrder,
      setRadarQuadrantColors,
      setRadarQuadrantInitialOpacity,
      setRadarQuadrantClumpingOpacity,
      setHorizonsDescription,
      setQuadrantsDescription,
      setQuadrantNameComponent,
      setHorizonsNameComponent
    },
    processes: { setKeys, setRadarConf }
  } = useDataState();

  useEffect(() => {
    setKeys(keys);
  }, [keys]);

  useEffect(() => {
    if (radarConf) setRadarConf(radarConf);
  }, [radarConf]);

  useEffect(() => {
    if (orders?.horizons) setHorizonPriorityOrder(orders.horizons);
    if (orders?.quadrants) setQuadrantPriorityOrder(orders.quadrants);
  }, [orders]);

  useEffect(() => {
    if (colors?.quadrants?.colors)
      setRadarQuadrantColors(colors.quadrants.colors);
    if (colors?.quadrants?.initialOpacity)
      setRadarQuadrantInitialOpacity(colors.quadrants.initialOpacity);
    if (colors?.quadrants?.clumpingOpacity)
      setRadarQuadrantClumpingOpacity(colors.quadrants.clumpingOpacity);
  }, [colors]);

  useEffect(() => {
    setUiPopupDisabled(disablePopup);
  }, [disablePopup]);

  useEffect(() => {
    if (horizonsDescription) setHorizonsDescription(horizonsDescription);
  }, [horizonsDescription]);

  useEffect(() => {
    if (quadrantsDescription) setQuadrantsDescription(quadrantsDescription);
  }, [quadrantsDescription]);

  useEffect(() => {
    if (QuadrantNameComponent) setQuadrantNameComponent(QuadrantNameComponent);
  }, [QuadrantNameComponent]);

  useEffect(() => {
    if (HorizonsNameComponent) setHorizonsNameComponent(HorizonsNameComponent);
  }, [HorizonsNameComponent]);

  return <React.Fragment />;
};
