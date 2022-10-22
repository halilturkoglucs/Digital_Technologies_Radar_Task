import React from 'react';

import {
  AddCSV,
  ToolTip,
  SetData,
  Utilities,
  KeysObject,
  RawBlipType,
  MappingType,
  DataProvider,
  RadarProvider,
  ColorsParamType,
  OrdersParamType,
  RadarDataGenerator
} from '@undp_sdg_ai_lab/undp-radar';
import '@undp_sdg_ai_lab/undp-radar/dist/index.css';

import csvData2 from './assets/technology_radar_dataset_updated.csv';
import { RadarApp } from './radar/RadarApp';
import { PopOver } from './components/PopOver';
import { HorizonsNameComp } from './components/svg-hover/HorizonsNameComp';
import { QuadrantNameComp } from './components/svg-hover/QuadrantNameComp';

export const App: React.FC = () => {
  const quadrantsDescription = {
    preparedness:
      'The knowledge and capacities developed by governments, response and recovery organizations, communities, and individuals to effectively anticipate, respond to and recover from the impacts of likely, imminent or current disasters.',
    response:
      'Actions taken directly before, during or immediately after a disaster to save lives, reduce health impacts, ensure public safety, and meet the basic subsistence needs of the people affected.',
    recovery:
      'The restoring or improving of livelihoods and health, as well as economic, physical, social, cultural, and environmental assets, systems, and activities, of a disaster-affected community or society, aligning with the principles of sustainable development and “build back better”, to avoid or reduce future disaster risk.',
    resilience:
      'The lessening or minimizing of the adverse impacts of a hazardous event.'
  };

  const horizonsDescription = {
    production:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos recusandae aliquid eveniet quam neque quasi expedita dolor, id iure sequi praesentium?',
    validation:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos unde minima fugiat est harum recusandae iusto fugit, eligendi nihil similique! Perspiciatis quibusdam saepe natus praesentium rem distinctio hic tenetur rerum.',
    prototype:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. At blanditiis aut sequi a culpa! Id, libero vitae, error nam quis voluptate aspernatur fugiat obcaecati perferendis neque, provident voluptatum ipsam expedita!',
    idea: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos unde minima fugiat est harum recusandae iusto fugit, eligendi nihil similique! Perspiciatis quibusdam saepe natus praesentium rem distinctio hic tenetur rerum.'
  };

  const mapping: MappingType<RawBlipType> = (item: { [key: string]: string }) =>
    ({
      'Country of Implementation': item['Country of Implementation'],
      Data: item.Data,
      'Date of Implementation': item['Date of Implementation'],
      Description: item.Description,
      'Disaster Cycle': item['Disaster Cycle'],
      'Ideas/Concepts/Examples': item['Ideas/Concepts/Examples'],
      Source: item.Source,
      'Status/Maturity': item['Status/Maturity'],
      'Supporting Partners': item['Supporting Partners'],
      'Un Host Organisation': item['Un Host Organisation'],
      'Use Case': item['Use Case'],
      SDG: Utilities.cleanupStringArray(item.SDG.split(',')),
      Technology: Utilities.cleanupStringArray(item.Technology.split(','))
    } as unknown as RawBlipType);

  const keys: KeysObject = {
    techKey: 'Technology',
    titleKey: 'Ideas/Concepts/Examples',
    horizonKey: 'Status/Maturity',
    quadrantKey: 'Disaster Cycle',
    useCaseKey: 'Use Case',
    disasterTypeKey: ''
  };

  const orders: OrdersParamType = {
    quadrants: ['Response', 'Recovery', 'Resilience', 'Preparedness'],
    horizons: ['Production', 'Validation', 'Prototype', 'Idea']
  };

  const colors: ColorsParamType = {
    quadrants: {
      colors: [
        { r: 235, g: 76, b: 66, opacity: 1 }, // Carmine Pink
        { r: 228, g: 208, b: 10, opacity: 1 }, // Citrine
        { r: 155, g: 221, b: 255, opacity: 1 }, // Columbia blue
        { r: 0, g: 204, b: 153, opacity: 1 } // Carabean green
      ],
      initialOpacity: 0.7, // [OPTIONAL default=0.7] opacity from the inner horizon
      clumpingOpacity: 1.1 // [OPTIONAL default=1.0] compresses the opacity so it becomes much smoother
    }
  };

  return (
    <RadarProvider>
      <DataProvider>
        <SetData
          radarConf={{}}
          keys={keys}
          orders={orders}
          colors={colors}
          disablePopup={false} // optional just to showcase
          quadrantsDescription={quadrantsDescription}
          horizonsDescription={horizonsDescription}
          QuadrantNameComponent={QuadrantNameComp}
          HorizonsNameComponent={HorizonsNameComp}
        />
        <RadarDataGenerator />
        <AddCSV csvFile={csvData2} mapping={mapping} />
        <RadarApp />
        <ToolTip>
          <PopOver />
        </ToolTip>
      </DataProvider>
    </RadarProvider>
  );
};
