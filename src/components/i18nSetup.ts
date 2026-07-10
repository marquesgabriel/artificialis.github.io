import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './i18n';

i18n.use(initReactI18next).init({
  resources: translations,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export default i18n;