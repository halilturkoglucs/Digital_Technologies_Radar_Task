import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppBottomNav } from '../components';
import { BrowserRouter } from 'react-router-dom';
import { unmountComponentAtNode } from 'react-dom';
import { Radar } from '../pages';

describe('Radar tests', () => {
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

  test('RadarView title is set via headingLabel', async () => {
    // ARRANGE
    const DEFAULT_HEADING_LABEL =
      'Frontier Technology Radar for Disaster Risk Reduction (FTR4DRR)';

    render(
      <BrowserRouter>
        <Radar />
      </BrowserRouter>,
      container as any
    );
    expect(container).toBeDefined();

    // ASSERT
    const mapViewNavigationLink = screen.getByText(DEFAULT_HEADING_LABEL);
    expect(mapViewNavigationLink).toBeInTheDocument();
  });

  test('RadarView title is set via headingLabel', async () => {
    // ARRANGE
    const HEADING_LABEL = 'NEW MAP VIEW';

    render(
      <BrowserRouter>
        <Radar headingLabel={HEADING_LABEL} />
      </BrowserRouter>,
      container as any
    );
    expect(container).toBeDefined();

    // ASSERT
    const mapViewNavigationLink = screen.getByText(HEADING_LABEL);
    expect(mapViewNavigationLink).toBeInTheDocument();
  });
});
