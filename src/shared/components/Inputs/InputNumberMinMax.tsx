import React, {useState} from 'react';
import {Form, Row, Col} from 'antd';
import {useTranslation} from 'react-i18next';
import InputNumberField from './InputNumberField';

type Props = {
  form: any;
  label?: string;
  propertyName: string;
  propertyNameMin: string;
  propertyNameMax: string;
  valueMin?: any;
  valueMax?: any;
  disableMin?: boolean;
  disableMax?: boolean;
  validateLength: number;
  isRequired?: boolean;
  formItemLayout?: any;
  formItemLayoutMinMax?: any;
  formItemStyle?: any;
  rules?: any[];
  withMaxLength?: boolean;
  withExactLength?: boolean;
  withValidate?: boolean;
  decimalNumber?: boolean;
  maxLength?: number;
  onKeyUp?: any;
  onValidate?: any;
  validatedMsgMin?: string;
  validatedMsgMax?: string;
  validatedMsg?: string;
  requiredMsg?: string;
};
const InputNumberMinMaxField = (props: Props) => {
  const FormItem = Form.Item;
  const {t} = useTranslation('app');
  const [step, setStep] = useState(0);
  const validateField = (rule, val, callback) => {
    setTimeout(() => {
      const expR = /^-?\d*(\.\d+)?$/;
      let newValue = String(props.form.getFieldValue(`${propertyNameMin}`)).replace(/(^\s*)|(\s*$)/gi, '');
      let newValueMax = String(props.form.getFieldValue(`${propertyNameMax}`)).replace(/(^\s*)|(\s*$)/gi, '');
      newValue = newValue.replace(/[ ]{2,}/gi, ' ');
      newValue = newValue.replace(/\n /, '\n');
      const newValueArray = newValue.split('.');
      const [decimals] = newValueArray.length > 1 ? newValueArray.slice(-1) : [''];
      newValueMax = newValueMax.replace(/[ ]{2,}/gi, ' ');
      newValueMax = newValueMax.replace(/\n /, '\n');
      const newValueArrayMax = newValueMax.split('.');
      const [decimalsMax] = newValueArrayMax.length > 1 ? newValueArrayMax.slice(-1) : [''];
      if (
        props.form.getFieldValue(`${propertyNameMax}`) !== '' &&
        props.form.getFieldValue(`${propertyNameMax}`) !== null &&
        props.form.getFieldValue(`${propertyNameMax}`) !== undefined &&
        props.form.getFieldValue(`${propertyNameMin}`) !== '' &&
        props.form.getFieldValue(`${propertyNameMin}`) !== null &&
        props.form.getFieldValue(`${propertyNameMin}`) !== undefined &&
        String(props.form.getFieldValue(`${propertyNameMax}`)).match(expR) &&
        String(props.form.getFieldValue(`${propertyNameMin}`)).match(expR) &&
        decimals.length < 3 &&
        decimalsMax.length < 3
      ) {
        if (parseFloat(newValue) >= parseFloat(newValueMax) && step === 1) {
          callback([new Error(props.validatedMsgMin ? props.validatedMsgMin : `${t('msgValidMinMax')}`)]);
        } else if (parseFloat(newValueMax) <= parseFloat(newValue) && step === 2) {
          callback([new Error(props.validatedMsgMax ? props.validatedMsgMax : `${t('msgValidMinMax')}`)]);
        } else {
          callback();
        }
      } else {
        callback();
      }
    }, 300);
  };
  const handleOtp = (e, steps) => {
    setStep(steps + 1);
  };
  const {
    form,
    label,
    propertyName,
    propertyNameMin,
    propertyNameMax,
    valueMin,
    disableMin,
    disableMax,
    valueMax,
    isRequired,
    formItemLayout,
    formItemLayoutMinMax,
    formItemStyle,
    validateLength,
    rules,
    onValidate,
    validatedMsg,
    decimalNumber,
    requiredMsg,
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
        initialValue: isRequired,
        rules: [
          {
            validator: onValidate ? onValidate : validateField,
          },
          ...(rules || []),
        ],
      })(
        <Row type="flex" justify="space-between" align="top">
          <Col xs={24} sm={24} md={24} lg={11} xl={11}>
            <InputNumberField
              placeholder={t('labelPlaceHolderMin')}
              required={isRequired}
              form={props.form}
              propertyName={propertyNameMin}
              validateLength={validateLength}
              value={valueMin}
              formItemLayout={formItemLayoutMinMax}
              requiredMsg={requiredMsg || t('msgValidOnlyDecimals')}
              decimalNumber={decimalNumber}
              disabled={disableMin}
              validatedMsg={validatedMsg}
              onKeyUp={e => handleOtp(e, 0)}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={2} xl={2}>
            <span style={{fontSize: 20, display: 'inline-block', width: '100%', textAlign: 'center'}}>-</span>
          </Col>
          <Col xs={24} sm={24} md={24} lg={11} xl={11}>
            <InputNumberField
              placeholder={t('labelPlaceHolderMax')}
              required={isRequired}
              form={props.form}
              propertyName={propertyNameMax}
              validateLength={50}
              value={valueMax}
              formItemLayout={formItemLayoutMinMax}
              requiredMsg={requiredMsg || t('msgValidOnlyDecimals')}
              disabled={disableMax}
              decimalNumber={decimalNumber}
              validatedMsg={validatedMsg}
              onKeyUp={e => handleOtp(e, 1)}
            />
          </Col>
        </Row>,
      )}
    </FormItem>
  );
};
export default InputNumberMinMaxField;
