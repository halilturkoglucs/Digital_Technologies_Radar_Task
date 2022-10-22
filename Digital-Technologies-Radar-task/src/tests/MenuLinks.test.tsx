import {render, screen} from '@testing-library/react'
import '@testing-library/jest-dom'
import {BrowserRouter} from 'react-router-dom';
import {unmountComponentAtNode} from 'react-dom';
import {MenuLinks} from '../components/navbar/MenuLinks';

describe('MenuLinks tests', () => {
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

    test('MenuLinks has Map View', async () => {
        // ARRANGE
        render(
            <BrowserRouter>
                <MenuLinks isOpen={true} />
            </BrowserRouter>, container as any)
        expect(container).toBeDefined();

        // ASSERT
        const mapViewNavigationLink = document.querySelectorAll('a[href^="/map-view"]')[0];
        expect(mapViewNavigationLink).toBeInTheDocument();
    })
});