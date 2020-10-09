import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InputDisabledPartDatesField from './InputDisabledPartDatesField';

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
  label: 'DisabledPartDates',
  value: '03/19/2019',
  propertyName: 'disabledPartDates',
  required: true,
  placeholder: 'disabledPartDates',
  formItemLayout,
  requiredMsg: 'Please input disabledPartDates',
  // defaultPickerValue:,
  disabledDateProps: false,
  disabled: false,
};

const myProps = {
  form: testForm,
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

describe('Test disabledPartDates Field Component', () => {
  it('Should render disabledPartDates Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputDisabledPartDatesField {...props} />, container);
    });
  });

  it('Should save Snapshot for disabledPartDates Field component', () => {
    act(() => {
      const comp = render(<InputDisabledPartDatesField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot disabledPartDates Field component and expect', () => {
    act(() => {
      render(<InputDisabledPartDatesField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test disabledPartDates Field Component without props', () => {
  it('Should render disabledPartDates Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputDisabledPartDatesField {...myProps} />, container);
    });
  });

  it('Should save Snapshot for disabledPartDates Field component', () => {
    act(() => {
      const comp = render(<InputDisabledPartDatesField {...myProps} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot disabledPartDates Field component and expect', () => {
    act(() => {
      render(<InputDisabledPartDatesField {...myProps} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
