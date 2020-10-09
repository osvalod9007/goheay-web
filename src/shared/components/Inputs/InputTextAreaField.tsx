import React from 'react';
import {Form, Input} from 'antd';

type Props = {
  form: any;
  label?: string;
  value?: string;
  propertyName: string;
  formItemLayout: any;
  isRequired?: boolean;
  validatedMsg?: string;
  requiredMsg?: string;
  placeholder?: string;
  cantWords?: number;
  style?: any;
};

export const InputTextAreaField = (props: any): JSX.Element => {
  const FormItem = Form.Item;
  const TextArea = Input.TextArea;
  const {
    form,
    label,
    value,
    propertyName,
    formItemLayout,
    isRequired,
    validatedMsg,
    requiredMsg,
    placeholder,
    cantWords,
    style,
  } = props;

  const layout = formItemLayout || {
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

  const {getFieldDecorator} = form;

  const validateAddress = (rule, val, callback) => {
    setTimeout(() => {
      const expR = /^[0-9A-Za-zÁÉÍÓÚáéíóúñÑ',-.,\s]+$/;
      if (val !== '' && val !== undefined && val !== null && !val.match(expR)) {
        callback([new Error(`${validatedMsg}`)]);
      } else {
        let newValue = val.replace(/(^\s*)|(\s*$)/gi, '');
        newValue = newValue.replace(/[ ]{2,}/gi, ' ');
        newValue = newValue.replace(/\n /, '\n');
        const length = newValue ? newValue.split(' ').length : 0;
        if (length > cantWords) {
          callback([new Error(validatedMsg)]);
        } else {
          callback();
        }
      }
    }, 300);
  };

  return (
    <FormItem hasFeedback label={label} {...layout}>
      {getFieldDecorator(propertyName, {
        initialValue: value,
        rules: [
          {
            message: requiredMsg,
            required: isRequired || true,
          },
          {
            validator: validateAddress,
          },
        ],
      })(<TextArea style={style} placeholder={placeholder} />)}
    </FormItem>
  );
};

export default InputTextAreaField;
