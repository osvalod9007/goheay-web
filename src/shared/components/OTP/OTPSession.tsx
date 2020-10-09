import React, {useState, useRef, useImperativeHandle, forwardRef} from 'react';
import {useTranslation} from 'react-i18next';
import './OTPSession.less';
import {InputNumber, Row} from 'antd';
import FormItem from 'antd/lib/form/FormItem';

type Props = {
  form: any;
  label?: string;
  propertyName: string;
  validateLength: number;
  isRequired?: boolean;
  formItemLayout?: any;
  rules?: any[];
  maxLength?: number;
  validatedMsg?: string;
  formItemStyle?: any;
  onChange: any;
  requiredMsg?: string;
};

const OTPSession = (props: Props, ref: any): JSX.Element => {
  const {t} = useTranslation('app');
  const [step, setStep] = useState(0);
  const [otpArray, setOtpArray]: any = useState([]);
  const inputsArray: any = [];
  const addOtp = (pos: number, value) => {
    otpArray[pos] = value;
  };
  const {
    form,
    label,
    propertyName,
    validateLength,
    isRequired,
    formItemLayout,
    rules,
    maxLength,
    validatedMsg,
    formItemStyle,
    onChange,
    requiredMsg,
  } = props;

  for (let index = 0; index < validateLength; index++) {
    inputsArray.push(index);
  }

  const handleOtp = (val, steps) => {
    const e = val.target.value;
    if (e && !isNaN(e) && e.toString().length === props.validateLength) {
      for (const key in e.toString()) {
        if (e.toString().hasOwnProperty(key)) {
          const element = e.toString()[key];
          addOtp(parseInt(key, undefined), parseInt(element, undefined));
          setStep(parseInt(key, undefined) + 1);
        }
      }
      val.target.value = e.toString()[steps];
    } else {
      addOtp(steps, e);
      setStep(steps + 1);
    }
    onChange && onChange(otpArray.join(''));
    e.toString().length === props.validateLength && val.target.blur();
  };
  const layout = formItemLayout || {
    labelCol: {},
    wrapperCol: {},
  };
  const validateField = (rule, val, callback) => {
    setTimeout(() => {
      if (otpArray.join('').length === 0) {
        callback([new Error(requiredMsg ? requiredMsg : `${t('msgFieldRequired')}`)]);
      } else if (otpArray.join('').length !== props.validateLength) {
        callback([new Error(validatedMsg ? validatedMsg : `${t('msgValidIncorrectOTP')}`)]);
      } else {
        callback();
      }
    }, 300);
  };
  const {getFieldDecorator} = form;
  return (
    <FormItem
      label={
        isRequired ? (
          <label>
            <span style={{color: 'red'}}>* </span>
            {''}
            <span>{label}</span>
          </label>
        ) : (
          label
        )
      }
      {...layout}
      style={formItemStyle}
    >
      {getFieldDecorator(propertyName, {
        rules: [
          {
            validator: validateField,
          },
          ...(rules || []),
        ],
      })(
        <Row className={'otp'}>
          <Row className={'otp__inputs'}>
            {inputsArray.map(index => (
              <InputNumber
                key={index}
                min={0}
                max={9}
                value={otpArray && otpArray[index]}
                onKeyUp={e => handleOtp(e, index)}
              />
            ))}
          </Row>
        </Row>,
      )}
    </FormItem>
  );
};

export default forwardRef(OTPSession);
