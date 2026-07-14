import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { translations } from './i18n';
import { dripperObjectTranslations } from '../../objects';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        ...translations.en.translation,
        ...dripperObjectTranslations.en,
      },
    },
    pt: {
      translation: {
        ...translations.pt.translation,
        ...dripperObjectTranslations.pt,
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes
  },
});

export default i18n;