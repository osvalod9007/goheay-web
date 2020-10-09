import React, {useContext, useState} from 'react';
import {Button, Form, Input, Switch, Select, notification, Spin, Row, Col} from 'antd';
import {CardElement} from 'react-stripe-elements';
import StripeHOC from './StripeHOC';
import './StripeAddCard.less';
import {observer} from 'mobx-react-lite';
import {useTranslation} from 'react-i18next';
import AppStore from '../../../shared/stores/App.store';

const openNotificationWithIcon = (type, message, description) => {
  notification[type]({
    message,
    description,
  });
};
const style = {
  labelCol: {style: {marginBottom: 0, padding: 0, color: '#999'}},
  formItem: {marginBottom: 5},
};
interface Props {
  form: any;
  stripe: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}
const StripeAddCard = observer((props: Props) => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const {form, onCancel, onSuccess} = props;
  const {getFieldDecorator} = form;
  const handleSubmit = e => {
    e.preventDefault();
    if (!appStore.isLoading) {
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {stripe} = props;
          const {cardName, isDefault} = values;
          appStore.setIsLoading(true);
          stripe
            .createToken({type: 'card', name: cardName})
            .then(response => {
              const {token, error} = response;
              if (error) {
                openNotificationWithIcon('error', t('labelError'), error.message);
                appStore.setIsLoading(false);
              } else {
                storeCard(token.id, isDefault);
              }
            })
            .catch(response => {
              appStore.setIsLoading(false);
            });
        }
      });
    }
  };
  const storeCard = (token: string, cardType, isDefault?: boolean) => {
    try {
      // const passengerId = addPaymentStore.passenger.id;
      // Save BE
      // await paymentModel.store({ passengerId: +passengerId, stripejs_tok: token, isDefault });
      // addPaymentStore.setVisible(false);
      onSuccess && onSuccess();
      openNotificationWithIcon('success', t('labelCardStored'), t('msgCardStored'));
    } catch (e) {
      openNotificationWithIcon('error', t('labelError'), t('errorMsgCardStored'));
    } finally {
      appStore.setIsLoading(false);
    }
  };
  return (
    <Spin spinning={appStore.isLoading}>
      <Form layout="vertical" onSubmit={handleSubmit} className="stripe-add-card">
        <Row justify={'center'}>
          <Col xs={24}>
            <h2>Card Information</h2>
            <Form.Item style={style.formItem} labelCol={style.labelCol} label={t('labelNameOnCard')}>
              {getFieldDecorator('cardName')(<Input placeholder={t('labelName')} />)}
            </Form.Item>
            <label>
              Card details
              <CardElement hidePostalCode={true} className={'antcard-input'} />
            </label>
            <Row>
              <Col style={{textAlign: 'right'}}>
                {onCancel && (
                  <Button
                    onClick={e => {
                      e.preventDefault();
                      onCancel();
                    }}
                    style={{minWidth: 100, marginRight: 10}}
                  >
                    {t('Cancel')}
                  </Button>
                )}
                <Button htmlType={'submit'} type={'primary'} style={{minWidth: 100}}>
                  {t('Create')}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Spin>
  );
});
export default Form.create()(StripeHOC(StripeAddCard));
