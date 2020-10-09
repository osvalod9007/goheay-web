import React from 'react';
import {shallow, mount} from 'enzyme';

import InputTextField from './InputTextField';

const layout = {
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
  placeholder: 'First Name',
  label: 'First Name',
  required: true,
  form: testForm,
  propertyName: 'firstName',
  validateLength: 30,
  formItemLayout: layout,
  requiredMsg: 'Please input First Name!',
  typeOfCharMsg: 'Only Letters',
  maxLengthMsg: 'max length is 30',
  labelLettersMsg: 'letters msg',
  value: 'First Name',
};

describe('InputTextField', () => {
  let wrapper;

  it('InputTextField renders correctly', () => {
    shallow(<InputTextField {...props} />);
  });

  it('Should render correctly InputTextField without Snapshot', () => {
    wrapper = shallow(<InputTextField {...props} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should init InputTextField value', () => {
    const TextInputComponent = mount(<InputTextField {...props} />);
    expect(TextInputComponent.prop('value')).toEqual('First Name');
  });

  it('should InputTextField null value', () => {
    const myProps = {
      placeholder: 'First Name',
      label: 'First Name',
      required: true,
      form: testForm,
      propertyName: 'firstName',
      validateLength: 30,
      formItemLayout: layout,
      requiredMsg: 'Please input First Name!',
      typeOfCharMsg: 'Only Letters',
      maxLengthMsg: 'max length is 30',
      labelLettersMsg: 'letters msg',
      value: null,
    };
    const TextInputComponent = mount(<InputTextField {...myProps} />);
    expect(TextInputComponent.prop('value')).toEqual(null);
  });

  it('should InputTextField undefined value', () => {
    const myProps = {
      placeholder: 'First Name',
      label: 'First Name',
      required: true,
      form: testForm,
      propertyName: 'firstName',
      validateLength: 30,
      formItemLayout: layout,
      requiredMsg: 'Please input First Name!',
      typeOfCharMsg: 'Only Letters',
      maxLengthMsg: 'max length is 30',
      labelLettersMsg: 'letters msg',
      value: undefined,
    };
    const TextInputComponent = mount(<InputTextField {...myProps} />);
    expect(TextInputComponent.prop('value')).toEqual(undefined);
  });

  it('should InputTextField undefined label', () => {
    const myProps = {
      placeholder: 'First Name',
      label: undefined,
      required: true,
      form: testForm,
      propertyName: 'firstName',
      validateLength: 30,
      formItemLayout: layout,
      requiredMsg: 'Please input First Name!',
      typeOfCharMsg: 'Only Letters',
      maxLengthMsg: 'max length is 30',
      labelLettersMsg: 'letters msg',
      value: '',
    };
    const TextInputComponent = mount(<InputTextField {...myProps} />);
    expect(TextInputComponent.prop('label')).toEqual(undefined);
  });

  it('should set InputTextField value', () => {
    const wrapperNew = mount(<InputTextField {...props} />);
    const input = wrapperNew.find('input');

    input.simulate('focus');
    input.simulate('change', {target: {value: 'Changed'}});
    input.simulate('keyDown', {
      which: 27,
      target: {
        blur() {
          // Needed since <EditableText /> calls target.blur()
          input.simulate('blur');
        },
      },
    });
    // console.log(`value: ${JSON.stringify(input.val())}`);
    expect(wrapperNew.find('input').props().value).toEqual('Changed');
    // expect(input.get(0).value).to.equal('Hello');

    // done();
    // expect(wrapper.contains(<h1/>)); // .props().value).toBe('First Name');
    // wrapper.find('input').simulate('change', mockEvent);
    // expect(wrapper.find('input').props().value).toBe('This is just for test');
    // exampleInput.simulate('change', { target: { value: 'john.doe'}});
  });
});
