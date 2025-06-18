
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en'); // Default to English

  useEffect(() => {
    // Load saved language from localStorage on mount
    try {
      const storedLanguage = localStorage.getItem('schoolcom-language') as Language;
      if (storedLanguage && (storedLanguage === 'en' || storedLanguage === 'es')) {
        setLanguage(storedLanguage);
      }
    } catch (error) {
      console.error("Error reading language from localStorage", error);
    }
  }, []);

  const handleSetLanguage = useCallback((langAction: SetStateAction<Language>) => {
    setLanguage(prevLang => {
      const newLang = typeof langAction === 'function' ? langAction(prevLang) : langAction;
      try {
        localStorage.setItem('schoolcom-language', newLang);
        document.documentElement.lang = newLang; // Update html lang attribute
      } catch (error) {
        console.error("Error writing language to localStorage", error);
      }
      return newLang;
    });
  }, []);

  const toggleLanguage = useCallback(() => {
    handleSetLanguage(prev => (prev === 'en' ? 'es' : 'en'));
  }, [handleSetLanguage]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
