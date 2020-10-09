import * as React from 'react';
import {Form, Row, Col} from 'antd';
import {useTranslation} from 'react-i18next';
import InputNumberField from './InputNumberField';

type Props = {
  form: any;
  label?: string;
  propertyName: string;
  propertyNameMin: string;
  propertyNameMax: string;
  valueMin?: string;
  valueMax?: string;
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
  maxLength?: number;
  onKeyUp?: any;
  onValidate?: any;
  validatedMsgMin?: string;
  validatedMsgMax?: string;
};
const RangeField = (props: Props) => {
  const FormItem = Form.Item;
  const {t} = useTranslation('app');
  const validateField = (rule, val, callback) => {
    setTimeout(() => {
      if (
        props.form.getFieldValue(`${propertyNameMax}`) !== '' &&
        props.form.getFieldValue(`${propertyNameMax}`) !== null &&
        props.form.getFieldValue(`${propertyNameMax}`) !== undefined &&
        props.form.getFieldValue(`${propertyNameMin}`) !== '' &&
        props.form.getFieldValue(`${propertyNameMin}`) !== null &&
        props.form.getFieldValue(`${propertyNameMin}`) !== undefined
      ) {
        if (props.form.getFieldValue(`${propertyNameMin}`) > props.form.getFieldValue(`${propertyNameMax}`)) {
          callback([
            new Error(
              props.validatedMsgMin
                ? props.validatedMsgMin
                : `${t('msgValidValueGreaterThan')} ${props.form.getFieldValue(`${propertyNameMin}`)}`,
            ),
          ]);
        } else if (props.form.getFieldValue(`${propertyNameMax}`) < props.form.getFieldValue(`${propertyNameMin}`)) {
          callback([
            new Error(
              props.validatedMsgMax
                ? props.validatedMsgMax
                : `${t('msgValidValueLessThan')} ${props.form.getFieldValue(`${propertyNameMax}`)}`,
            ),
          ]);
        } else {
          callback();
        }
      } else {
        callback();
      }
    }, 300);
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
    validatedMsgMin,
    validatedMsgMax,
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
          <Col span={11}>
            <FormItem>
              <InputNumberField
                placeholder={t('labelPlaceHolderMin')}
                required={isRequired}
                form={props.form}
                propertyName={propertyNameMin}
                validateLength={validateLength}
                value={valueMin}
                formItemLayout={formItemLayoutMinMax}
                requiredMsg={t('msgValidOnlyDecimals')}
                decimalNumber={true}
                disabled={disableMin}
              />
            </FormItem>
          </Col>
          <Col span={2}>
            <span style={{fontSize: 20, display: 'inline-block', width: '100%', textAlign: 'center'}}>-</span>
          </Col>
          <Col span={11}>
            <FormItem>
              <InputNumberField
                placeholder={t('labelPlaceHolderMax')}
                required={isRequired}
                form={props.form}
                propertyName={propertyNameMax}
                validateLength={50}
                value={valueMax}
                decimalNumber={true}
                formItemLayout={formItemLayoutMinMax}
                requiredMsg={t('msgValidOnlyDecimals')}
                disabled={disableMax}
              />
            </FormItem>
          </Col>
        </Row>,
      )}
    </FormItem>
  );
};
export default RangeField;
