import { useState, useEffect } from 'react';

interface LanguageContextType {
  language: string;
  currency: string;
  setLanguage: (lang: string) => void;
  setCurrency: (curr: string) => void;
  formatCurrency: (amount: number) => string;
  t: (key: string) => string;
}

// Simple translations for basic terms
const translations = {
  es: {
    'dashboard': 'Dashboard',
    'bookings': 'Reservas',
    'settings': 'Configuración',
    'loading': 'Cargando...',
    'save': 'Guardar',
    'cancel': 'Cancelar',
  },
  en: {
    'dashboard': 'Dashboard',
    'bookings': 'Bookings',
    'settings': 'Settings',
    'loading': 'Loading...',
    'save': 'Save',
    'cancel': 'Cancel',
  },
  fr: {
    'dashboard': 'Tableau de bord',
    'bookings': 'Réservations',
    'settings': 'Paramètres',
    'loading': 'Chargement...',
    'save': 'Enregistrer',
    'cancel': 'Annuler',
  },
};

export function useLanguage(): LanguageContextType {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('transfermarbell-language');
    return saved || 'es';
  });

  const [currency, setCurrencyState] = useState(() => {
    const saved = localStorage.getItem('transfermarbell-currency');
    return saved || 'EUR';
  });

  useEffect(() => {
    localStorage.setItem('transfermarbell-language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('transfermarbell-currency', currency);
  }, [currency]);

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
  };

  const setCurrency = (curr: string) => {
    setCurrencyState(curr);
  };

  const formatCurrency = (amount: number): string => {
    const currencyConfig = {
      EUR: { symbol: '€', position: 'after', locale: 'es-ES' },
      USD: { symbol: '$', position: 'before', locale: 'en-US' },
      GBP: { symbol: '£', position: 'before', locale: 'en-GB' },
    };

    const config = currencyConfig[currency as keyof typeof currencyConfig] || currencyConfig.EUR;
    
    try {
      const formatted = new Intl.NumberFormat(config.locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
      
      return formatted;
    } catch (error) {
      // Fallback formatting
      const symbol = config.symbol;
      const formatted = amount.toFixed(2);
      return config.position === 'before' ? `${symbol}${formatted}` : `${formatted}${symbol}`;
    }
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations] || translations.es;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  return {
    language,
    currency,
    setLanguage,
    setCurrency,
    formatCurrency,
    t,
  };
}
