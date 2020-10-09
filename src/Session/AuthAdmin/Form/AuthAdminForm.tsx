import React, {useContext} from 'react';
import {Button, Form} from 'antd';
import {useTranslation} from 'react-i18next';
import {FormComponentProps} from 'antd/lib/form';
import AppStore from '../../../shared/stores/App.store';

import './AuthAdminForm.less';

import InputPasswordSimpleField from '../../../shared/components/Inputs/InputPasswordSimpleField';
import InputEmailField from '../../../shared/components/Inputs/InputEmailField';
import CheckableTag from 'antd/lib/tag/CheckableTag';
import settingsModel from '../../../shared/models/Settings.model';

type LoginFormProps = FormComponentProps;

export const AuthAdminForm = (props: LoginFormProps): JSX.Element => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');

  const handleSubmit = e => {
    e.preventDefault();

    props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        appStore.setIsLoading(true);
        const data = {
          email: props.form.getFieldValue('email'),
          password: props.form.getFieldValue('password'),
        };
        const errorMsgAuth: string = t('errorMsgAuth');
        appStore
          .loginAsAdmin(data, errorMsgAuth)
          .then(result => {
            window.location.pathname = 'admin/dashboard';
            // if (appStore.hasRole(appStore.roles, ['TYPE_SUPER_ADMIN'])) {
            //   window.location.pathname = 'admin/dashboard';
            // } else if (appStore.hasRole(appStore.roles, ['TYPE_FLEET_OWNER'])) {
            //   window.location.pathname = 'admin/fleetowner';
            // }
          })
          .catch(ee => {
            // console.log('errrr')
          });
      }
    });
  };

  const layout = {
    labelCol: {},
    wrapperCol: {},
  };
  const labelEmail: string = t('labelEmail');
  const labelForgotPassword: string = t('labelForgotPassword');

  return (
    <Form
      onSubmit={handleSubmit}
      className="auth-admin-form"
      layout="vertical"
      id={'admin-form-session'}
      autoComplete={'off'}
    >
      <InputEmailField
        placeholder={t('labelPlaceHolderEmail')}
        form={props.form}
        label={labelEmail}
        required={true}
        propertyName={'email'}
        formItemLayout={layout}
        validateLength={50}
        requiredMsg={t('msgFieldRequired')}
        validatedMsg={t('msgValidEmail')}
      />
      <InputPasswordSimpleField
        icon={false}
        colon={true}
        required={true}
        form={props.form}
        label={t('labelPassword')}
        propertyName={'password'}
        placeholder={t('labelPlaceHolderPassword')}
        requiredMsg={t('msgFieldRequired')}
      />
      <Button type="default" htmlType="submit" className="auth-admin-form__button">
        {t('labelSignIn')}
      </Button>
      <div className="auth-admin-form__forgot-password">
        <CheckableTag
          onChange={() => {
            appStore.setIsLoginForm(false);
          }}
          checked={!appStore.isLoginForm}
        >
          {labelForgotPassword}?
        </CheckableTag>
      </div>
    </Form>
  );
};

export default Form.create()(AuthAdminForm);
