import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {fireEvent} from '@testing-library/react';
import i18n from '../../../shared/i18n/i18n';
import {I18nextProvider} from 'react-i18next';
import GoogleMapRoute from './GoogleMapRoute';

const props = {
  mapId: 'google-map-test',
  orderSelected: {},
  config: {},
};

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

describe('Test Google Map Route Component', () => {
  it('Should render Map Route component', () => {
    // Test first render and effect
    act(() => {
      render(<GoogleMapRoute {...props} />, container);
    });
  });

  it('Should save Snapshot for Google Map Route component', () => {
    act(() => {
      const comp = render(<GoogleMapRoute {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });
});
