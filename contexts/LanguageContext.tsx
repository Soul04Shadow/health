"use client";
import { createContext, useState, useEffect, ReactNode, FC } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  translations: any;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('curez_language') || 'en';
    }
    return 'en';
  });
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    const loadTranslations = async () => {
      try {
        const newTranslations = await import(`../locales/${language}.json`);
        setTranslations(newTranslations.default);
      } catch (error) {
        console.error(`Could not load translations for ${language}`, error);
        // Fallback to English if the selected language file is not found
        const enTranslations = await import(`../locales/en.json`);
        setTranslations(enTranslations.default);
      }
    };

    loadTranslations();
  }, [language]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('curez_language', language);
    }
  }, [language]);

  const value = {
    language,
    setLanguage,
    translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
