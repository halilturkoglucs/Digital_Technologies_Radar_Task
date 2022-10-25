import React, { useLayoutEffect, useRef } from 'react';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

// AmCharts Imports
import * as am5 from '@amcharts/amcharts5';
import * as am5map from '@amcharts/amcharts5/map';
import am5geodata_worldLow from '@amcharts/amcharts5-geodata/worldLow';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { MapChart } from '@amcharts/amcharts5/map';

const mapBlips = (blips: BlipType[]): Map<string, BlipType[]> => {
  let blipsMap = new Map();

  blips.forEach((blip: any) => {
    let countries = blip['Country of Implementation'];

    countries
      .filter((country: string) => country !== 'Global')
      .forEach((country: string) => {
        if (blipsMap.has(country)) {
          let countryBlips = blipsMap.get(country);
          countryBlips.push(blip);
        } else {
          blipsMap.set(country, [blip]);
        }
      });
  });

  return blipsMap;
};

/**
 * Returns polygon id of countries so that we can show bubbles in AmCharts
 *
 * @param mapFeatures
 */
const mapCountryData = (mapFeatures: any[]): Map<string, string> => {
  let countryMap = new Map();

  mapFeatures.forEach((feature) => {
    countryMap.set(feature.properties.name, feature.properties.id);
  });

  // add some countries that has no mapping or mapped differently in AmCharts geo location map
  countryMap.set('Turkey', 'TR');
  countryMap.set('United States of America', 'US');

  return countryMap;
};

type CountryFrequency = {
  id: string;
  name: string;
  value: number;
  color: string;
};

type CountryFrequencyData = {
  countryFrequencies: CountryFrequency[];
  maxFrequency: number;
};

const getRandomHexColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

const getCountryFrequencies = (
  countryMap: Map<string, string>,
  blipMap: Map<string, BlipType[]>
): CountryFrequencyData => {
  let countryFrequencies: CountryFrequency[] = [];
  let maxFrequency = 1; // Used in determining the proportionate size of blips on the map

  Array.from(blipMap.entries()).forEach((value, key) => {
    let countryName = value[0];
    let countryId = 'UNKNOWN'; // if AmCharts geo data does not have a country code for this then default it to UNKNOWN

    if (countryMap.has(countryName)) {
      // @ts-ignore
      countryId = countryMap.get(countryName);
    }

    let countryFrequencyValue = value[1].length; // a.k.a. numOfBlipsOfTheCountry
    maxFrequency = Math.max(maxFrequency, countryFrequencyValue);

    let countryFrequency: CountryFrequency = {
      id: countryId,
      name: countryName,
      value: countryFrequencyValue,
      color: getRandomHexColor()
    };

    countryFrequencies.push(countryFrequency);
  });

  return {
    countryFrequencies,
    maxFrequency
  };
};

type MapViewProps = {
  blips: BlipType[];
  containerStyle?: { height?: string; width?: string };
};

/**
 * This functional component modifies and implements https://www.amcharts.com/demos/map-bubbles/
 *
 * @param props
 * @constructor
 */
function AmChartsMapView(props: MapViewProps) {
  const chartRef = useRef<MapChart>(null);

  const countryMap = mapCountryData(am5geodata_worldLow.features);

  // console.log(props.blips);
  // console.log(countryMap);
  let blipMap = mapBlips(props.blips);
  let frequencyData = getCountryFrequencies(countryMap, blipMap);
  let blipData = frequencyData.countryFrequencies;
  let maxFrequency = frequencyData.maxFrequency;
  // console.log(blipData);

  let root: am5.Root;

  const fillMap = (root: am5.Root, chart: MapChart): MapChart => {
    chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ['AQ']
      })
    );

    let bubbleSeries = chart.series.push(
      am5map.MapPointSeries.new(root, {
        valueField: 'value',
        calculateAggregates: true,
        polygonIdField: 'id'
      })
    );

    let circleTemplate = am5.Template.new({});

    bubbleSeries.bullets.push(function (
      root: am5.Root,
      series: any,
      dataItem: any
    ) {
      let container = am5.Container.new(root, {});

      let color = dataItem.dataContext.color;
      let frequency = dataItem.dataContext.value;

      let am5Circle = am5.Circle.new(root, {
        radius: Math.max((33 / maxFrequency) * frequency, 9), // circleSize proportionate to the frequency - 20 is to prevent too small circles
        fillOpacity: 0.7,
        fill: am5.color(color),
        cursorOverStyle: 'pointer',
        tooltipText: `{name}: [bold]{value}[/]`
      });

      let circle = container.children.push(
        am5Circle,
        // @ts-ignore
        circleTemplate
      );

      let countryLabel = container.children.push(
        am5.Label.new(root, {
          text: '{name}',
          paddingLeft: 5,
          populateText: true,
          fontWeight: 'bold',
          fontSize: 13,
          centerY: am5.p50
        })
      );

      circle.on('radius', function (radius) {
        countryLabel.set('x', radius);
      });

      return am5.Bullet.new(root, {
        sprite: container,
        dynamic: true
      });
    });

    bubbleSeries.bullets.push(function (
      root: am5.Root,
      series: any,
      dataItem: any
    ) {
      return am5.Bullet.new(root, {
        sprite: am5.Label.new(root, {
          text: "{value.formatNumber('#.')}",
          fill: am5.color(0xffffff),
          populateText: true,
          centerX: am5.p50,
          centerY: am5.p50,
          textAlign: 'center'
        }),
        dynamic: true
      });
    });

    // minValue and maxValue must be set for the animations to work ref:AmCharts documentation
    bubbleSeries.set('heatRules', [
      {
        target: circleTemplate,
        dataField: 'value',
        min: 10,
        max: 50,
        minValue: 0,
        maxValue: 100,
        key: 'radius'
      }
    ]);

    bubbleSeries.data.setAll(blipData);

    chart.series.push(bubbleSeries);

    return chart;
  };

  useLayoutEffect(() => {
    root = am5.Root.new('am5MapDiv');
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(am5map.MapChart.new(root, {}));
    if (!chartRef) {
      return;
    }

    chart = fillMap(root, chart);

    // @ts-ignore
    chartRef.current = chart;

    return () => {
      root.dispose();
    };
  }, [props.blips]);

  let mapWidth = props.containerStyle?.width
    ? props.containerStyle?.width
    : '100%';
  let mapHeight = props.containerStyle?.height
    ? props.containerStyle?.width
    : '500px';

  return <div id='am5MapDiv' style={{ width: mapWidth, height: mapHeight }} />;
}

export default React.memo(AmChartsMapView);
