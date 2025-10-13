import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { InitOptions } from 'i18next';

// Supported languages configuration
export const SUPPORTED_LANGUAGES = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: 'HH:mm',
    currency: 'USD',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 2,
    },
  },
  it: {
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      precision: 2,
    },
  },
  es: {
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      precision: 2,
    },
  },
  fr: {
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      precision: 2,
    },
  },
  de: {
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      precision: 2,
    },
  },
  pt: {
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇵🇹',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'EUR',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      precision: 2,
    },
  },
  ar: {
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'SAR',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 2,
    },
  },
  zh: {
    name: 'Chinese',
    nativeName: '中文',
    flag: '🇨🇳',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    currency: 'CNY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 2,
    },
  },
  ja: {
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    currency: 'JPY',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 0,
    },
  },
  ko: {
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
    currency: 'KRW',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 0,
    },
  },
  ru: {
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: 'HH:mm',
    currency: 'RUB',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      precision: 2,
    },
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: 'HH:mm',
    currency: 'INR',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      precision: 2,
    },
  },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

// Default language - Force English for Y Combinator demo
export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Language detection options - Force English for Y Combinator demo
export const LANGUAGE_DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator', 'htmlTag'],
  lookupLocalStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,
  caches: ['localStorage'],
  excludeCacheFor: ['cimode'],
  cookieMinutes: 365,
  cookieDomain: 'myDomain',
  htmlTag: document.documentElement,
  checkWhitelist: true,
  // Force English for demo
  fallbackLng: 'en',
  supportedLngs: ['en'],
};

// i18n configuration
const i18nConfig = {
  debug: process.env.NODE_ENV === 'development',
  
  // Language detection
  detection: LANGUAGE_DETECTION_OPTIONS,
  
  // Fallback language
  fallbackLng: DEFAULT_LANGUAGE,
  
  // Supported languages
  supportedLngs: Object.keys(SUPPORTED_LANGUAGES),
  
  // Interpolation
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  
  // Backend configuration
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json',
    addPath: '/locales/{{lng}}/{{ns}}.json',
    crossDomain: false,
    withCredentials: false,
    requestOptions: {
      mode: 'cors',
      credentials: 'same-origin',
      cache: 'default',
    },
  },
  
  // Namespaces
  ns: ['common', 'dashboard', 'auth', 'chatbot', 'errors', 'notifications', 'settings'],
  defaultNS: 'common',
  
  // React integration
  react: {
    useSuspense: true,
    bindI18n: 'languageChanged loaded',
    bindI18nStore: 'added removed',
    nsMode: 'default',
  },
  
  // Plural rules
  pluralSeparator: '_',
  contextSeparator: '_',
  
  // Key separator
  keySeparator: '.',
  nsSeparator: ':',
  
  // Save missing keys
  saveMissing: process.env.NODE_ENV === 'development',
  saveMissingTo: 'current',
  
  // Missing key handler
  missingKeyHandler: (lngs: readonly string[], ns: string, key: string, fallbackValue: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation key: ${key} in namespace: ${ns} for language: ${lngs[0]}`);
    }
    return fallbackValue;
  },
  
  // Parse missing key handler
  parseMissingKeyHandler: (key: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Missing translation key: ${key}`);
    }
    return key;
  },
  
  // Post processing
  postProcess: ['reactI18next'],
  postProcessors: [],
  
  // Return empty string for missing keys
  returnEmptyString: false,
  returnNull: false,
  
  // Preload languages
  preload: [DEFAULT_LANGUAGE],
  
  // Init immediate
  initImmediate: false,
};

// Initialize i18n
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(i18nConfig as InitOptions);

// Language utilities
export const getLanguageConfig = (language: SupportedLanguage) => {
  return SUPPORTED_LANGUAGES[language];
};

export const isRTL = (language: SupportedLanguage) => {
  return SUPPORTED_LANGUAGES[language].direction === 'rtl';
};

export const getCurrentLanguage = (): SupportedLanguage => {
  return (i18n.language as SupportedLanguage) || DEFAULT_LANGUAGE;
};

export const setLanguage = async (language: SupportedLanguage) => {
  await i18n.changeLanguage(language);
  
  // Update document direction for RTL languages
  const isRTLLanguage = isRTL(language);
  document.documentElement.dir = isRTLLanguage ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
  
  // Update document title
  const title = i18n.t('common:app.title');
  if (title) {
    document.title = title;
  }
  
  // Store language preference
  localStorage.setItem('preferredLanguage', language);
  
  return language;
};

export const getPreferredLanguage = (): SupportedLanguage => {
  const stored = localStorage.getItem('preferredLanguage') as SupportedLanguage;
  if (stored && SUPPORTED_LANGUAGES[stored]) {
    return stored;
  }
  
  // Detect from browser
  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  if (SUPPORTED_LANGUAGES[browserLang]) {
    return browserLang;
  }
  
  return DEFAULT_LANGUAGE;
};

// Format utilities
export const formatNumber = (
  value: number,
  language: SupportedLanguage = getCurrentLanguage(),
  options?: Intl.NumberFormatOptions
) => {
  const config = getLanguageConfig(language);
  const locale = language === 'en' ? 'en-US' : language;
  
  const defaultOptions: Intl.NumberFormatOptions = {
    minimumFractionDigits: config.numberFormat.precision,
    maximumFractionDigits: config.numberFormat.precision,
    ...options,
  };
  
  return new Intl.NumberFormat(locale, defaultOptions).format(value);
};

export const formatCurrency = (
  value: number,
  language: SupportedLanguage = getCurrentLanguage(),
  currency?: string
) => {
  const config = getLanguageConfig(language);
  const locale = language === 'en' ? 'en-US' : language;
  const currencyCode = currency || config.currency;
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: config.numberFormat.precision,
    maximumFractionDigits: config.numberFormat.precision,
  }).format(value);
};

export const formatDate = (
  date: Date | string | number,
  language: SupportedLanguage = getCurrentLanguage(),
  options?: Intl.DateTimeFormatOptions
) => {
  const locale = language === 'en' ? 'en-US' : language;
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

export const formatTime = (
  date: Date | string | number,
  language: SupportedLanguage = getCurrentLanguage(),
  options?: Intl.DateTimeFormatOptions
) => {
  const locale = language === 'en' ? 'en-US' : language;
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
};

export const formatRelativeTime = (
  date: Date | string | number,
  language: SupportedLanguage = getCurrentLanguage()
) => {
  const locale = language === 'en' ? 'en-US' : language;
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else if (diffInSeconds < 2592000) {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  } else if (diffInSeconds < 31536000) {
    return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  }
};

// Export i18n instance
export default i18n;