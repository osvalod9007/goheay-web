import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InputWithPatternField from './InputWithPatternField';

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
  label: 'WithPattern',
  value: 'Test',
  propertyName: 'withPattern',
  required: true,
  placeholder: 'WithPattern',
  formItemLayout,
  requiredMsg: 'Please input WithPattern',
  validatedMsg: 'Accepts only .,- character',
  disabled: false,
  upperCase: true,
  onValidate: true,
  focus: true,
  pattern: /^[0-9A-Za-z' -]+$/,
};

const myProps = {
  form: testForm,
  propertyName: '',
  requiredMsg: '',
  validatedMsg: '',
  pattern: [],
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

describe('Test WithPattern Field Component', () => {
  it('Should render WithPattern Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputWithPatternField {...props} />, container);
    });
  });

  it('Should save Snapshot for WithPattern Field component', () => {
    act(() => {
      const comp = render(<InputWithPatternField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot WithPattern Field component and expect', () => {
    act(() => {
      render(<InputWithPatternField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test Phone Field Component without props', () => {
  it('Should render WithPattern Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputWithPatternField {...myProps} />, container);
    });
  });

  it('Should save Snapshot for WithPattern Field component', () => {
    act(() => {
      const comp = render(<InputWithPatternField {...myProps} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot WithPattern Field component and expect', () => {
    act(() => {
      render(<InputWithPatternField {...myProps} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
