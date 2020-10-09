import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InputEmailField from './InputEmailField';

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
const props = {
  placeholder: 'Email',
  label: 'Email',
  required: true,
  form: testForm,
  propertyName: 'email',
  validateLength: 30,
  formItemLayout,
  requiredMsg: 'Please input Email!',
  value: 'email@com.com',
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

describe('Test Email Field Component', () => {
  it('Should render Email Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputEmailField {...props} />, container);
    });
  });

  it('Should save Snapshot for Email Field component', () => {
    act(() => {
      const comp = render(<InputEmailField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('Should render Email Field component and expect', () => {
    // Test first render and effect
    act(() => {
      render(<InputEmailField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
