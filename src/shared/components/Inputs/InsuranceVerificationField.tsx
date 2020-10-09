import * as React from 'react';
import {Col, Row, Checkbox} from 'antd';
import {useTranslation} from 'react-i18next';
import FormItem from 'antd/lib/form/FormItem';

type Props = {
  form: any;
  label?: string;
  width?: string;
  labelFirst?: string;
  labelSecond?: string;
  requiredMsgFirst?: string;
  requiredMsgSecond?: string;
  propertyNameFirst: string;
  propertyNameSecond: string;
  valueFirst?: boolean;
  valueSecond?: boolean;
  isRequired?: boolean;
  formItemLayout?: any;
};
const InsuranceVerificationField = (props: Props) => {
  const {t} = useTranslation('app');
  const {
    form,
    label,
    width,
    isRequired,
    propertyNameFirst,
    labelFirst,
    labelSecond,
    propertyNameSecond,
    valueFirst,
    valueSecond,
    formItemLayout,
    requiredMsgFirst,
    requiredMsgSecond,
  } = props;

  const layout = formItemLayout || {
    labelCol: {
      xs: {span: 24},
      sm: {span: 8},
      md: {span: 10},
      lg: {span: 7},
      xl: {span: 10},
    },
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 14},
      md: {span: 24},
      lg: {span: 24},
      xl: {span: 24},
    },
  };
  const {getFieldDecorator} = form;
  return (
    <React.Fragment>
      {isRequired ? (
        <label>
          <span style={{color: 'red'}}>* </span>
          {''}
          <span>{label}</span>
        </label>
      ) : (
        <span>{label}</span>
      )}
      <Row type={'flex'} justify={'center'} style={{width: width || '100%', marginLeft: '5px'}}>
        <Col xs={24} sm={4} md={20} lg={20} xl={20}>
          <FormItem {...layout} style={{marginTop: 8, marginBottom: 15}}>
            {getFieldDecorator(propertyNameFirst, {
              rules: [
                {
                  message: requiredMsgFirst || `Please check ${labelFirst}!`,
                  required: isRequired,
                },
              ],
            })(<Checkbox defaultChecked={valueFirst ? true : false}>{labelFirst}</Checkbox>)}
          </FormItem>
        </Col>
        <Col xs={24} sm={4} md={20} lg={20} xl={20}>
          <FormItem {...layout}>
            {getFieldDecorator(propertyNameSecond, {
              rules: [
                {
                  message: requiredMsgSecond || `Please check ${labelSecond}!`,
                  required: isRequired,
                },
              ],
            })(<Checkbox defaultChecked={valueSecond ? true : false}>{labelSecond}</Checkbox>)}
          </FormItem>
        </Col>
      </Row>
    </React.Fragment>
  );
};
export default InsuranceVerificationField;
