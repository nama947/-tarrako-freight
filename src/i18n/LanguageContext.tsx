import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  LanguageOption,
  LANGUAGE_OPTIONS,
  translations,
  TranslationDictionary,
  formatPrice as formatPriceUtil,
  formatInt as formatIntUtil,
} from './translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary;
  languageOptions: LanguageOption[];
  formatPrice: (amount: number) => string;
  formatInt: (num: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('tarrako_lang');
      if (saved === 'ca' || saved === 'es' || saved === 'en') {
        return saved;
      }
    } catch {
      // localStorage may fail in restricted sandboxes
    }
    return 'ca'; // Catalan default as requested
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('tarrako_lang', newLang);
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }, [lang]);

  const t = translations[lang] as unknown as TranslationDictionary;

  const formatPrice = (amount: number) => formatPriceUtil(amount, lang);
  const formatInt = (num: number) => formatIntUtil(num, lang);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t,
        languageOptions: LANGUAGE_OPTIONS,
        formatPrice,
        formatInt,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
