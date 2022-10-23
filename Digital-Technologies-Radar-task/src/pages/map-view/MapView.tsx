import React from 'react';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader
} from '@react-google-maps/api';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';

const center = {
  lat: 37.916609,
  lng: 0
};

type MarkerInfoDetail = {
  countryOfImplementation: string;
  numberOfImplementations: number;
  x: number;
  y: number;
};

// used to calculate opacity of the blip markers according to their frequencies per country
let maxBlipsPerCountry = 0;

const mapBlips = (blips: BlipType[]): Map<string, BlipType[]> => {
  let blipsMap = new Map();

  blips.forEach((blip: any) => {
    let countries = blip['Country of Implementation'];

    countries.forEach((country: string) => {
      if (blipsMap.has(country)) {
        let countryBlips = blipsMap.get(country);
        countryBlips.push(blip);
        maxBlipsPerCountry = Math.max(maxBlipsPerCountry, countryBlips.length);
      } else {
        blipsMap.set(country, [blip]);
        maxBlipsPerCountry = Math.max(maxBlipsPerCountry, 1);
      }
    });
  });

  return blipsMap;
};

const markerColor = '#3a8c92'; // dark greenish turquoise

type MapViewProps = {
  blips: BlipType[];
  containerStyle?: { height?: string; width?: string };
};

function MapView(props: MapViewProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDV-1gwRkbo1ylTyx_pzZP0M_RZqz5cV6U'
  });

  // console.log(props.blips);
  const blipMap = mapBlips(props.blips);
  // console.log(blipMap);

  const [markerInfoPosition, setMarkerInfoPosition] = React.useState(null);
  const [markerInfoDetail, setMarkerInfoDetail] =
    React.useState<MarkerInfoDetail>({
      countryOfImplementation: '',
      numberOfImplementations: 0,
      x: 0,
      y: 0
    });

  const handleMarkerInfoOpen = (
    markerInfoDetail: any,
    markerInfoPosition: any
  ) => {
    setMarkerInfoDetail(markerInfoDetail);
    setMarkerInfoPosition(markerInfoPosition);
  };

  const handleMarkerInfoClose = () => {
    setMarkerInfoPosition(null);
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={
        props.containerStyle ? props.containerStyle : { height: '79vh' }
      }
      center={center}
      options={{
        minZoom: 2,
        zoom: 2,
        disableDefaultUI: true
      }}
    >
      {Array.from(blipMap.entries()).map((value, key) => {
        let numOfBlipsOfTheCountry = value[1].length;
        // divide max number of blips per country so that you get a rate that can be used as opacity
        let opacity = numOfBlipsOfTheCountry / maxBlipsPerCountry;

        // put information about the project country into the marker info window
        // info: same for the blips of a country
        let markerInfoDetail = {
          countryOfImplementation: value[0],
          numberOfImplementations: value[1].length
        };

        return value[1].map((blip) => {
          let currMarkerPosition = {
            lat: blip.x,
            lng: blip.y
          };

          return (
            <Marker
              key={key + '-' + blip.x + ',' + blip.y}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 5,
                fillColor: markerColor,
                strokeColor: markerColor,
                strokeWeight: 1,
                fillOpacity: opacity
              }}
              position={currMarkerPosition}
              onClick={() =>
                handleMarkerInfoOpen(
                  { ...markerInfoDetail, x: blip.x, y: blip.y },
                  currMarkerPosition
                )
              }
            />
          );
        });
      })}

      {markerInfoPosition && markerInfoDetail && (
        <InfoWindow
          position={markerInfoPosition}
          onCloseClick={handleMarkerInfoClose}
        >
          <div>
            <h1>Country of Implementation</h1>
            <p>{markerInfoDetail.countryOfImplementation}</p>
            <h1>Number of Implementations</h1>
            <p>{markerInfoDetail.numberOfImplementations}</p>
            <h1>Coordinates:</h1>
            <p>x: {markerInfoDetail.x}</p>
            <p>y: {markerInfoDetail.y}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MapView);
