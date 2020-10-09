import React, {useContext, useState, useEffect} from 'react';
import {Button, Form, Input} from 'antd';
import {FormComponentProps} from 'antd/lib/form';
import {useTranslation} from 'react-i18next';
import {observer} from 'mobx-react-lite';
import CheckableTag from 'antd/lib/tag/CheckableTag';

import './StepTwoForgotForm.less';

import WizardStore from '../../../../../shared/stores/Wizard.store';
import AppStore from '../../../../../shared/stores/App.store';
import InputPasswordField from '../../../../../shared/components/Inputs/InputPasswordField';
import OTPSession from '../../../../../shared/components/OTP/OTPSession';
import FormItem from 'antd/lib/form/FormItem';
import ForgotPasswordStore from '../../../../../shared/stores/ForgotPassword.store';
import appModel from '../../../../../shared/models/App.model';
import openNotificationWithIcon from '../../../../../shared/components/OpenNotificationWithIcon/OpenNotificationWithIcon';

type StepTwoForgotFormProps = FormComponentProps;

const StepTwoForgotForm = observer((props: StepTwoForgotFormProps) => {
  const appStore = useContext(AppStore);
  const wizardStore = useContext(WizardStore);
  const forgotPasswordStore = useContext(ForgotPasswordStore);
  const {t} = useTranslation('app');
  const [token, setToken] = useState('');
  const msgSuccess: string = t('labelPasswordChanged');

  const otpRequest = async (input: any) => {
    try {
      appStore.setIsLoading(true);
      const request: any = await appModel.userPasswordUpdateUsingCode(input);
      if (request) {
        appStore.setIsLoading(false);
        forgotPasswordStore.setEmail('');
        wizardStore.setWizardStep(0);
        appStore.setIsLoginForm(true);
        openNotificationWithIcon('success', msgSuccess, '');
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
            case 'INCORRECT_OTP':
              keysplit = 'token';
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
        openNotificationWithIcon('error', t('labelSaveFailed'), error.message);
      }
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const {confirm, ...all} = values;
        otpRequest({...all, token});
      }
    });
  };

  const onChange = otp => {
    setToken(otp);
  };

  const layout = {
    labelCol: {},
    wrapperCol: {},
  };
  const labelSignIn: string = t('labelSignIn');
  const labelDone: string = t('labelDone');
  const {getFieldDecorator} = props.form;

  return (
    <Form
      onSubmit={handleSubmit}
      className="step-two-forgot-form"
      layout="vertical"
      id={'step-two-forgot-form'}
      autoComplete={'off'}
    >
      <OTPSession
        label={t('labelOTP')}
        isRequired={true}
        key={'token'}
        propertyName={'token'}
        form={props.form}
        validateLength={6}
        onChange={onChange}
        requiredMsg={t('msgFieldRequired')}
        validatedMsg={t('msgValidIncorrectOTP')}
      />
      <InputPasswordField
        placeholder={t('labelPlaceHolderNewPassword')}
        confirmPlaceholder={t('labelPlaceHolderConfirmNewPassword')}
        form={props.form}
        formItemLayout={layout}
        label={t('labelNewPassword')}
        propertyName="password"
        required={true}
        minLength={8}
        maxLength={15}
        requiredMsg={t('msgFieldRequired')}
        requiredMsgConfirm={t('msgFieldRequired')}
        value={''}
        validatedMsg={t('msgValidPassword')}
        isHorizontal={true}
        matchMsg={t('labelConfirmNewPassword')}
      />
      <FormItem style={{marginBottom: '0px'}}>
        {getFieldDecorator('email', {
          initialValue: forgotPasswordStore.email,
        })(<Input type="hidden" />)}
      </FormItem>
      <Button type="default" htmlType="submit" className="step-two-forgot-form__button">
        {labelDone}
      </Button>
      <div className="step-two-forgot-form__forgot-password">
        <CheckableTag
          onChange={() => {
            appStore.setIsLoginForm(true);
            wizardStore.wizardPrev();
          }}
          checked={appStore.isLoginForm}
        >
          {labelSignIn}
        </CheckableTag>
      </div>
    </Form>
  );
});

export default Form.create()(StepTwoForgotForm);
