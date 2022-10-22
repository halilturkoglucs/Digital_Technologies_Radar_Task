import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  BoxProps,
  SimpleGrid,
  Flex,
  Center,
  Stack,
  Text,
  Image,
  Badge,
  GridItem,
  Grid
} from '@chakra-ui/react';
import {
  BlipType,
  Radar,
  RadarQuadrantProps,
  useDataState,
  useRadarState
} from '@undp_sdg_ai_lab/undp-radar';

import { WaitingForRadar } from '../../radar/components';
import { TechDescription } from '../../radar/tech/TechDescription';
import { BlipView } from '../../components/views/blip/BlipView';
import { ScrollableDiv } from '../../components/lists/components/ScrollableDiv';
import { BlipListMui } from '../../components/lists/components/BlipListMui';
import { PopOverView } from '../views/PopOverView';

import '../views/RadarView.scss';
import './RadarMapView.scss';
import SearchView from '../search/SearchView';
import Pagination from '@mui/material/Pagination';
import SearchResult from '../search/SearchResult';
import MapView from './MapView';
import { BlipsPerQuadType } from '../../components/lists/quadrant/QuadrantHorizonList';

type Props = {
  loading: boolean;
  headingLabel?: string;
};

export const RadarMapView: React.FC<Props> = (props: Props) => {
  const {
    state: {
      techFilters,
      selectedItem,
      blips,
      isFiltered,
      filteredBlips,
      selectedQuadrant,
      radarData: { quadrants }
    }
  } = useRadarState();
  const {
    state: {
      keys: { horizonKey }
    }
  } = useDataState();

  const [tabIndex, setTabIndex] = React.useState(0);

  useEffect(() => {
    if (techFilters && techFilters.length > 0) {
      setTabIndex(1);
    }
  }, [techFilters]);

  useEffect(() => {
    if (selectedItem) {
      setTabIndex(2);
    }
  }, [selectedItem]);

  const tabsChangeHandler = (ind: number) => {
    setTabIndex(ind);
  };

  const radarProps: RadarQuadrantProps = {
    w: 320,
    h: 320
  };

  // Map related state
  type QuadType = {
    qIndex: number;
    horizons: BlipsPerQuadType;
  };

  // const [bufferBlips, setBufferBlips] = useState<BlipType[]>([]);
  const [displayBlips, setDisplayBlips] = useState<BlipType[]>([]);
  const [quadBlips, setQuadBlips] = useState<QuadType[]>([]);

  useEffect(() => {
    let blipsToUse = blips;
    if (isFiltered) {
      blipsToUse = filteredBlips;
    }
    setDisplayBlips(blipsToUse);
  }, [blips, filteredBlips]);

  useEffect(() => {
    var quads = new Array<QuadType>();
    for (let i = 0; i < quadrants.length; i++) {
      var q: QuadType = {
        qIndex: i,
        horizons: {}
      };
      quads.push(q);
    }
    // Two pass, one for quadrant blips and second to
    displayBlips.forEach((blip) => {
      // get quad
      let q = quads[blip.quadrantIndex];
      let h = q.horizons;
      let hName: string = blip[horizonKey];
      if (h[hName] === undefined) {
        h[hName] = new Array<BlipType>();
      }
      h[hName].push(blip);
      setQuadBlips(quads);
    });
  }, [displayBlips]);
  // END: Map related state

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
        // columns={{ sm: 1, md: 1, lg: 3 }}
        // className='radarContainer'
      >
        {/*<GridItem colSpan={{sm: 1, md: 1, lg: 3}}>*/}
        {/*  <Heading*/}
        {/*    fontSize={30}*/}
        {/*    color='DarkSlateGray'*/}
        {/*    textAlign='center'*/}
        {/*    p={15}*/}
        {/*    paddingTop={15}*/}
        {/*    className='radarTitle'*/}
        {/*  >*/}
        {/*    {props.headingLabel ? props.headingLabel : 'Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)'}*/}
        {/*  </Heading>*/}
        {/*  <div className='titleFiller' />*/}
        {/*</GridItem>*/}
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

        {/*<Box className='tabsComponents' {...TabOuterBoxProps}>*/}
        {/*  <Tabs*/}
        {/*    variant='enclosed'*/}
        {/*    index={tabIndex}*/}
        {/*    onChange={tabsChangeHandler}*/}
        {/*  >*/}
        {/*    <TabList>*/}
        {/*      <Tab as='h5'>Stages</Tab>*/}
        {/*      <Tab as='h5'>Technologies</Tab>*/}
        {/*      <Tab as='h5'>Project</Tab>*/}
        {/*    </TabList>*/}
        {/*    <TabPanels overflowY='auto'>*/}
        {/*      <TabPanel overflowY='auto'>*/}
        {/*        <ScrollableDiv maxHeight={720}>*/}
        {/*          <BlipListMui />*/}
        {/*        </ScrollableDiv>*/}
        {/*      </TabPanel>*/}
        {/*      <TabPanel overflowY='auto'>*/}
        {/*        <TechDescription />*/}
        {/*      </TabPanel>*/}
        {/*      <TabPanel overflowY='auto'>*/}
        {/*        <ScrollableDiv maxHeight={720}>*/}
        {/*          <BlipView />*/}
        {/*        </ScrollableDiv>*/}
        {/*      </TabPanel>*/}
        {/*    </TabPanels>*/}
        {/*  </Tabs>*/}
        {/*</Box>*/}

        <GridItem
          bg={'#fdfdfd'}
          mb={{ base: 0, md: 50 }}
          colSpan={{ sm: 1, md: 1, lg: 2 }}
        >
          <MapView blips={quadBlips} />
        </GridItem>

        {/*<GridItem bg={'#fdfdfd'} mb={{ base: 0, md: 50 }} colSpan={{sm: 1, md: 1, lg: 2}}>*/}
        {/*  {filteredTech.length !== 0 && (*/}
        {/*    <SearchResult filteredContent={filteredTech} />*/}
        {/*  )}*/}
        {/*</GridItem>*/}
      </Grid>
    </div>
  );
};

const TabOuterBoxProps: BoxProps = {
  borderColor: 'gray.200',
  borderWidth: '2px',
  borderRadius: 'md',
  overflow: 'hidden',
  mt: '110',
  mb: '5',
  mr: '10',
  p: '5',
  maxWidth: '500px',
  height: '800px'
};
