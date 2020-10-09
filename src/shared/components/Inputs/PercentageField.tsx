import * as React from 'react';
import {Form, Input} from 'antd';
interface Props {
  form: any;
  label?: string;
  propertyName: string;
  value?: string;
  required?: boolean;
  requiredMsg?: string;
  min: number;
  max: number;
  placeholder?: string;
  formItemLayout?: any;
  formItemStyle?: any;
  size?: any;
  disabled?: boolean;
  validatedMsg?: string;
  validationMethod?: (v) => void;
}
const PercentageField = (props: Props) => {
  const FormItem = Form.Item;

  const validateField = (rule, val, callback) => {
    setTimeout(() => {
      if (val !== '') {
        const expR = /(^100(\.0{1,2})?$)|(^([1-9]([0-9])?|0)(\.[0-9]{1,2})?$)/; // for float numbers
        if (val !== '' && val !== undefined && val !== null && !String(val).match(expR)) {
          callback([new Error(props.validatedMsg)]);
        } else if (val < props.min || val > props.max) {
          callback([new Error(props.validatedMsg)]);
        } else {
          callback();
        }
      } else {
        callback();
      }
      callback();
    }, 300);
  };
  const {
    form,
    label,
    value,
    propertyName,
    required,
    min,
    max,
    placeholder,
    formItemLayout,
    formItemStyle,
    requiredMsg,
    disabled,
    size,
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
  return (
    <FormItem hasFeedback label={label} {...layout} style={formItemStyle}>
      {getFieldDecorator(propertyName, {
        initialValue: value || null,
        rules: [
          {
            message: requiredMsg || `Please input ${label}!`,
            required,
          },
          {
            validator: validateField,
          },
        ],
      })(<Input placeholder={placeholder} size={size} disabled={disabled} />)}
    </FormItem>
  );
};
export default PercentageField;
