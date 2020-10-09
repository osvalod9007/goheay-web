import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import SwitchField from './SwitchField';

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
  label: 'Switch',
  value: ['Yes', 'No'],
  propertyName: 'switch',
  required: true,
  placeholder: 'Switch',
  formItemLayout,
  requiredMsg: 'Please input Switch',
  disabled: false,
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

describe('Test Switch Field Component', () => {
  it('Should render Switch Field component', () => {
    // Test first render and effect
    act(() => {
      render(<SwitchField {...props} />, container);
    });
  });

  it('Should save Snapshot for Switch Field component', () => {
    act(() => {
      const comp = render(<SwitchField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });
});
