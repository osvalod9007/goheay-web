import React from 'react';
import {shallow, mount} from 'enzyme';
import InputTextAreaField from './InputTextAreaField';
import {act} from 'react-dom/test-utils';
import {render, unmountComponentAtNode} from 'react-dom';

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
};

const props = {
  form: testForm,
  label: 'Address',
  value: 'Address',
  propertyName: 'address',
  formItemLayout,
  isRequired: true,
  requiredMsg: 'Please input Address',
  placeholder: 'Address',
  cantWords: 50,
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

describe('Test TextArea Field Component', () => {
  it('Should render TextArea Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputTextAreaField {...props} />, container);
    });
  });

  it('Should save Snapshot for TextArea Field component', () => {
    act(() => {
      const comp = render(<InputTextAreaField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot TextArea Field component and expect', () => {
    act(() => {
      render(<InputTextAreaField {...props} />, container);
    });
    expect(container.querySelector('textArea').value).toBe('');
  });
});

describe('Test TextArea Field Component without props', () => {
  it('Should render TextArea Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputTextAreaField {...myProps} />, container);
    });
  });

  it('Should save Snapshot for TextArea Field component', () => {
    act(() => {
      const comp = render(<InputTextAreaField {...myProps} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot TextArea Field component and expect', () => {
    act(() => {
      render(<InputTextAreaField {...myProps} />, container);
    });
    expect(container.querySelector('textArea').value).toBe('');
  });
});
