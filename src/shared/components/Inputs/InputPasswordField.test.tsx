import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InputPasswordField from './InputPasswordField';

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
  placeholder: 'Enter the password',
  confirmPlaceholder: 'Enter the confirm password',
  form: testForm,
  label: 'Password',
  propertyName: 'password',
  required: true,
  formItemLayout,
  minLength: 8,
  maxLength: 15,
  requiredMsg: 'Required Field',
  requiredMsgConfirm: 'Required Field',
  value: '',
  validatedMsg: 'Validate msg',
  isHorizontal: false,
  matchMsg: 'Confurm password',
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

describe('Test Input Password Field Component', () => {
  it('Should render Email Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputPasswordField {...props} />, container);
    });
  });

  it('Should save Snapshot for Input Password Field component', () => {
    act(() => {
      const comp = render(<InputPasswordField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('Should render Input Password Field component and expect', () => {
    // Test first render and effect
    act(() => {
      render(<InputPasswordField {...props} />, container);
      // const input: any = document.getElementById('password');
      // console.log(`data input..: ${JSON.stringify(input)}`);
      // expect(input.value).toBe('');
      // input.value = 'change';
      // expect(input.value).toBe('change');
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
