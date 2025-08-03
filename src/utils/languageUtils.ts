// Language utility functions to prevent conflicts

export const forceLanguageChange = (newLanguage: 'ar' | 'en') => {
  // Clear any existing language preferences that might conflict
  const keysToUpdate = ['i18nextLng', 'selectedLanguage', 'lng'];
  
  keysToUpdate.forEach(key => {
    localStorage.setItem(key, newLanguage);
  });
  
  // Set language in URL if using URL detection
  if (window.history && window.history.replaceState) {
    const url = new URL(window.location.href);
    url.searchParams.set('lng', newLanguage);
    window.history.replaceState({}, '', url.toString());
  }
  
  return newLanguage;
};

export const applyLanguageToDOM = (language: 'ar' | 'en') => {
  const isRTL = language === 'ar';
  
  // Apply to document
  document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  document.documentElement.lang = language;
  
  // Apply to body
  document.body.dir = isRTL ? 'rtl' : 'ltr';
  document.body.style.direction = isRTL ? 'rtl' : 'ltr';
  
  // Apply font
  document.body.style.fontFamily = isRTL 
    ? "'Noto Sans Arabic', 'Cairo', 'Amiri', system-ui, -apple-system, sans-serif"
    : "'Inter', system-ui, -apple-system, sans-serif";
    
  // Apply CSS classes
  document.body.className = isRTL ? 'rtl-layout' : 'ltr-layout';
  
  console.log(`🌍 DOM updated for language: ${language} (${isRTL ? 'RTL' : 'LTR'})`);
};