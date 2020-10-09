import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {fireEvent} from '@testing-library/react';
import i18n from '../../../../shared/i18n/i18n';
import {I18nextProvider} from 'react-i18next';
import DispatcherOrderCard from './DispatcherOrderCard';

const props = {
  item: {
    id: 1,
    customerFullName: 'Customer Fullname',
    customerEmail: 'customer@gmail.com',
    customerMobilePhoneNumberCode: '+1',
    customerMobilePhoneNumber: '9289483734',
    customerImage: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    driverFullName: 'Driver FullName',
    driverEmail: 'driver@gmail.com',
    driverImage: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  },
  typeOfOrder: 1,
  onSelectOrder: jest.fn(opts => c => c),
  selectedOrder: 1,
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

describe('Test Dispatcher Order Card Component', () => {
  it('Should render Dispatcher Order Card component', () => {
    // Test first render and effect
    act(() => {
      render(<DispatcherOrderCard {...props} />, container);
    });
  });

  it('Should save Snapshot for Dispatcher Order Card component', () => {
    act(() => {
      const comp = render(<DispatcherOrderCard {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  // it('Should change select order in Dispatcher Order Card component', () => {
  //   act(() => {
  //     render(<DispatcherOrderCard {...props} />, container);
  //   });
  //   const elem: any =  document.getElementsByClassName('dispatcher-order-card-1');

  //   act(() => {
  //     elem.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  //   });
  //   expect(props.onSelectOrder(1)).toHaveBeenCalledTimes(1);
  //   expect(props.selectedOrder).toBe(1);
  // });
});
