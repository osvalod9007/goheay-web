import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import RangeField from './RangeField';

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
  label: 'Range',
  propertyName: 'range',
  propertyNameMin: 'rangeMin',
  propertyNameMax: 'rangeMax',
  valueMin: '1',
  disableMin: false,
  disableMax: false,
  valueMax: '5',
  isRequired: true,
  formItemLayout,
  formItemLayoutMinMax: formItemLayout,
  validateLength: 2,
  validatedMsgMin: 'Please input min range',
  validatedMsgMax: 'Please input max range',
};

const myProps = {
  form: testForm,
  propertyName: '',
  propertyNameMin: '',
  propertyNameMax: '',
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

describe('Test Range Field Component', () => {
  it('Should render Range Field component', () => {
    // Test first render and effect
    act(() => {
      render(<RangeField {...props} />, container);
    });
  });

  it('Should save Snapshot for Range Field component', () => {
    act(() => {
      const comp = render(<RangeField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Range Field component and expect', () => {
    act(() => {
      render(<RangeField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});

describe('Test Range Field Component without props', () => {
  it('Should render Range Field component', () => {
    // Test first render and effect
    act(() => {
      render(<RangeField {...myProps} />, container);
    });
  });

  it('Should save Snapshot for Range Field component', () => {
    act(() => {
      const comp = render(<RangeField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot Range Field component and expect', () => {
    act(() => {
      render(<RangeField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
