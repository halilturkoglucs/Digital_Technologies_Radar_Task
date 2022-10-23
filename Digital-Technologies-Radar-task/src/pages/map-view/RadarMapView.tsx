import React, { useEffect, useState } from 'react';
import { Box, Grid, GridItem, Heading } from '@chakra-ui/react';
import {
  BlipType,
  Radar,
  RadarQuadrantProps,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { WaitingForRadar } from '../../radar/components';
import { PopOverView } from '../views/PopOverView';

import '../views/RadarView.scss';
import './RadarMapView.scss';
import MapView from './MapView';
import SearchResult from '../search/SearchResult';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
  loading: boolean;
  headingLabel?: string;
};

export const RadarMapView: React.FC<Props> = (props: Props) => {
  const {
    state: { techFilters, blips, isFiltered, filteredBlips }
  } = useRadarState();

  const radarProps: RadarQuadrantProps = {
    w: 320,
    h: 320
  };

  const matchSmScreen = useMediaQuery('(max-width:576px)');

  const mapViewContainerStyle = {
    width: matchSmScreen ? '89vw' : '57vw',
    height: matchSmScreen ? '63vw' : '99vh'
  };

  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);

  useEffect(() => {
    let blipsToUse = blips;
    if (isFiltered) {
      blipsToUse = filteredBlips;
    }
    setDisplayBlips(blipsToUse);
  }, [blips, filteredBlips]);

  useEffect(() => {
    if (techFilters.length > 0) {
      let filteredBlipsAccordingToTechFilters = displayBlips.filter((blip) => {
        // blip.Technology and the techFilters sent by Radar state is different
        // e.g. blip.Technology=['Geographical Information Systems']
        // whereas techFilters=['geographical-information-systems']
        // as a workaround, try to convert blip.Technology to techFilter format
        let blipTechnology = blip.Technology.map((tf) => {
          return tf.toLowerCase().replaceAll(' ', '-');
        });
        return blipTechnology.some((t) => techFilters.includes(t));
      });
      console.log(filteredBlipsAccordingToTechFilters);
      setDisplayBlips(filteredBlipsAccordingToTechFilters);
    }
  }, [techFilters]);

  return (
    <div className='radarMapView'>
      <div className='radarTitleContainer'>
        <Heading
          fontSize={30}
          color='DarkSlateGray'
          textAlign='center'
          p={15}
          paddingTop={15}
          className='radarTitle'
        >
          {props.headingLabel
            ? props.headingLabel
            : 'Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)'}
        </Heading>
        <div className='titleFiller' />
      </div>
      <Grid
        alignItems='center'
        templateColumns='repeat(auto-fit, minmax(400px, 1fr))'
      >
        <GridItem
          className='radarComponentsContainer'
          colSpan={{ sm: 1, md: 1, lg: 1 }}
        >
          <Box className='radarComponents sm-padding'>
            {props.loading && <WaitingForRadar size={radarProps.w + 'px'} />}
            {!props.loading && <Radar {...radarProps} />}
          </Box>
          <PopOverView />
        </GridItem>

        <GridItem
          bg={'#fdfdfd'}
          mb={{ base: 0, md: 50 }}
          colSpan={{ sm: 1, md: 1, lg: 2 }}
        >
          <MapView
            blips={displayBlips}
            containerStyle={mapViewContainerStyle}
          />
        </GridItem>

        <GridItem
          bg={'#fdfdfd'}
          mr={{ base: 10, md: 50 }}
          mb={{ base: 67, md: 9 }}
          colSpan={{ sm: 1, md: 1, lg: 3 }}
        >
          <SearchResult filteredContent={displayBlips} pageSize={4} />
        </GridItem>
      </Grid>
    </div>
  );
};
