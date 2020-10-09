import React from 'react';
import {shallow, mount} from 'enzyme';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InputPasswordSimpleField from './InputPasswordSimpleField';

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
  placeholder: 'Password',
  label: 'Password',
  required: true,
  form: testForm,
  propertyName: 'password',
  validateLength: 30,
  formItemLayout,
  requiredMsg: 'Please input Password',
  value: 'MyS3cret1.',
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

describe('Test Password Simple Field Component', () => {
  it('Should render Password Simple Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputPasswordSimpleField {...props} />, container);
    });
  });

  it('Should save Snapshot for Password Simple Field component', () => {
    act(() => {
      const comp = render(<InputPasswordSimpleField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('Should render Input Password Simple Field component and expect', () => {
    // Test first render and effect
    act(() => {
      render(<InputPasswordSimpleField {...props} />, container);
      // const input: any = document.getElementById('password');
      // console.log(`data input..: ${JSON.stringify(input)}`);
      // expect(input.value).toBe('');
      // input.value = 'change';
      // expect(input.value).toBe('change');
    });
    expect(container.querySelector('input').value).toBe('');
    console.log(`container: ${container}`);
    // const input: any = document.getElementById('password');
    //   console.log(`data input..: ${JSON.stringify(input)}`);
    //   expect(input.value).toBe('');
    //   input.value = 'change';
    //   expect(input.value).toBe('change');
  });
});
