
"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';

// Define a more flexible type for translation objects that can be nested.
type NestedTranslationValue = string | { [key: string]: NestedTranslationValue };
type TranslationData = { [key: string]: NestedTranslationValue };

const translations: { en: TranslationData; es: TranslationData } = {
  en: enTranslations as TranslationData,
  es: esTranslations as TranslationData,
};

// Recursive helper to get nested value
function getNestedValue(obj: TranslationData | undefined, path: string): string | undefined {
  if (!obj) return undefined;
  const keys = path.split('.');
  let current: NestedTranslationValue | undefined = obj;

  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined; // Path does not exist or is not an object
    }
  }
  return typeof current === 'string' ? current : undefined; // Ensure the final value is a string
}


export const useTranslation = () => {
  const { language } = useLanguage();

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const primaryLangTranslations = language === 'es' ? translations.es : translations.en;
    const fallbackLangTranslations = translations.en; // Always fallback to English

    let translatedString = getNestedValue(primaryLangTranslations, key);

    if (translatedString === undefined) {
      // Try fallback language if translation not found in primary
      translatedString = getNestedValue(fallbackLangTranslations, key);
    }
    
    if (translatedString === undefined) {
        // If still not found, return the key itself or a placeholder
        // This makes it obvious if a translation is missing
        console.warn(`Translation key "${key}" not found for language "${language}".`);
        translatedString = key; 
    }

    if (replacements && typeof translatedString === 'string') {
      Object.keys(replacements).forEach(placeholder => {
        translatedString = (translatedString as string).replace(`{${placeholder}}`, String(replacements[placeholder]));
      });
    }
    return translatedString as string; // Ensure final return is string
  };

  return { t, currentLanguage: language };
};
