import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {Form, Input} from 'antd';
interface Props {
  form: any;
  label?: string;
  propertyName: string;
  value?: any;
  required?: boolean;
  requiredMsg?: string;
  maxlength?: number;
  placeholder?: string;
  formItemLayout?: any;
  size?: any;
  formItemStyle?: any;
  rules?: any[];
  disabled?: boolean;
  decimalNumber?: boolean;
  validateLength: number;
  withMaxLength?: boolean;
  negativeNumber?: boolean;
  autoFocus?: boolean;
  withExactLength?: boolean;
  maxLength?: number;
  onKeyUp?: any;
  onValidate?: any;
  onChange?: any;
  validatedMsg?: string;
}
const InputNumberField = (props: Props) => {
  const FormItem = Form.Item;
  const {t} = useTranslation('app');
  const validateField = (rule, val, callback) => {
    setTimeout(() => {
      if (val !== '' && val !== undefined && val !== null) {
        // const expR = /^\d+$/;
        const expR = props.negativeNumber ? /^-?\d*(\.\d+)?$/ : /^\d*(\.\d+)?$/; // for float numbers
        let newValue = String(val).replace(/(^\s*)|(\s*$)/gi, '');
        newValue = newValue.replace(/[ ]{2,}/gi, ' ');
        newValue = newValue.replace(/\n /, '\n');
        const newValueArray = newValue.split('.');
        const [decimals] = newValueArray.length > 1 ? newValueArray.slice(-1) : [''];
        if (props.decimalNumber && decimals.length > 2 && !isNaN(parseFloat(decimals))) {
          callback([new Error(`${t('msgValidDecimalNumberTwoDigits')}`)]);
        } else if (val !== '' && val !== undefined && val !== null && !String(val).match(expR)) {
          callback([new Error(props.validatedMsg ? props.validatedMsg : 'Please, enter a valid number')]);
        } else {
          if (props.withExactLength) {
            const length = newValue ? newValue.length : 0;
            if (length < props.validateLength || length > props.validateLength) {
              callback([new Error(`${props.label} must have ${props.validateLength} characters`)]);
            } else {
              callback();
            }
          } else {
            if (props.withMaxLength) {
              const length = newValue ? newValue.length : 0;
              if (length > props.validateLength) {
                callback([new Error(`String of up to ${props.validateLength} numeric characters!`)]);
              } else {
                callback();
              }
            } else {
              callback();
            }
          }
        }
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
    maxlength,
    placeholder,
    formItemLayout,
    formItemStyle,
    size,
    requiredMsg,
    rules,
    disabled,
    maxLength,
    onValidate,
    onKeyUp,
    onChange,
    autoFocus,
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
        initialValue: value,
        rules: [
          {
            message: requiredMsg || `Please input ${label}!`,
            required,
          },
          {
            validator: onValidate || validateField,
          },
          ...(rules || []),
        ],
      })(
        <Input
          placeholder={placeholder}
          size={size}
          disabled={disabled}
          maxLength={maxlength}
          onKeyUp={onKeyUp}
          autoFocus={autoFocus}
          onChange={e => {
            onChange && onChange(e);
          }}
        />,
      )}
    </FormItem>
  );
};
export default InputNumberField;
