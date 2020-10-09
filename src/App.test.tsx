import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import App from './App';

describe('Test App Component', () => {
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

  it('Should render App component', () => {
    // Test first render and effect
    act(() => {
      render(<App />, container);
    });
  });

  it('Should save Snapshot for App component', () => {
    act(() => {
      const app = render(<App />, container);
      expect(app).toMatchSnapshot();
    });
  });
});
