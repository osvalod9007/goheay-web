import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import NumberPlusField from './NumberPlusField';

const formItemLayout = {
  labelCol: {
    xs: {span: 8},
    sm: {span: 8},
    span: 8,
  },
  wrapperCol: {
    xs: {span: 16},
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
  title: 'NumberPlus',
  propertyName: 'numberPlus',
  value: 3,
  required: true,
  requiredMsg: 'Please input Phone',
  minFieldLength: 3,
  minFieldLengthMsg: 'The Numbe most have 3 numbers',
  validateMsg: 'Accepts only numbers!',
  asLetter: true,
  maxlength: 9,
  placeholder: 'NumberPlus',
  formItemLayout,
  disabled: false,
  validateLength: 3,
  step: 1,
  min: 1,
  max: 3,
};

const myProps = {
  form: testForm,
  propertyName: '',
  value: NaN,
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

describe('Test NumberPlus Field Component', () => {
  it('Should render NumberPlus Field component', () => {
    // Test first render and effect
    act(() => {
      render(<NumberPlusField {...props} />, container);
    });
  });

  it('Should save Snapshot for NumberPlus Field component', () => {
    act(() => {
      const comp = render(<NumberPlusField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot NumberPlus Field component and expect', () => {
    act(() => {
      render(<NumberPlusField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test NumberPlus Field Component without props', () => {
  it('Should render NumberPlus Field component', () => {
    // Test first render and effect
    act(() => {
      render(<NumberPlusField {...myProps} />, container);
    });
  });

  it('Should save Snapshot for NumberPlus Field component', () => {
    act(() => {
      const comp = render(<NumberPlusField {...myProps} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot NumberPlus Field component and expect', () => {
    act(() => {
      render(<NumberPlusField {...myProps} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
