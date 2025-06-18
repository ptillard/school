
"use client";

import { useLanguage, type Language } from '@/contexts/LanguageContext';
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';

type TranslationKey = keyof typeof enTranslations; // Assuming en.json has all keys

interface Translations {
  en: Record<TranslationKey, string>;
  es: Record<TranslationKey, string>;
}

const translations: Translations = {
  en: enTranslations as Record<TranslationKey, string>,
  es: esTranslations as Record<TranslationKey, string>,
};

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: TranslationKey, replacements?: Record<string, string | number>): string => {
    let translationSet: Record<string, string>;

    if (language === 'es') {
      translationSet = translations.es;
    } else {
      translationSet = translations.en;
    }
    
    let translatedString = translationSet[key] || translations.en[key] || String(key); // Fallback to EN, then key

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        translatedString = translatedString.replace(`{${placeholder}}`, String(replacements[placeholder]));
      });
    }
    return translatedString;
  };

  return { t, currentLanguage: language };
};
