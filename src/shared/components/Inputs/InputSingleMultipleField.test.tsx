import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InputSingleMultipleField from './InputSingleMultipleField';

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 12},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 24},
  },
};

const testForm = {
  getFieldDecorator: jest.fn(opts => c => c),
  validateFieldsAndScroll: jest.fn(opts => c => c),
};

const props = {
  form: testForm,
  label: 'SingleMultiple',
  width: '75%',
  propertyNameSingle: 'singleField',
  propertyNameMultiple: 'multipleFields',
  valueSingle: 1,
  valueMultiple: 2,
  maxLength: 2,
  validateLength: 2,
  isRequired: true,
  formItemLayout,
};

const myProps = {
  form: testForm,
  propertyNameSingle: '',
  propertyNameMultiple: '',
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

describe('Test SingleMultiple Field Component', () => {
  it('Should render NumberPlus Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputSingleMultipleField {...props} />, container);
    });
  });

  it('Should save Snapshot for SingleMultiple Field component', () => {
    act(() => {
      const comp = render(<InputSingleMultipleField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot SingleMultiple Field component and expect', () => {
    act(() => {
      render(<InputSingleMultipleField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test SingleMultiple Field Component without props', () => {
  it('Should render NumberPlus Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputSingleMultipleField {...myProps} />, container);
    });
  });

  it('Should save Snapshot for SingleMultiple Field component', () => {
    act(() => {
      const comp = render(<InputSingleMultipleField {...myProps} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot SingleMultiple Field component and expect', () => {
    act(() => {
      render(<InputSingleMultipleField {...myProps} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
