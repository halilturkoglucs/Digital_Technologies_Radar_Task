import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import { unmountComponentAtNode } from 'react-dom';
import MapView from '../pages/map-view/MapView';
import React from 'react';
import * as ReactGoogleMapsApi from '@react-google-maps/api';

describe('MapView tests', () => {
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  test('MapView is empty', async () => {
    // ARRANGE
    const matchSmScreen = true;

    const mapViewContainerStyle = {
      width: matchSmScreen ? '89vw' : '57vw',
      height: matchSmScreen ? '63vw' : '99vh'
    };

    render(
      <BrowserRouter>
        <MapView blips={[]} containerStyle={mapViewContainerStyle} />
      </BrowserRouter>,
      container as any
    );
    expect(container).toBeDefined();

    // ASSERT
    const mapViewDiv = document.querySelectorAll('div')[0];
    expect(mapViewDiv).toBeEmptyDOMElement();
  });

  test('MapView loads without blips', async () => {
    // ARRANGE
    const matchSmScreen = true;

    const mapViewContainerStyle = {
      width: matchSmScreen ? '89vw' : '57vw',
      height: matchSmScreen ? '63vw' : '99vh'
    };

    jest.spyOn(ReactGoogleMapsApi, 'useJsApiLoader').mockReturnValue({
      isLoaded: true,
      loadError: undefined
    });

    // Mock google maps methods
    const mockMethod = jest.fn();
    global.google = {
      maps: {
        Map: jest.fn().mockImplementation(() => {
          return {
            setCenter: mockMethod,
            setOptions: mockMethod
          };
        }),
        Marker: jest.fn()
      }
    } as unknown as typeof google;

    render(
      <BrowserRouter>
        <MapView blips={[]} containerStyle={mapViewContainerStyle} />
      </BrowserRouter>,
      container as any
    );
    expect(container).toBeDefined();

    // ASSERT
    const mapViewDiv = document.querySelectorAll(
      'div[style^="width: ' +
        mapViewContainerStyle.width +
        '; height: ' +
        mapViewContainerStyle.height +
        ';"]'
    )[0];
    expect(mapViewDiv).toBeInTheDocument();
  });
});
