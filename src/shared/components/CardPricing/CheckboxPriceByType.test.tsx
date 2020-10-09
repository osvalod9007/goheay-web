import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import CheckboxPriceByType from './CheckboxPriceByType';

const props = {
  width: '300px',
  labelFirst: 'S',
  labelSecond: 'M',
  labelThird: 'L',
  labelFourth: 'H',
  valueFirst: true,
  valueSecond: true,
  valueThird: true,
  valueFourth: true,
  onChangeFirst: jest.fn(opts => c => c),
  onChangeSecond: jest.fn(opts => c => c),
  onChangeThird: jest.fn(opts => c => c),
  onChangeFourth: jest.fn(opts => c => c),
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

describe('Test Checkbox Price By Type Component', () => {
  it('Should render Checkbox Price By Type component', () => {
    // Test first render and effect
    act(() => {
      render(<CheckboxPriceByType {...props} />, container);
    });
  });

  it('Should save Snapshot for Checkbox Price By Type component', () => {
    act(() => {
      const comp = render(<CheckboxPriceByType {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });
});
