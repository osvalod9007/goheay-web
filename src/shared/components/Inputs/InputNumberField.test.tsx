import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InputNumberField from './InputNumberField';

// let wrapper;

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
  label: 'Number',
  propertyName: 'number',
  value: 12345,
  required: true,
  requiredMsg: 'Please input Number',
  maxlength: 5,
  placeholder: 'Number',
  formItemLayout,
  decimalNumber: false,
  validateLength: 5,
  withMaxLength: true,
  negativeNumber: false,
  autoFocus: true,
  withExactLength: true,
};

const propsOne = {
  form: testForm,
  label: 'Number',
  propertyName: 'number',
  value: -1.3466,
  required: false,
  requiredMsg: 'Please input Number',
  maxlength: 5,
  placeholder: 'Number',
  formItemLayout,
  decimalNumber: true,
  validateLength: 5,
  withMaxLength: false,
  negativeNumber: true,
  autoFocus: false,
  withExactLength: false,
};

const propsTwo = {
  form: testForm,
  propertyName: '',
  validateLength: NaN,
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

describe('Test Number Field Component', () => {
  it('Should render Number Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputNumberField {...props} />, container);
    });
  });

  it('Should save Snapshot for Number Field component', () => {
    act(() => {
      const comp = render(<InputNumberField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Number Field component and expect', () => {
    act(() => {
      render(<InputNumberField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe(`Test Number Field Component with props(required: false, decimalNumber: true,
    withMaxLength: false, negativeNumber: true, autoFocus: false, withExactLength: false,) `, () => {
  it('Should render Number Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputNumberField {...propsOne} />, container);
    });
  });

  it('Should save Snapshot for Number Field component', () => {
    act(() => {
      const comp = render(<InputNumberField {...propsOne} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Number Field component and expect', () => {
    act(() => {
      render(<InputNumberField {...propsOne} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test Number Field Component without props', () => {
  it('Should render Number Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputNumberField {...propsTwo} />, container);
    });
  });

  it('Should save Snapshot for Number Field component', () => {
    act(() => {
      const comp = render(<InputNumberField {...propsTwo} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Number Field component and expect', () => {
    act(() => {
      render(<InputNumberField {...propsTwo} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
