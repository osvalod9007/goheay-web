import React, {useEffect} from 'react';
import {Form, Input} from 'antd';
type Props = {
  form: any;
  label?: string;
  propertyName: string;
  value?: string;
  required?: boolean;
  placeholder?: string;
  formItemLayout: any;
  size?: any;
  formItemStyle?: any;
  disabled?: boolean;
  requiredMsg?: string;
  validatedMsg?: string;
  rules?: any[];
  validateLength: number;
  onChange?: any;
  autocomplete?: string;
};

const InputEmailField = (props: Props) => {
  const FormItem = Form.Item;
  const {
    form,
    label,
    value,
    propertyName,
    required,
    placeholder,
    formItemLayout,
    formItemStyle,
    size,
    disabled,
    requiredMsg,
    validatedMsg,
    rules,
    onChange,
  } = props;

  // useEffect(() => {
  //   const some_id: any = document.getElementById(propertyName);
  //   some_id.removeAttribute('autocomplete');
  // });

  const {getFieldDecorator} = form;
  return (
    <FormItem hasFeedback label={label} {...formItemLayout} style={formItemStyle}>
      {getFieldDecorator(propertyName, {
        initialValue: value,
        rules: [
          {
            pattern: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
            message: validatedMsg ? validatedMsg : 'This field only accepts a valid email address.',
          },
          {
            message: requiredMsg || `Please provide an ${label}!`,
            required,
          },
          ...(rules || []),
        ],
      })(
        <Input
          autoComplete={'off'}
          placeholder={placeholder}
          size={size}
          disabled={disabled}
          // onChange={e => {
          //   onChange && onChange(e);
          // }}
        />,
      )}
    </FormItem>
  );
};
export default InputEmailField;
