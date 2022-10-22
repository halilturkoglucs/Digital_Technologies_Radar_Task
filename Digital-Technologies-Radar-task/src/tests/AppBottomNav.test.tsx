import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AppBottomNav } from '../components';
import { BrowserRouter } from 'react-router-dom';
import { unmountComponentAtNode } from 'react-dom';

describe('AppBottomNav tests', () => {
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

  test('AppBottomNav has Map View', async () => {
    // ARRANGE
    render(
      <BrowserRouter>
        <AppBottomNav />
      </BrowserRouter>,
      container as any
    );
    expect(container).toBeDefined();

    // ASSERT
    const mapViewNavigationLink = screen.getByText('Map View');
    expect(mapViewNavigationLink).toBeInTheDocument();
  });
});
