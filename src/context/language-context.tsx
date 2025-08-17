
"use client";

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import en from "@/locales/en.json";
import hi from "@/locales/hi.json";
import bn from "@/locales/bn.json";

export type Language = "english" | "hindi" | "bengali";

const translations: Record<Language, any> = {
  english: en,
  hindi: hi,
  bengali: bn,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("english");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language | null;
    if (savedLang && translations[savedLang]) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = useCallback((key: string, params?: { [key: string]: string | number }) => {
    const keys = key.split('.');
    let result = translations[language];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        result = translations.english;
        for (const k_en of keys) {
            result = result?.[k_en];
        }
        break;
      }
    }

    if (typeof result === 'string' && params) {
        return result.replace(/\{\{(\w+)\}\}/g, (_, key) => `${params[key]}` || `{{${key}}}`);
    }

    return result || key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
