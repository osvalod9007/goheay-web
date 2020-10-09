import * as React from 'react';
import {Form, Row, Col} from 'antd';
import {useTranslation} from 'react-i18next';
import InputNumberField from './InputNumberField';

type Props = {
  form: any;
  label?: string;
  propertyName: string;
  propertyNameL: string;
  propertyNameW: string;
  propertyNameH: string;
  valueL?: any;
  valueW?: any;
  valueH?: any;
  validateLength: number;
  isRequired?: boolean;
  formItemLayout?: any;
  formItemLayoutLWH?: any;
  formItemStyle?: any;
  rules?: any[];
  withMaxLength?: boolean;
  withExactLength?: boolean;
  maxLength?: number;
  onKeyUp?: any;
  onValidate?: any;
  onChangeField?: any;
};
const NumberLxWxH = (props: Props) => {
  const FormItem = Form.Item;
  const {t} = useTranslation('app');
  const validateField = (rule, val, callback) => {
    setTimeout(() => {
      callback();
    }, 300);
  };
  const {
    form,
    label,
    propertyName,
    propertyNameL,
    propertyNameW,
    propertyNameH,
    valueL,
    valueW,
    valueH,
    isRequired,
    formItemLayout,
    formItemLayoutLWH,
    formItemStyle,
    validateLength,
    rules,
    onValidate,
    onChangeField,
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
            validator: onValidate || validateField,
          },
          ...(rules || []),
        ],
      })(
        <Row>
          <Col xs={24} sm={5} md={5} lg={5} xl={6}>
            <InputNumberField
              placeholder={t('labelPlaceHolderL')}
              required={isRequired}
              form={props.form}
              propertyName={propertyNameL}
              validateLength={validateLength}
              value={valueL}
              formItemLayout={formItemLayoutLWH}
              requiredMsg={t('msgFieldRequired')}
              validatedMsg={t('msgValidDecimalNumberTwoDigits')}
              decimalNumber={true}
              onKeyUp={onChangeField}
            />
          </Col>
          <Col xs={24} sm={2} md={2} lg={2} xl={2}>
            <span style={{fontSize: 20, display: 'inline-block', width: '100%', textAlign: 'center'}}>x</span>
          </Col>
          <Col xs={24} sm={5} md={5} lg={5} xl={6}>
            <InputNumberField
              placeholder={t('labelPlaceHolderW')}
              required={isRequired}
              form={props.form}
              propertyName={propertyNameW}
              validateLength={50}
              value={valueW}
              formItemLayout={formItemLayoutLWH}
              decimalNumber={true}
              requiredMsg={t('msgFieldRequired')}
              validatedMsg={t('msgValidDecimalNumberTwoDigits')}
              onKeyUp={onChangeField}
            />
          </Col>
          <Col xs={24} sm={2} md={2} lg={2} xl={2}>
            <span style={{fontSize: 20, display: 'inline-block', width: '100%', textAlign: 'center'}}>x</span>
          </Col>
          <Col xs={24} sm={5} md={5} lg={5} xl={6}>
            <InputNumberField
              placeholder={t('labelPlaceHolderH')}
              required={isRequired}
              form={props.form}
              propertyName={propertyNameH}
              validateLength={50}
              decimalNumber={true}
              value={valueH}
              formItemLayout={formItemLayoutLWH}
              requiredMsg={t('msgFieldRequired')}
              validatedMsg={t('msgValidDecimalNumberTwoDigits')}
              onKeyUp={onChangeField}
            />
          </Col>
        </Row>,
      )}
    </FormItem>
  );
};
export default NumberLxWxH;
