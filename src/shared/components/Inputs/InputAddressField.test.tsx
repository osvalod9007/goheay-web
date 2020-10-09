import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InputAddressField from './InputAddressField';

// let wrapper;

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 7},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};

const testForm = {
  getFieldDecorator: jest.fn(opts => c => c),
  validateFieldsAndScroll: jest.fn(opts => c => c),
};
const propsOne = {
  form: testForm,
  formItemLayout,
  heiden: {display: 'none'},
  propertyNameAddress: 'address',
  propertyNameCountry: 'addressCountryId',
  propertyNameCity: 'addressCity',
  propertyNameZipCode: 'addressZipCode',
  propertyNameState: 'addressStateId',
  placeholderAddress: 'Enter the address',
  placeholderCountry: 'Select the country',
  placeholderCity: 'Enter the city name',
  placeholderZipCode: 'Enter the ZIP code',
  placeholderState: 'Select the State',
  countries: ['United States of America'],
  states: ['West Virginia', 'Florida'],
  valueAddressCountryId: 0,
  valueAddress: 'Address',
  valueAddressCity: 'Miami',
  valueAddressZipCode: '12345',
  valueAddressStateId: 1,
};
const props = {
  form: testForm,
  countries: [],
  states: [],
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
describe('Test Address Fields Component without props', () => {
  it('Should render Address Fields component', () => {
    // Test first render and effect
    act(() => {
      render(<InputAddressField {...props} />, container);
    });
  });

  it('Should save Snapshot for Address Fields component', () => {
    act(() => {
      const comp = render(<InputAddressField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('Should render Address Fields component and expect', () => {
    // Test first render and effect
    act(() => {
      render(<InputAddressField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test Address Fields Component with props', () => {
  it('Should render Address Fields component', () => {
    // Test first render and effect
    act(() => {
      render(<InputAddressField {...propsOne} />, container);
    });
  });

  it('Should save Snapshot for Address Fields component', () => {
    act(() => {
      const comp = render(<InputAddressField {...propsOne} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('Should render Address Fields component and expect', () => {
    // Test first render and effect
    act(() => {
      render(<InputAddressField {...propsOne} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
