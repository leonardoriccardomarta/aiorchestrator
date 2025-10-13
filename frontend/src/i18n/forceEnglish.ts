// Force English language for Y Combinator demo
export const forceEnglish = () => {
  // Set English in localStorage
  localStorage.setItem('i18nextLng', 'en');
  localStorage.setItem('preferredLanguage', 'en');
  
  // Set HTML lang attribute
  document.documentElement.lang = 'en';
  
  // Override navigator.language
  Object.defineProperty(navigator, 'language', {
    get: () => 'en',
    configurable: true
  });
  
  Object.defineProperty(navigator, 'languages', {
    get: () => ['en'],
    configurable: true
  });
};

// Call immediately
forceEnglish();


