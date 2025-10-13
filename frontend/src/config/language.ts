// Force English Language for Y Combinator Demo
export const FORCE_ENGLISH_CONFIG = {
  // Force English in all possible ways
  FORCE_METHODS: {
    // Set localStorage
    SET_LOCAL_STORAGE: () => {
      localStorage.setItem('i18nextLng', 'en');
      localStorage.setItem('preferredLanguage', 'en');
      localStorage.setItem('language', 'en');
    },
    
    // Set HTML attributes
    SET_HTML_ATTRIBUTES: () => {
      document.documentElement.lang = 'en';
      document.documentElement.setAttribute('data-lang', 'en');
    },
    
    // Override navigator
    OVERRIDE_NAVIGATOR: () => {
      Object.defineProperty(navigator, 'language', {
        get: () => 'en',
        configurable: true
      });
      
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en'],
        configurable: true
      });
    },
    
    // Override Intl
    OVERRIDE_INTL: () => {
      const originalResolvedOptions = Intl.DateTimeFormat.prototype.resolvedOptions;
      Intl.DateTimeFormat.prototype.resolvedOptions = function() {
        const options = originalResolvedOptions.call(this);
        options.locale = 'en';
        return options;
      };
    },
  },
  
  // Execute all force methods
  FORCE_ENGLISH: () => {
    FORCE_ENGLISH_CONFIG.FORCE_METHODS.SET_LOCAL_STORAGE();
    FORCE_ENGLISH_CONFIG.FORCE_METHODS.SET_HTML_ATTRIBUTES();
    FORCE_ENGLISH_CONFIG.FORCE_METHODS.OVERRIDE_NAVIGATOR();
    FORCE_ENGLISH_CONFIG.FORCE_METHODS.OVERRIDE_INTL();
    
    console.log(' English language forced for Y Combinator demo');
  },
  
  // Check if English is active
  IS_ENGLISH_ACTIVE: () => {
    const localStorageLang = localStorage.getItem('i18nextLng');
    const htmlLang = document.documentElement.lang;
    const navigatorLang = navigator.language;
    
    return localStorageLang === 'en' && htmlLang === 'en' && navigatorLang === 'en';
  },
};

// Execute immediately
FORCE_ENGLISH_CONFIG.FORCE_ENGLISH();

// Also execute on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', FORCE_ENGLISH_CONFIG.FORCE_ENGLISH);
} else {
  FORCE_ENGLISH_CONFIG.FORCE_ENGLISH();
}

// Execute on window load
window.addEventListener('load', FORCE_ENGLISH_CONFIG.FORCE_ENGLISH);


