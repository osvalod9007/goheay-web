import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import PercentageField from './PercentageField';

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
  label: 'Percentage',
  value: '100%',
  propertyName: 'percentage',
  required: true,
  min: 1,
  max: 100,
  placeholder: 'Percentage',
  formItemLayout,
  requiredMsg: 'Please input Percentage',
  disabled: true,
};

const myProps = {
  form: testForm,
  propertyName: '',
  min: NaN,
  max: NaN,
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

describe('Test Percentage Field Component', () => {
  it('Should render Percentage Field component', () => {
    // Test first render and effect
    act(() => {
      render(<PercentageField {...myProps} />, container);
    });
  });

  it('Should save Snapshot for Percentage Field component', () => {
    act(() => {
      const comp = render(<PercentageField {...myProps} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Percentage Field component and expect', () => {
    act(() => {
      render(<PercentageField {...myProps} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test Percentage Field Component without props', () => {
  it('Should render Percentage Field component', () => {
    // Test first render and effect
    act(() => {
      render(<PercentageField {...props} />, container);
    });
  });

  it('Should save Snapshot for Percentage Field component', () => {
    act(() => {
      const comp = render(<PercentageField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Percentage Field component and expect', () => {
    act(() => {
      render(<PercentageField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
