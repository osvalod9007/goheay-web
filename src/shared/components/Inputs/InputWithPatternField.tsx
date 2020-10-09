import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {Form, Input} from 'antd';
type Props = {
  form: any;
  label?: string;
  propertyName: string;
  value?: string;
  required?: boolean;
  requiredMsg?: string;
  placeholder?: string;
  formItemLayout?: any;
  size?: any;
  formItemStyle?: any;
  rules?: any[];
  disabled?: boolean;
  upperCase?: boolean;
  validatedMsg: string;
  pattern: any;
  onChange?: any;
  validateLength?: number;
  focus?: boolean;
  onValidate?: any;
};

const InputWithPatternField = (props: Props, ref: any) => {
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
    requiredMsg,
    disabled,
    onChange,
    upperCase,
    onValidate,
  } = props;

  const validateField = (rule, val, callback) => {
    setTimeout(() => {
      if (val !== '' && val !== undefined && val !== null) {
        // const expR = /^\d+$/;
        const expR = props.pattern; // for xxxxx-xxxxx or xxxxx
        if (val !== '' && val !== undefined && val !== null && !String(val).match(expR)) {
          callback([new Error(props.validatedMsg)]);
        } else if (props.validateLength) {
          let newValue = val.replace(/(^\s*)|(\s*$)/gi, '');
          newValue = newValue.replace(/[ ]{2,}/gi, ' ');
          newValue = newValue.replace(/\n /, '\n');
          const length = newValue ? newValue.length : 0;
          if (length > props.validateLength) {
            callback([new Error(props.validatedMsg)]);
          } else {
            callback();
          }
        }
      }
      callback();
    }, 300);
  };

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

  const inputRef: any = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      props.focus && inputRef.current.focus();
    },
  }));

  return (
    <FormItem hasFeedback label={label} {...layout} style={formItemStyle}>
      {getFieldDecorator(propertyName, {
        initialValue: value || null,
        getValueFromEvent: e => (props.upperCase ? e.target.value.toUpperCase() : e.target.value),
        rules: [
          {
            message: requiredMsg || `Please input ${label}!`,
            required,
          },
          {
            validator: onValidate || validateField,
          },
        ],
      })(
        <Input
          placeholder={placeholder}
          size={size}
          disabled={disabled}
          onChange={e => {
            onChange && onChange(e);
          }}
          ref={inputRef}
        />,
      )}
    </FormItem>
  );
};
export default forwardRef(InputWithPatternField);
