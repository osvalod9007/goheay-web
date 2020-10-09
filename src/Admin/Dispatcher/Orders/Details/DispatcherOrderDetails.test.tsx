import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {fireEvent} from '@testing-library/react';
import i18n from '../../../../shared/i18n/i18n';
import {I18nextProvider} from 'react-i18next';
import DispatcherOrderDetails from './DispatcherOrderDetails';

const props = {
  item: {
    id: 1,
    name: 'Manu Manu y COquito',
    email: 'manu@gmail.com',
    mobile: '+19289483734',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  },
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

describe('Test Dispatcher Order Details Component', () => {
  it('Should render Dispatcher Order Details component', () => {
    // Test first render and effect
    act(() => {
      render(<DispatcherOrderDetails {...props} />, container);
    });
  });

  it('Should save Snapshot for Dispatcher Order Details component', () => {
    act(() => {
      const comp = render(<DispatcherOrderDetails {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });
});
