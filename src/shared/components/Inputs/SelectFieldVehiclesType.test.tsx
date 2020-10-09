import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import SelectFieldVehiclesType from './SelectFieldVehiclesType';

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
    span: 8,
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 10},
    span: 10,
  },
};

const testForm = {
  getFieldDecorator: jest.fn(opts => c => c),
  validateFieldsAndScroll: jest.fn(opts => c => c),
};

const props = {
  form: testForm,
  label: 'VehiclesType',
  value: 'VehiclesType',
  propertyName: 'vehiclesType',
  required: true,
  placeholder: 'VehiclesType',
  formItemLayout,
  requiredMsg: 'Please select VehiclesType',
  disabled: false,
  items: [{value: 1}, {key: 1}, {name: test}],
  onSelect: {value: 1},
};

const myProps = {
  form: testForm,
  propertyName: '',
  items: [],
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

describe('Test VehiclesType Field Component', () => {
  it('Should render VehiclesType Field component', () => {
    // Test first render and effect
    act(() => {
      render(<SelectFieldVehiclesType {...props} />, container);
    });
  });

  it('Should save Snapshot for VehiclesType Field component', () => {
    act(() => {
      const comp = render(<SelectFieldVehiclesType {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot VehiclesType Field component and expect', () => {
    act(() => {
      render(<SelectFieldVehiclesType {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test VehiclesType Field Component', () => {
  it('Should render VehiclesType Field component', () => {
    // Test first render and effect
    act(() => {
      render(<SelectFieldVehiclesType {...myProps} />, container);
    });
  });

  it('Should save Snapshot for VehiclesType Field component', () => {
    act(() => {
      const comp = render(<SelectFieldVehiclesType {...myProps} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot VehiclesType Field component and expect', () => {
    act(() => {
      render(<SelectFieldVehiclesType {...myProps} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
