import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {Form, Input} from 'antd';

export const InputTextField = (props: any, ref: any): JSX.Element => {
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
    typeOfCharMsg,
    validatedMsg,
    tabIndex,
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

  const validateField = (rule, val, callback) => {
    setTimeout(() => {
      if (!props.allCharacters) {
        const expR = /^[A-Za-z' -]+$/;
        if (val !== '' && val !== undefined && val !== null && !val.match(expR)) {
          callback([new Error(`${validatedMsg}`)]);
        } else {
          let newValue = val.replace(/(^\s*)|(\s*$)/gi, '');
          newValue = newValue.replace(/[ ]{2,}/gi, ' ');
          newValue = newValue.replace(/\n /, '\n');
          const length = newValue ? newValue.length : 0;
          if (length > props.validateLength) {
            callback([new Error(validatedMsg)]);
          } else {
            callback();
          }
        }
      } else {
        if (val !== '' && val !== undefined && val !== null) {
          let newValue = val.replace(/(^\s*)|(\s*$)/gi, '');
          newValue = newValue.replace(/[ ]{2,}/gi, ' ');
          newValue = newValue.replace(/\n /, '\n');
          const length = newValue ? newValue.length : 0;
          if (length > props.validateLength) {
            callback([new Error(validatedMsg)]);
          } else {
            callback();
          }
        }
      }

      callback();
    }, 300);
  };

  const inputRef: any = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      props.focus && inputRef.current.focus();
    },
  }));

  return (
    <FormItem hasFeedback label={label} {...layout} style={formItemStyle}>
      {getFieldDecorator(propertyName, {
        initialValue: value,
        rules: [
          {
            message: requiredMsg || `Please input ${label}!`,
            required,
          },
          {
            validator: validateField,
          },
        ],
      })(<Input placeholder={placeholder} size={size} disabled={disabled} ref={inputRef} tabIndex={tabIndex} />)}
    </FormItem>
  );
};

export default forwardRef(InputTextField);
