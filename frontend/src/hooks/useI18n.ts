import { useTranslation } from 'react-i18next';
import { useCallback, useMemo } from 'react';
import { 
  SUPPORTED_LANGUAGES, 
  SupportedLanguage, 
  setLanguage, 
  getCurrentLanguage,
  isRTL,
  formatNumber,
  formatCurrency,
  formatDate,
  formatTime,
  formatRelativeTime
} from '../i18n/config';

// Hook for language management
export const useLanguageManager = () => {
  const { i18n } = useTranslation();
  const currentLanguage = getCurrentLanguage();

  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    try {
      await setLanguage(language);
      return true;
    } catch (error) {
      console.error('Failed to change language:', error);
      return false;
    }
  }, []);

  const getLanguageConfig = useCallback((language: SupportedLanguage) => {
    return SUPPORTED_LANGUAGES[language];
  }, []);

  const getSupportedLanguages = useCallback(() => {
    return Object.entries(SUPPORTED_LANGUAGES).map(([code, config]) => ({
      code: code as SupportedLanguage,
      name: config.name,
      nativeName: config.nativeName,
      flag: config.flag,
      direction: config.direction,
      isRTL: isRTL(code as SupportedLanguage),
    }));
  }, []);

  const isCurrentLanguageRTL = useMemo(() => {
    return isRTL(currentLanguage);
  }, [currentLanguage]);

  return {
    currentLanguage,
    changeLanguage,
    getLanguageConfig,
    getSupportedLanguages,
    isCurrentLanguageRTL,
    isReady: i18n.isInitialized,
  };
};

// Hook for number formatting
export const useNumberFormat = () => {
  const { currentLanguage } = useLanguageManager();

  const formatNumberWithLocale = useCallback((
    value: number,
    options?: Intl.NumberFormatOptions
  ) => {
    return formatNumber(value, currentLanguage, options);
  }, [currentLanguage]);

  const formatCurrencyWithLocale = useCallback((
    value: number,
    currency?: string
  ) => {
    return formatCurrency(value, currentLanguage, currency);
  }, [currentLanguage]);

  const formatPercentage = useCallback((
    value: number,
    decimals: number = 2
  ) => {
    return formatNumber(value, currentLanguage, {
      style: 'percent',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }, [currentLanguage]);

  const formatFileSize = useCallback((bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${formatNumber(size, currentLanguage, {
      maximumFractionDigits: 2,
    })} ${units[unitIndex]}`;
  }, [currentLanguage]);

  return {
    formatNumber: formatNumberWithLocale,
    formatCurrency: formatCurrencyWithLocale,
    formatPercentage,
    formatFileSize,
  };
};

// Hook for date/time formatting
export const useDateTimeFormat = () => {
  const { currentLanguage } = useLanguageManager();

  const formatDateWithLocale = useCallback((
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ) => {
    return formatDate(date, currentLanguage, options);
  }, [currentLanguage]);

  const formatTimeWithLocale = useCallback((
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ) => {
    return formatTime(date, currentLanguage, options);
  }, [currentLanguage]);

  const formatRelativeTimeWithLocale = useCallback((
    date: Date | string | number
  ) => {
    return formatRelativeTime(date, currentLanguage);
  }, [currentLanguage]);

  const formatDateTime = useCallback((
    date: Date | string | number,
    options?: Intl.DateTimeFormatOptions
  ) => {
    return formatDate(date, currentLanguage, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    });
  }, [currentLanguage]);

  const formatShortDate = useCallback((
    date: Date | string | number
  ) => {
    return formatDate(date, currentLanguage, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, [currentLanguage]);

  const formatShortTime = useCallback((
    date: Date | string | number
  ) => {
    return formatTime(date, currentLanguage, {
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [currentLanguage]);

  const formatMonthYear = useCallback((
    date: Date | string | number
  ) => {
    return formatDate(date, currentLanguage, {
      year: 'numeric',
      month: 'long',
    });
  }, [currentLanguage]);

  const formatWeekday = useCallback((
    date: Date | string | number
  ) => {
    return formatDate(date, currentLanguage, {
      weekday: 'long',
    });
  }, [currentLanguage]);

  const formatShortWeekday = useCallback((
    date: Date | string | number
  ) => {
    return formatDate(date, currentLanguage, {
      weekday: 'short',
    });
  }, [currentLanguage]);

  return {
    formatDate: formatDateWithLocale,
    formatTime: formatTimeWithLocale,
    formatRelativeTime: formatRelativeTimeWithLocale,
    formatDateTime,
    formatShortDate,
    formatShortTime,
    formatMonthYear,
    formatWeekday,
    formatShortWeekday,
  };
};

// Hook for pluralization
export const usePluralization = () => {
  const { t } = useTranslation();

  const pluralize = useCallback((
    key: string,
    count: number,
    options?: Record<string, any>
  ) => {
    return t(key, { count, ...options });
  }, [t]);

  const pluralizeWithFallback = useCallback((
    key: string,
    count: number,
    fallback: string,
    options?: Record<string, any>
  ) => {
    const result = t(key, { count, ...options });
    return result === key ? fallback : result;
  }, [t]);

  return {
    pluralize,
    pluralizeWithFallback,
  };
};

// Hook for text direction
export const useTextDirection = () => {
  const { isCurrentLanguageRTL } = useLanguageManager();

  const getTextDirection = useCallback(() => {
    return isCurrentLanguageRTL ? 'rtl' : 'ltr';
  }, [isCurrentLanguageRTL]);

  const isRTLText = useCallback(() => {
    return isCurrentLanguageRTL;
  }, [isCurrentLanguageRTL]);

  const getAlignment = useCallback((defaultAlign: 'left' | 'right' | 'center' = 'left') => {
    if (isCurrentLanguageRTL) {
      return defaultAlign === 'left' ? 'right' : defaultAlign === 'right' ? 'left' : 'center';
    }
    return defaultAlign;
  }, [isCurrentLanguageRTL]);

  const getFlexDirection = useCallback((defaultDirection: 'row' | 'row-reverse' = 'row') => {
    if (isCurrentLanguageRTL) {
      return defaultDirection === 'row' ? 'row-reverse' : 'row';
    }
    return defaultDirection;
  }, [isCurrentLanguageRTL]);

  return {
    direction: getTextDirection(),
    isRTL: isRTLText(),
    getAlignment,
    getFlexDirection,
  };
};

// Hook for translation with fallback
export const useTranslationWithFallback = () => {
  const { t } = useTranslation();

  const translateWithFallback = useCallback((
    key: string,
    fallback: string,
    options?: Record<string, any>
  ) => {
    const result = t(key, options);
    return result === key ? fallback : result;
  }, [t]);

  const translateWithDefault = useCallback((
    key: string,
    defaultValue: string,
    options?: Record<string, any>
  ) => {
    try {
      const result = t(key, options);
      return result || defaultValue;
    } catch {
      return defaultValue;
    }
  }, [t]);

  const translateArray = useCallback((
    keys: string[],
    fallback: string = ''
  ) => {
    return keys.map(key => translateWithFallback(key, fallback));
  }, [translateWithFallback]);

  return {
    translateWithFallback,
    translateWithDefault,
    translateArray,
    t,
  };
};

// Hook for dynamic translations
export const useDynamicTranslation = () => {
  const { i18n } = useTranslation();

  const loadNamespace = useCallback(async (namespace: string) => {
    try {
      await i18n.loadNamespaces(namespace);
      return true;
    } catch (error) {
      console.error(`Failed to load namespace: ${namespace}`, error);
      return false;
    }
  }, [i18n]);

  const addResource = useCallback((
    language: string,
    namespace: string,
    resources: Record<string, any>
  ) => {
    try {
      i18n.addResourceBundle(language, namespace, resources, true, true);
      return true;
    } catch (error) {
      console.error('Failed to add resource bundle:', error);
      return false;
    }
  }, [i18n]);

  const removeResource = useCallback((
    language: string,
    namespace: string
  ) => {
    try {
      i18n.removeResourceBundle(language, namespace);
      return true;
    } catch (error) {
      console.error('Failed to remove resource bundle:', error);
      return false;
    }
  }, [i18n]);

  const hasResourceBundle = useCallback((
    language: string,
    namespace: string
  ) => {
    return i18n.hasResourceBundle(language, namespace);
  }, [i18n]);

  return {
    loadNamespace,
    addResource,
    removeResource,
    hasResourceBundle,
    isInitialized: i18n.isInitialized,
  };
};

// Hook for translation validation
export const useTranslationValidation = () => {
  const { t, i18n } = useTranslation();

  const validateKey = useCallback((key: string, namespace?: string) => {
    const ns = namespace || i18n.options.defaultNS || 'common';
    const result = t(key, { ns });
    return result !== key;
  }, [t, i18n]);

  const getMissingKeys = useCallback((namespace?: string) => {
    const ns = namespace || i18n.options.defaultNS || 'common';
    const lang = typeof (i18n.language as any) === 'string'
      ? (i18n.language as string)
      : Array.isArray(i18n.language)
        ? String((i18n.language as any[])[0] || '')
        : '';
    const resources = (i18n as any).getResourceBundle(lang, ns);
    
    if (!resources) return [];
    
    const missingKeys: string[] = [];
    
    const checkKeys = (obj: any, prefix: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        
        if (typeof value === 'object' && value !== null) {
          checkKeys(value, fullKey);
        } else {
          const translated = t(fullKey, { ns });
          if (translated === fullKey) {
            missingKeys.push(fullKey);
          }
        }
      }
    };
    
    checkKeys(resources);
    return missingKeys;
  }, [t, i18n]);

  const getTranslationStats = useCallback((namespace?: string) => {
    const ns = namespace || i18n.options.defaultNS || 'common';
    const lang = typeof (i18n.language as any) === 'string'
      ? (i18n.language as string)
      : Array.isArray(i18n.language)
        ? String((i18n.language as any[])[0] || '')
        : '';
    const resources = (i18n as any).getResourceBundle(lang, ns);
    
    if (!resources) {
      return {
        total: 0,
        translated: 0,
        missing: 0,
        percentage: 0,
      };
    }
    
    let total = 0;
    let translated = 0;
    
    const countKeys = (obj: any) => {
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object' && value !== null) {
          countKeys(value);
        } else {
          total++;
          const translatedValue = t(key, { ns });
          if (translatedValue !== key) {
            translated++;
          }
        }
      }
    };
    
    countKeys(resources);
    
    return {
      total,
      translated,
      missing: total - translated,
      percentage: total > 0 ? Math.round((translated / total) * 100) : 0,
    };
  }, [t, i18n]);

  return {
    validateKey,
    getMissingKeys,
    getTranslationStats,
  };
};

// Hook for translation interpolation
export const useTranslationInterpolation = () => {
  const { t } = useTranslation();

  const interpolate = useCallback((
    key: string,
    values: Record<string, any>,
    options?: Record<string, any>
  ) => {
    return t(key, { ...values, ...options });
  }, [t]);

  const interpolateWithFallback = useCallback((
    key: string,
    values: Record<string, any>,
    fallback: string,
    options?: Record<string, any>
  ) => {
    const result = t(key, { ...values, ...options });
    return result === key ? fallback : result;
  }, [t]);

  const interpolateTemplate = useCallback((
    template: string,
    values: Record<string, any>
  ) => {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return values[key] !== undefined ? String(values[key]) : match;
    });
  }, []);

  return {
    interpolate,
    interpolateWithFallback,
    interpolateTemplate,
  };
};

// Hook for translation context
export const useTranslationContext = () => {
  const { i18n } = useTranslation();

  const getContext = useCallback(() => {
    return {
      language: i18n.language,
      languages: i18n.languages,
      resolvedLanguage: i18n.resolvedLanguage,
      isInitialized: i18n.isInitialized,
      hasLoadedNamespace: i18n.hasLoadedNamespace,
      options: i18n.options,
    };
  }, [i18n]);

  const getCurrentNamespace = useCallback(() => {
    return i18n.options.defaultNS || 'common';
  }, [i18n]);

  const getLoadedNamespaces = useCallback(() => {
    return i18n.reportNamespaces?.getUsedNamespaces?.() ?? [];
  }, [i18n]);

  return {
    getContext,
    getCurrentNamespace,
    getLoadedNamespaces,
  };
};

// Hook for translation events
export const useTranslationEvents = () => {
  const { i18n } = useTranslation();

  const onLanguageChanged = useCallback((callback: (language: string) => void) => {
    const handleLanguageChanged = (lng: string) => {
      callback(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const onInitialized = useCallback((callback: () => void) => {
    const handleInitialized = () => {
      callback();
    };

    i18n.on('initialized', handleInitialized);

    return () => {
      i18n.off('initialized', handleInitialized);
    };
  }, [i18n]);

  const onLoaded = useCallback((callback: (loaded: boolean) => void) => {
    const handleLoaded = (loaded: boolean) => {
      callback(loaded);
    };

    i18n.on('loaded', handleLoaded);

    return () => {
      i18n.off('loaded', handleLoaded);
    };
  }, [i18n]);

  return {
    onLanguageChanged,
    onInitialized,
    onLoaded,
  };
}; 