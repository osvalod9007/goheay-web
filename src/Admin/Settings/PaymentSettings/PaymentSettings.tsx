import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Form, Row} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMutation} from 'react-apollo-hooks';
import {useRouter} from 'rift-router';
import gql from 'graphql-tag';
import {FormComponentProps} from 'antd/lib/form';

import AppStore from '../../../shared/stores/App.store';
import appModel from '../../../shared/models/App.model';
import {SiteSetting} from '../../../shared/cs/siteSettings.cs';
import settingsModel from '../../../shared/models/Settings.model';

import HeadTitle from '../../../shared/components/HeadTitle/HeadTitle';

import './PaymentSettings.less';

import PercentageField from '../../../shared/components/Inputs/PercentageField';
import InputSelectField from '../../../shared/components/Inputs/InputSelectField';
import InputWithPatternField from '../../../shared/components/Inputs/InputWithPatternField';

import openNotificationWithIcon from '../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';
import formatNumber from '../../../shared/utils/FormatNumber';

type LoginFormProps = FormComponentProps;

const EDIT_MUTATION = gql`
  mutation($input: SiteSettingUpdateInput!) {
    SiteSettingUpdate(input: $input) {
      bookingPrefix
      stripePublicKey
      stripePrivateKey
    }
  }
`;

export const PaymentSettings = (props: LoginFormProps): JSX.Element => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const [item, setItem] = useState(new SiteSetting());
  const [currencies, setCurrencies] = useState([]);
  const router = useRouter();

  useEffect(() => {
    getItem();
  }, []);

  // request Item to edit
  const getItem = async () => {
    try {
      appStore.setIsLoading(true);
      const currencyList: any = await appModel.getCurrencyList({
        page: 1,
        pageSize: 300,
        where: [{field: 'alphabeticCode', value: 'USD'}],
      });
      const mappedCurrencies = currencyList.data.CurrencyList.items.map(currency => {
        return {
          id: currency.id,
          name: `${currency.name} (${currency.alphabeticCode})`,
        };
      });
      setCurrencies(mappedCurrencies);
      const itemToEdit: any = await settingsModel.getPaymentSettings();
      setItem({...new SiteSetting(itemToEdit.data.SiteSettingGet)});
      appStore.setIsLoading(false);
    } catch (e) {
      appStore.setIsLoading(false);
      handleCatch(e, {}, '');
    }
  };

  const handleCatch = (error, values, textType) => {
    if (error && error.networkError && error.networkError.statusCode === 403) {
      appModel.logout();
      window.location.href = '/admin/login';
    } else {
      const {validation, ...others} = error.graphQLErrors[0];
      if (typeof validation === 'object') {
        Object.entries(validation).forEach(([key, value]) => {
          const obj = {};
          let msg = '';
          const splitted = key.split('.');
          const [keysplit] = splitted.slice(-1);
          switch (value) {
            case 'DUPLICITY': {
              msg = `${textType}` + keysplit + t('labelExistsPleaseChoose');
              break;
            }
            case 'INSTANCE_ALREADY_EXIST': {
              msg = `${textType}` + keysplit + t('labelExistsPleaseChoose');
              break;
            }
            case 'DOES_NOT_EXIST': {
              openNotificationWithIcon('error', t('labelSaveFailed'), `The ${textType} ${t('labelDontExist')}`);
              break;
            }
            case 'EMPTY_VALUE': {
              msg = `${textType}` + keysplit + t('labelNotBeEmpty');
              break;
            }
            case 'INVALID_VALUE': {
              msg = `${textType}` + keysplit + t('labelHaveInvalid');
              break;
            }
            default: {
              msg = `${value}`;
              break;
            }
          }
          if (msg !== '') {
            obj[keysplit] = {
              value: values[keysplit],
              errors: [new Error(`${msg}`)],
            };
            props.form.setFields(obj);
          }
        });
      } else {
        openNotificationWithIcon('error', t('labelSaveFailed'), error.message);
      }
    }

    appStore.setIsLoading(false);
  };

  const addMutation = useMutation(EDIT_MUTATION, {
    update: (proxy, result) => {
      /* your custom update logic */
      setTimeout(() => {
        appStore.setIsLoading(true);
        const {errors, data} = result;
        if (!errors) {
          appStore.setIsLoading(false);
          appStore.setIsEditing(false);
          const msg = `${t('labelPaymentSettings')} ${t('labelWereUpdated')}`;
          openNotificationWithIcon('success', msg, '');
        } else {
          const messages = [];
          for (const error of errors) {
            const obj = JSON.parse(error.message);
            for (const key in obj) {
              // messages.push(obj[key]);
            }
          }
          openNotificationWithIcon('error', t('lavelSaveFailed'), messages[0]);
        }
      });
    },
  });

  const handleSubmit = e => {
    e.preventDefault();

    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        appStore.setIsLoading(true);
        const {currency, ...obj} = values;

        addMutation({variables: {input: {...obj}}}).catch(error => {
          handleCatch(error, values, t('labelFleetOwner'));
        });
      } else {
        const error = t('errorMsgAuthAdmin');
        appStore.setHasError(true);
        appStore.setErrorMsg(error);
      }
    });
  };

  const formItemLayout = {
    wrapperCol: {
      xs: {span: 24},
      sm: {span: 15},
      md: {span: 12},
      lg: {span: 18},
      xl: {span: 15},
    },
  };

  return (
    <div className="payment-settings">
      <Form onSubmit={handleSubmit} layout="vertical" id={'payment-settings'} autoComplete={'off'}>
        <Card bordered={false} className="gutter-row">
          {/* comment by FA */}
          {/* <SwitchField
            label={t('labelStripeCardPayments')}
            required={true}
            form={props.form}
            propertyName="activePayment"
            formItemLayout={formSwitchLayout}
            requiredMsg={t('msgFieldRequired')}
            value={'Yes'}
            validatedMsg={`${t('msgValidLetters')} 50 ${t('msgCharactersMaximum')}`}
          />
          <Divider /> */}
          <Row type="flex" justify="space-between" align="middle" style={{marginBottom: '13px'}}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <HeadTitle icon="credit-card" title={t('labelPaymentSettings')} />
              <Divider />
            </Col>
          </Row>
          <Row type="flex" justify="space-between" align="top">
            <Col xs={24} sm={12} md={24} lg={12} xl={12}>
              <InputWithPatternField
                placeholder={t('labelPlaceholderStripeClientId')}
                label={t('labelStripeClientId')}
                required={true}
                form={props.form}
                propertyName="stripeAccountId"
                formItemLayout={formItemLayout}
                requiredMsg={t('msgFieldRequired')}
                value={item.stripeAccountId}
                validatedMsg={`${t('msgValidProvideValid')} ${t('labelStripeClientId')}`}
                pattern={/^[0-9a-zA-Z_]+$/}
              />
              <InputWithPatternField
                placeholder={t('labelPlaceholderStripePublishableKey')}
                label={t('labelStripePublishableKey')}
                required={true}
                form={props.form}
                propertyName="stripePublicKey"
                formItemLayout={formItemLayout}
                requiredMsg={t('msgFieldRequired')}
                value={item.stripePublicKey}
                validatedMsg={`${t('msgValidProvideValid')} ${t('labelStripePublishableKey')}`}
                pattern={/^[0-9a-zA-Z_]+$/}
              />
              <InputSelectField
                form={props.form}
                label={t('labelCurrency')}
                required={true}
                propertyName={'currencyId'}
                formItemLayout={formItemLayout}
                value={item.currency.id}
                requiredMsg={t('msgFieldRequired')}
                items={currencies}
                disabled={true}
              />
              <PercentageField
                placeholder={t('labelPlaceholderDriverCommission')}
                label={t('labelDriverCommission')}
                required={true}
                form={props.form}
                propertyName="fareDriverCommission"
                min={0}
                max={65}
                formItemLayout={formItemLayout}
                value={formatNumber.formatFloat(item.fareDriverCommission, 2)}
                requiredMsg={t('msgFieldRequired')}
                validatedMsg={t('msgValidPercentageMax65')}
              />
            </Col>
            <Col xs={24} sm={12} md={24} lg={12} xl={12}>
              <InputWithPatternField
                placeholder={t('labelPlaceholderStripeSecretKey')}
                label={t('labelStripeSecretKey')}
                required={true}
                form={props.form}
                propertyName="stripePrivateKey"
                formItemLayout={formItemLayout}
                requiredMsg={t('msgFieldRequired')}
                value={item.stripePrivateKey}
                validatedMsg={`${t('msgValidProvideValid')} ${t('labelStripeSecretKey')}`}
                pattern={/^[0-9a-zA-Z_]+$/}
              />
              <InputWithPatternField
                placeholder={t('labelPlaceholderBookingId')}
                label={t('labelBookingIdPrefix')}
                required={true}
                form={props.form}
                propertyName="bookingPrefix"
                formItemLayout={formItemLayout}
                requiredMsg={t('msgFieldRequired')}
                value={item.bookingPrefix}
                validatedMsg={`${t('msgValidLetters')}`}
                pattern={/^[a-zA-Z]+$/}
              />
              <PercentageField
                placeholder={t('labelPlaceholderNextDayPrice')}
                label={t('labelNextDayPrice')}
                required={true}
                form={props.form}
                propertyName="fareNextDayPrice"
                min={0}
                max={100}
                formItemLayout={formItemLayout}
                value={formatNumber.formatFloat(item.fareNextDayPrice)}
                requiredMsg={t('msgFieldRequired')}
                validatedMsg={t('msgValidPercentage')}
              />
              <PercentageField
                placeholder={t('labelPlaceholderFleetCommission')}
                label={t('labelFleetCommission')}
                required={true}
                form={props.form}
                propertyName="fareFleetCommission"
                min={0}
                max={65}
                formItemLayout={formItemLayout}
                value={formatNumber.formatFloat(item.fareFleetCommission)}
                requiredMsg={t('msgFieldRequired')}
                validatedMsg={t('msgValidPercentageMax65')}
              />
            </Col>
          </Row>

          <Button type="primary" htmlType="submit" className="payment-settings__button-submit">
            {t('labelUpdate')}
          </Button>
        </Card>
      </Form>
    </div>
  );
};

export default Form.create()(PaymentSettings);
