# UNDP Radar Library

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/@undp_sdg_ai_lab/undp-radar.svg)](https://www.npmjs.com/package/@undp_sdg_ai_lab/undp-radar) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add @undp_sdg_ai_lab/undp-radar
```

```bash
npm install --save @undp_sdg_ai_lab/undp-radar
```

## Usage

```tsx
import React, { Component } from 'react';

import {
  AddCSV,
  DataProvider,
  RadarDataGenerator,
  RadarProvider,
  SetData,
  Utilities,
  RawBlipType,
  MappingType,
  ColorsParamType,
  OrdersParamType,
  KeysObject
} from '@undp_sdg_ai_lab/undp-radar';
import '@undp_sdg_ai_lab/undp-radar/dist/index.css';

import csvData2 from './assets/some_csv_data_file.csv';

const Example: React.FC = () => {
  const mapping: MappingType<RawBlipType> = (item: { [key: string]: string }) =>
    ({
      Quadrant: item['Quadrant'],
      Title: item['Title'],
      Horizon: item['Horizon'],
      'Use Case': item['Use Case'],
      Technology: Utilities.cleanupStringArray(item.Technology.split(','))
    } as any);

  const keys: KeysObject = {
    techKey: 'Technology',
    titleKey: 'Title',
    horizonKey: 'Horizon',
    quadrantKey: 'Quadrant',
    useCaseKey: 'Use Case'
  };

  const orders: OrdersParamType = {
    quadrants: ['Response', 'Recovery', 'Resilience', 'Preparedness'],
    horizons: ['Production', 'Validation', 'Prototype', 'Idea']
  };

  const colors: ColorsParamType = {
    quadrants: {
      colors: [
        { r: 255, g: 0, b: 0, opacity: 1 },
        { r: 0, g: 255, b: 0, opacity: 1 },
        { r: 0, g: 0, b: 255, opacity: 1 },
        { r: 255, g: 0, b: 255, opacity: 1 }
      ],
      initialOpacity: 0.7, // [OPTIONAL default=0.7] opacity from the inner horizon
      clumpingOpacity: 1.1 // [OPTIONAL default=1.0] compresses the opacity so it becomes much smoother
    }
  };

  return (
    <RadarProvider>
      <DataProvider>
        <SetData keys={keys} orders={orders} colors={colors} />
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
```

Don't forget to add `csv` files module declaration to your `react-app-env.d.ts` like so:

```ts
/// <reference types="react-scripts" />

declare module '*.csv' {
  const value: string;
  export default value;
}
```

### PopOver

Default PopUp (just item title)

```tsx
<ToolTip />
```

OR for custom PopUp

```tsx
<ToolTip>
  <PopOver />
</ToolTip>
```

You can disable the `PopUp` by setting `SetData` prop `disablePopup` (optional, defaults to `false` ). Once `disablePopup` is `true` , the `ToolTip` will return null. See `ToolTip` implementation to figure it out.

### Further implementations

For further ideas on how to use this library (it has a lot going on under the hood) please check `./example/` project.

## How to run the Example

1. `yarn build` on root folder
2. `cd example && yarn install & yarn start`

### To develop

Open two terminal windows.

* In one do `yarn start` (this will watch and recompile the lib on change).
* In the next one to `cd example && yarn install & yarn start`

## How to publish to NPM

1. Be sure you are part of the @undp_sdb_ai_lab organisation in npmjs.

2. Run `yarn build` and be sure it is successful.

3. Run `yarn publish` - differently from npm, yarn will ask for a new version and tag it. Remember to push your git state to remote after.

