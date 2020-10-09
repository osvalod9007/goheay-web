import * as React from 'react';
import {Col, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import NumberPlusField from './NumberPlusField';

type Props = {
  form: any;
  label?: string;
  width?: string;
  propertyNameSingle: string;
  propertyNameMultiple: string;
  valueSingle?: number;
  valueMultiple?: number;
  validateLength: number;
  isRequired?: boolean;
  formItemLayout?: any;
  maxLength?: number;
};
const InputSingleMultipleField = (props: Props) => {
  const {t} = useTranslation('app');
  const {
    form,
    label,
    width,
    propertyNameSingle,
    propertyNameMultiple,
    valueSingle,
    valueMultiple,
    formItemLayout,
  } = props;

  const layout = formItemLayout || {
    labelCol: {
      xs: {span: 24},
      sm: {span: 12},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 24},
    },
  };
  return (
    <React.Fragment>
      <h3> {label}</h3>
      <Row type={'flex'} justify={'start'} style={{width: width || '75%'}}>
        <Col>
          <NumberPlusField
            title={t('labelPlaceHolderSingle')}
            required={true}
            form={form}
            propertyName={propertyNameSingle}
            value={valueSingle || 0}
            formItemLayout={layout}
            requiredMsg={t('msgFieldRequired')}
            validateMsg={`${t('msgValidValueGreaterThan')} 0`}
          />
        </Col>
        <Col>
          <NumberPlusField
            title={t('labelPlaceHolderMultiple')}
            required={true}
            form={form}
            propertyName={propertyNameMultiple}
            value={valueMultiple || 0}
            formItemLayout={layout}
            requiredMsg={t('msgFieldRequired')}
            validateMsg={`${t('msgValidValueGreaterThan')} 0`}
          />
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default InputSingleMultipleField;
