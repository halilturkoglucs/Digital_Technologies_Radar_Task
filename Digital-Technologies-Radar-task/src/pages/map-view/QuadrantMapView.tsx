import React, { useEffect, useState } from 'react';
import {
  BlipType,
  QuadrantRadar,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { BackButton } from '../../radar/components';
import MapView from './MapView';
import './QuadrantMapView.scss';

export const QuadrantMapView: React.FC = () => {
  const {
    state: {
      blips,
      isFiltered,
      filteredBlips,
      selectedQuadrant,
      techFilters,
      radarData: { quadrants }
    }
  } = useRadarState();

  const [bufferBlips, setBufferBlips] = useState<BlipType[]>([]);
  const [quadIndex, setQuadIndex] = useState<number | false>(false);

  const mapViewContainerStyle = {
    height: '119vh'
  };

  useEffect(() => {
    const newBufferBlips = (isFiltered ? filteredBlips : blips).filter(
      (b) => b.quadrantIndex === quadIndex
    );

    if (techFilters.length > 0) {
      // filter by tech
      let techFilteredBufferBlips = newBufferBlips.filter((blip) => {
        // blip.Technology and the techFilters sent by Radar state is different
        // e.g. blip.Technology=['Geographical Information Systems']
        // whereas techFilters=['geographical-information-systems']
        // as a workaround, try to convert blip.Technology to techFilter format
        let blipTechnology = blip.Technology.map((tf) => {
          return tf.toLowerCase().replaceAll(' ', '-');
        });
        return blipTechnology.some((t) => techFilters.includes(t));
      });

      setBufferBlips(techFilteredBufferBlips);
    } else {
      setBufferBlips(newBufferBlips);
    }
  }, [filteredBlips, blips, isFiltered, quadIndex, techFilters]);

  useEffect(() => {
    if (selectedQuadrant) {
      setQuadIndex(quadrants.indexOf(selectedQuadrant));
    } else setQuadIndex(false);
  }, [selectedQuadrant]);

  return (
    <div
      className='quadrantView'
      style={{ display: 'flex', flex: 1, padding: 2 }}
    >
      <BackButton to='RADAR' />
      <div className='quadrantRadar' style={{ flex: 1 }}>
        <QuadrantRadar />
      </div>
      {(quadIndex === 0 ||
        quadIndex === 1 ||
        quadIndex === 2 ||
        quadIndex === 3) && (
        <div className='horizontalMap' style={{ flex: '2' }}>
          <MapView blips={bufferBlips} containerStyle={mapViewContainerStyle} />
        </div>
      )}
    </div>
  );
};
