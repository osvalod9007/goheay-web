import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InputPhoneField from './InputPhoneField';

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
  label: 'Phone',
  propertyName: 'phone',
  propertyNameCode: 'code',
  propertyNamePhoneExt: 'ext',
  value: '1234567891',
  valueCode: '+1',
  required: true,
  requiredMsg: 'Please input Phone',
  validatedMsg: 'message',
  withExt: true,
  extValue: [123],
  maxlength: 9,
  placeholder: 'Phone',
  formItemLayout,
  disabled: false,
  disabledCode: true,
  validateLength: 9,
  phoneCodes: [1],
  requiredCode: true,
};

const propOne = {
  form: testForm,
  label: '',
  propertyName: 'phone',
  propertyNameCode: 'code',
  propertyNamePhoneExt: 'ext',
  value: '1234567891',
  valueCode: undefined,
  required: false,
  requiredMsg: undefined,
  validatedMsg: undefined,
  withExt: true,
  extValue: [123],
  maxlength: 10,
  placeholder: 'Phone',
  formItemLayout,
  disabled: false,
  disabledCode: false,
  validateLength: 10,
  phoneCodes: [1],
  requiredCode: false,
};

const propTwo = {
  form: testForm,
  propertyName: '',
  propertyNameCode: '',
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

describe('Test Phone Field Component', () => {
  it('Should render Phone Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputPhoneField {...props} />, container);
    });
  });

  it('Should save Snapshot for Phone Field component', () => {
    act(() => {
      const comp = render(<InputPhoneField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Phone Field component and expect', () => {
    act(() => {
      render(<InputPhoneField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe(`Test Phone Field Component with props(required: false, valueCode: undefined,
    requiredMsg: undefined, requiredMsg: undefined, validatedMsg: undefined, requiredCode: false,) `, () => {
  it('Should render Phone Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputPhoneField {...propOne} />, container);
    });
  });

  it('Should save Snapshot for Phone Field component', () => {
    act(() => {
      const comp = render(<InputPhoneField {...propOne} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Phone Field component and expect', () => {
    act(() => {
      render(<InputPhoneField {...propOne} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test Phone Field Component without props', () => {
  it('Should render Phone Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputPhoneField {...propTwo} />, container);
    });
  });

  it('Should save Snapshot for Phone Field component', () => {
    act(() => {
      const comp = render(<InputPhoneField {...propTwo} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Phone Field component and expect', () => {
    act(() => {
      render(<InputPhoneField {...propTwo} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
