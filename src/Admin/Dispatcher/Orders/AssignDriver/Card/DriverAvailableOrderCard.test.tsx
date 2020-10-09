import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import DriverAvailableOrderCard from './DriverAvailableOrderCard';

const props = {
  item: {
    id: 1,
    fullName: 'Chinetepro',
    fullMobilePhone: '+19289483734',
    email: 'manu@gmail.com',
    vehicleType: 'SEDAN',
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
  },
  onSelectDriver: jest.fn(opts => c => c),
  selectedDriver: 1,
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
      render(<DriverAvailableOrderCard {...props} />, container);
    });
  });

  it('Should save Snapshot for Dispatcher Order Card component', () => {
    act(() => {
      const comp = render(<DriverAvailableOrderCard {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });
});
