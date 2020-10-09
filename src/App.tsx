import React, {Suspense, useContext, useEffect} from 'react';
import {I18nextProvider} from 'react-i18next';
import {ConfigProvider, Spin} from 'antd';
import AppStore from './shared/stores/App.store';
import './App.less';

import Routing from './Routes/Routing';
import i18n from './shared/i18n/i18n';
import settingsModel from './shared/models/Settings.model';
import {SiteSetting} from './shared/cs/siteSettings.cs';

const App: React.FC = () => {
  const appStore = useContext(AppStore);
  i18n.changeLanguage(appStore.getLanguage().locale);
  useEffect(() => {
    getItem();
  }, []);
  // request Item to edit
  const getItem = async () => {
    try {
      const itemToEdit: any = await settingsModel.getSystemSettings();
      appStore.setSiteSettings({...new SiteSetting(itemToEdit.data.SiteSettingGet)});
    } catch (e) {
      appStore.setIsLoading(false);
    }
  };
  useEffect(() => {
    const link: any = document.querySelector('link[rel*=icon]') || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = appStore.siteSettings.siteIconFile.publicUrl;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, [appStore.siteSettings.siteIconFile.publicUrl]);
  return (
    <div className="goheavy-app">
      <Suspense fallback={<Spin size="large" spinning={appStore ? appStore.isLoading : false} />}>
        <I18nextProvider i18n={i18n}>
          <ConfigProvider locale={appStore.getLanguage()}>
            <Routing />
          </ConfigProvider>
        </I18nextProvider>
      </Suspense>
    </div>
  );
};

export default App;
