import React, {useContext} from 'react';
import {Alert} from 'antd';
import {observer} from 'mobx-react-lite';
import AppStore from '../../../shared/stores/App.store';

import './AuthAdminErrorContainer.less';

const AuthAdminErrorContainer: React.FC = observer(() => {
  const appStore = useContext(AppStore);
  return (
    <div
      className={
        appStore.hasError ? `auth-admin-error-container auth-admin-error-container__in` : `auth-admin-error-container`
      }
    >
      <Alert message={appStore.errorMsg} type="error" showIcon />
    </div>
  );
});
export default AuthAdminErrorContainer;
