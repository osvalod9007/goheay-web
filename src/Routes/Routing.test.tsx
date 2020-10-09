import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import Routing from './Routing';

describe('Test Routing Component', () => {
  let container: any = null;
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  it('Should render Routing component', () => {
    // Test first render and effect
    act(() => {
      render(<Routing />, container);
    });
  });

  it('Should save Snapshot for Routing component', () => {
    act(() => {
      const app = render(<Routing />, container);
      expect(app).toMatchSnapshot();
    });
  });
});
