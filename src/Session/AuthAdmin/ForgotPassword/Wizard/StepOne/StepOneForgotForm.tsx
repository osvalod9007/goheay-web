import React, {useContext, useEffect} from 'react';
import {Button, Form} from 'antd';
import {useTranslation} from 'react-i18next';
import {FormComponentProps} from 'antd/lib/form';
import './StepOneForgotForm.less';

import AppStore from '../../../../../shared/stores/App.store';
import WizardStore from '../../../../../shared/stores/Wizard.store';
import ForgotPasswordStore from '../../../../../shared/stores/ForgotPassword.store';

import InputEmailField from '../../../../../shared/components/Inputs/InputEmailField';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import {observer} from 'mobx-react-lite';
import appModel from '../../../../../shared/models/App.model';
import openNotificationWithIcon from '../../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';

type StepOneForgotFormProps = FormComponentProps;

export const StepOneForgotForm = observer(
  (props: StepOneForgotFormProps): JSX.Element => {
    const appStore = useContext(AppStore);
    const wizardStore = useContext(WizardStore);
    const forgotPasswordStore = useContext(ForgotPasswordStore);
    const {t} = useTranslation('app');

    const otpRequest = async (input: any) => {
      try {
        appStore.setIsLoading(true);
        const request: any = await appModel.forgotPasswordRequestCreate(input);
        if (request) {
          const {email} = input;
          forgotPasswordStore.setEmail(email);
          appStore.setIsLoading(false);
          wizardStore.wizardNext();
        }
      } catch (e) {
        handleCatch(e, input, '');
        appStore.setIsLoading(false);
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
            let [keysplit] = splitted.slice(-1);
            switch (value) {
              default: {
                msg = `${value}`;
                break;
              }
            }
            switch (keysplit) {
              case 'EMAIL_DO_NOT_REGISTERED':
                keysplit = 'email';
                break;
              default:
                break;
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
          // openNotificationWithIcon('error', t('labelSaveFailed'), error.message);
        }
      }
    };

    const handleSubmit = e => {
      e.preventDefault();
      props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          otpRequest(values);
        }
      });
    };

    const layout = {
      labelCol: {},
      wrapperCol: {},
    };
    const labelEmail: string = t('labelEmail');
    const labelSubmit: string = t('labelSubmit');
    const labelSignIn: string = t('labelSignIn');

    return (
      <Form
        onSubmit={handleSubmit}
        className="step-one-forgot-form"
        layout="vertical"
        id={'step-one-forgot-form'}
        autoComplete={'off'}
      >
        <InputEmailField
          form={props.form}
          label={labelEmail}
          required={true}
          propertyName={'email'}
          formItemLayout={layout}
          validateLength={60}
          validatedMsg={t('msgValidEmail')}
          requiredMsg={t('msgFieldRequired')}
        />
        <Button type="default" htmlType="submit" className="step-one-forgot-form__button">
          {labelSubmit}
        </Button>
        <div className="step-one-forgot-form__forgot-password">
          <CheckableTag
            onChange={() => {
              appStore.setIsLoginForm(true);
            }}
            checked={appStore.isLoginForm}
          >
            {labelSignIn}
          </CheckableTag>
        </div>
      </Form>
    );
  },
);

export default Form.create()(StepOneForgotForm);
