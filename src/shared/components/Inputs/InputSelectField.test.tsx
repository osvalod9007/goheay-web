import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InputSelectField from './InputSelectField';

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
  label: 'Select',
  value: [{value: 1}, {key: 1}],
  propertyName: 'Select',
  required: true,
  placeholder: 'Select',
  formItemLayout,
  requiredMsg: 'Please select Select',
  disabled: false,
  items: [{value: 1}, {key: 1}, {name: test}],
  onSelect: {value: 1},
  // drawItemsParent: {value: 1},
};

const myProps = {
  form: testForm,
  propertyName: '',
  items: [],
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
      render(<InputSelectField {...props} />, container);
    });
  });

  it('Should save Snapshot for Phone Field component', () => {
    act(() => {
      const comp = render(<InputSelectField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Phone Field component and expect', () => {
    act(() => {
      render(<InputSelectField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test Phone Field Component without props', () => {
  it('Should render Phone Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InputSelectField {...myProps} />, container);
    });
  });

  it('Should save Snapshot for Phone Field component', () => {
    act(() => {
      const comp = render(<InputSelectField {...myProps} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Phone Field component and expect', () => {
    act(() => {
      render(<InputSelectField {...myProps} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
