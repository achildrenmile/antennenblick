import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import de from './de.json';
import en from './en.json';

type Language = 'de' | 'en';
type Translations = typeof de;

interface I18nContextType {
  language: Language;
  t: Translations;
  toggleLanguage: () => void;
}

const translations: Record<Language, Translations> = { de, en };

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('de');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'de' ? 'en' : 'de');
  }, []);

  const value: I18nContextType = {
    language,
    t: translations[language],
    toggleLanguage,
  };

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
