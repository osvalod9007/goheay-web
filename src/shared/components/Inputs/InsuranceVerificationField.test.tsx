import React from 'react';
import {render, unmountComponentAtNode} from 'react-dom';
import {act} from 'react-dom/test-utils';
import InsuranceVerificationField from './InsuranceVerificationField';

const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 8},
    md: {span: 10},
    lg: {span: 7},
    xl: {span: 10},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 14},
    md: {span: 24},
    lg: {span: 24},
    xl: {span: 24},
  },
};

const testForm = {
  getFieldDecorator: jest.fn(opts => c => c),
  validateFieldsAndScroll: jest.fn(opts => c => c),
};

const props = {
  form: testForm,
  label: 'InsuranceVerification',
  width: '100%',
  isRequired: true,
  propertyNameFirst: 'firstInsuranceVerification',
  labelFirst: 'FirstInsuranceVerification',
  labelSecond: 'SecondInsuranceVerification',
  propertyNameSecond: 'secondInsuranceVerification',
  valueFirst: true,
  valueSecond: true,
  formItemLayout,
  requiredMsgFirst: 'Please check FirstInsuranceVerification',
  requiredMsgSecond: 'Please check SecondInsuranceVerification',
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

describe('Test InsuranceVerification Field Component', () => {
  it('Should render InsuranceVerification Field component', () => {
    // Test first render and effect
    act(() => {
      render(<InsuranceVerificationField {...props} />, container);
    });
  });

  it('Should save Snapshot for InsuranceVerification Field component', () => {
    act(() => {
      const comp = render(<InsuranceVerificationField {...props} />, container);
      expect(comp).toMatchSnapshot();
    });
  });

  it('should render Snapshot InsuranceVerification Field component and expect', () => {
    act(() => {
      render(<InsuranceVerificationField {...props} />, container);
    });
    expect(container.querySelector('input').value).toBe('');
  });
});
