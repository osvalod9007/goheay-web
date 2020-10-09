import React, {useContext, useEffect} from 'react';
import {observer} from 'mobx-react-lite';
import {Spin} from 'antd';
import AppStore from '../../shared/stores/App.store';
import WizardStore from '../../shared/stores/Wizard.store';
import {useTranslation} from 'react-i18next';
import './AuthAdmin.less';

import AuthAdminForm from './Form/AuthAdminForm';
import AuthAdminErrorContainer from './ErrorContainer/AuthAdminErrorContainer';
import StepOneForgotForm from './ForgotPassword/Wizard/StepOne/StepOneForgotForm';
import StepTwoForgotForm from './ForgotPassword/Wizard/StepTwo/StepTwoForgotForm';

const AuthAdmin: React.FC = observer(() => {
  const appStore = useContext(AppStore);
  const {t} = useTranslation('app');
  const wizardStore = useContext(WizardStore);

  useEffect(() => {
    const link: any = document.querySelector('link[rel*=icon]') || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = appStore.siteSettings.siteIconFile.publicUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [appStore.siteSettings.siteIconFile.publicUrl]);

  return (
    <Spin size="large" spinning={appStore.isLoading}>
      <div className="auth-admin">
        <div className="auth-admin__login-content">
          <AuthAdminErrorContainer />
          <div className="auth-admin__login-form">
            <div className="auth-admin__login-img">
              <img alt="" src={appStore.siteSettings.siteLogoFile.publicUrl} style={{maxWidth: 205, minHeight: 50}} />
            </div>
            <h1 className="auth-admin__login-title">
              {appStore.isLoginForm
                ? t('labelLogin')
                : wizardStore.current > 0
                ? t('labelResetPassword')
                : wizardStore.current === 0
                ? t('labelForgotPassword')
                : ''}
            </h1>
            {appStore.isLoginForm ? (
              <AuthAdminForm />
            ) : wizardStore.current === 0 ? (
              <StepOneForgotForm />
            ) : (
              <StepTwoForgotForm />
            )}
          </div>
        </div>
      </div>
    </Spin>
  );
});

export default AuthAdmin;
