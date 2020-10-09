import * as React from 'react';
import {Form, InputNumber, Input} from 'antd';

type Props = {
  form: any;
  title?: string;
  propertyName: string;
  value: number;
  required?: boolean;
  requiredMsg?: string;
  placeholder?: string;
  validateMsg?: string;
  step?: any;
  min?: number;
  max?: number;
  formItemLayout?: any;
  maxLength?: number;
  minFieldLength?: number;
  minFieldLengthMsg?: string;
  asLetter?: boolean;
  size?: any;
  addonBefore?: any;
  formItemStyle?: any;
  disabled?: boolean;
  rules?: any[];
};

const NumberPlusField = (props: Props) => {
  const {
    form,
    title,
    value,
    propertyName,
    required,
    step,
    min,
    max,
    formItemLayout,
    maxLength,
    asLetter,
    size,
    addonBefore,
    formItemStyle,
    placeholder,
    disabled,
    requiredMsg,
    rules,
    validateMsg,
  } = props;

  const layout = formItemLayout || {
    labelCol: {
      xs: {span: 8},
      sm: {span: 8},
      span: 8,
    },
    wrapperCol: {
      xs: {span: 16},
      sm: {span: 10},
      span: 10,
    },
  };
  const FormItem = Form.Item;

  const {getFieldDecorator} = form;
  const onKeyDown = e => {
    const w = e.which;
    if (
      !(
        /^\d$/.test(e.key) ||
        w === 8 ||
        w === 9 ||
        w === 46 ||
        (w === 86 && e.ctrlKey) ||
        w === 116 ||
        (w > 36 && w < 41)
      )
    ) {
      e.preventDefault();
    }
  };
  const validateNumber = (rule, val, callback) => {
    const {minFieldLength, minFieldLengthMsg} = props;
    const re = new RegExp(`\^\\d{${minFieldLength}}\$`, 'gi');
    const errors: any = [];
    let error = '';

    if (val && minFieldLength && !re.test(val.toString())) {
      error = minFieldLengthMsg
        ? minFieldLengthMsg
        : `The ${title || 'Number'} must have ${minFieldLength} ${minFieldLength > 1 ? 'numbers' : 'number'}`;
      errors.push(new Error(error));
    }
    callback(errors);
  };

  return (
    <FormItem label={title} {...layout} style={formItemStyle}>
      {getFieldDecorator(propertyName, {
        initialValue: value,
        rules: [
          {
            required,
            message: requiredMsg || `Please input ${title || placeholder}!`,
          },
          {
            pattern: /^\d+(\.{0,1}\d+)*$/gi,
            message: props.validateMsg ? props.validateMsg : 'Accepts only numbers!',
          },
          {
            validator: validateNumber,
          },
          ...(rules || []),
        ],
      })(
        asLetter ? (
          <Input
            maxLength={maxLength || 10}
            onKeyDown={onKeyDown}
            className={'ant-input-number'}
            size={size}
            addonBefore={addonBefore}
            placeholder={placeholder}
            disabled={disabled}
          />
        ) : (
          <InputNumber
            maxLength={maxLength || 10}
            onKeyDown={onKeyDown}
            step={step || 1}
            min={min}
            max={max}
            className={'ant-input-number'}
            size={size}
          />
        ),
      )}
    </FormItem>
  );
};

export default NumberPlusField;
