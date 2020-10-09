import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import app_es from './translations/es/app.json';
import app_en from './translations/en/app.json';

i18n
.use(initReactI18next)
.init({
    debug: true,
    lng: 'en-US',
    resources: {
        en: {
            app: app_en
        },
        es: {
            app: app_es
        }
    },
    ns: ['app'],
    react: {
      wait: true,
      bindI18n: 'languageChanged loaded',
      bindStore: 'added removed',
      nsMode: 'default'
    }
  });
  
  export default i18n;