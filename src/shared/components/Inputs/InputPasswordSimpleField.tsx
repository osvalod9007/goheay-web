import * as React from 'react';
import {Form, Icon, Input} from 'antd';
const FormItem = Form.Item;
type Props = {
  form: any;
  propertyName: string;
  label?: string;
  colon?: boolean;
  value?: string;
  icon?: boolean;
  required?: boolean;
  placeholder?: string;
  formItemLayout?: any;
  maxLength?: number;
  onChange?: any;
  rules?: any[];
  validator?: any;
  requiredMsg?: string;
};

const InputPasswordSimpleField = (props: Props) => {
  const {
    form,
    label,
    value,
    colon,
    propertyName,
    required,
    placeholder,
    maxLength,
    icon,
    rules,
    validator,
    requiredMsg,
    formItemLayout,
  } = props;
  const prefix = icon ? <Icon type="lock" style={{fontSize: 15}} /> : '';
  const {getFieldDecorator} = form;

  return (
    <FormItem label={label ? label : ''} {...formItemLayout} colon={colon}>
      {getFieldDecorator(propertyName, {
        initialValue: value || '',
        rules: [
          {
            required,
            message: requiredMsg || `Please provide a password.`,
          },
          {
            validator: validator || '',
          },
          ...(rules || []),
        ],
      })(<Input prefix={prefix} type="password" placeholder={placeholder || 'Password'} maxLength={maxLength || 30} />)}
    </FormItem>
  );
};
export default InputPasswordSimpleField;
