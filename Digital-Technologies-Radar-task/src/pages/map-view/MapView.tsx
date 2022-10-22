import React from 'react';
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader
} from '@react-google-maps/api';
import { BlipType } from '@undp_sdg_ai_lab/undp-radar/dist/types';
import { BlipsPerQuadType } from '../../components/lists/quadrant/QuadrantHorizonList';

const containerStyle = {
  height: '79vh'
};

const center = {
  lat: 37.916609,
  lng: 0
};

type QuadType = {
  qIndex: number;
  horizons: BlipsPerQuadType;
};

type MarkerInfoDetail = {
  countryOfImplementation: string;
  numberOfImplementations: number;
};

// used to calculate opacity of the blip markers according to their frequencies per country
let maxBliksPerCountry = 0;

const mapBlips = (blips: QuadType[]): Map<string, BlipType[]> => {
  let blipsMap = new Map();

  const mapHorizon = (horizon: any) => {
    horizon.map((blip: any) => {
      let countries = blip['Country of Implementation'];
      countries.map((country: string) => {
        if (blipsMap.has(country)) {
          let countryBlips = blipsMap.get(country);
          countryBlips.push(blip);
          maxBliksPerCountry = Math.max(
            maxBliksPerCountry,
            countryBlips.length
          );
        } else {
          blipsMap.set(country, [blip]);
          maxBliksPerCountry = Math.max(maxBliksPerCountry, 1);
        }
      });
    });
  };

  blips.map((blip: QuadType) => {
    let ideaBlips = blip.horizons['idea'];
    if (ideaBlips) {
      mapHorizon(ideaBlips);
    }

    let prototypeBlips = blip.horizons['prototype'];
    if (prototypeBlips) {
      mapHorizon(prototypeBlips);
    }

    let validationBlips = blip.horizons['validation'];
    if (validationBlips) {
      mapHorizon(validationBlips);
    }

    let productionBlips = blip.horizons['production'];
    if (productionBlips) {
      mapHorizon(productionBlips);
    }
  });

  return blipsMap;
};

const markerColor = '#3a8c92'; // dark turquoise

function MapView(props: { blips: QuadType[] }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyDV-1gwRkbo1ylTyx_pzZP0M_RZqz5cV6U'
  });

  console.log(props.blips);
  const blipMap = mapBlips(props.blips);
  console.log(blipMap);

  const [map, setMap] = React.useState(null);
  const [markerInfoPosition, setMarkerInfoPosition] = React.useState(null);
  const [markerInfoDetail, setMarkerInfoDetail] =
    React.useState<MarkerInfoDetail>({
      countryOfImplementation: '',
      numberOfImplementations: 0
    });

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

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
      mapContainerStyle={containerStyle}
      center={center}
      options={{
        minZoom: 2,
        zoom: 2
      }}
      // onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {Array.from(blipMap.entries()).map((value, key) => {
        let numOfBlipsOfTheCountry = value[1].length;
        // divide max number of blips per country so that you get a rate that can be used as opacity
        let opacity = numOfBlipsOfTheCountry / maxBliksPerCountry;

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
                handleMarkerInfoOpen(markerInfoDetail, currMarkerPosition)
              }
            ></Marker>
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
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MapView);
