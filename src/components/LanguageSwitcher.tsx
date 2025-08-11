import React, { useEffect } from 'react';
import { Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { updateDocumentDirection } from "../i18n";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  // Set Arabic as default language on component mount
  useEffect(() => {
    if (!localStorage.getItem('selectedLanguage')) {
      localStorage.setItem('selectedLanguage', 'ar');
      localStorage.setItem('i18nextLng', 'ar');
      i18n.changeLanguage('ar');
      updateDocumentDirection('ar');
    }
  }, [i18n]);

  const handleLanguageChange = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'ar' ? 'en' : 'ar';

    // Persist selection
    localStorage.setItem('i18nextLng', newLang);
    localStorage.setItem('selectedLanguage', newLang);

    // Update URL without reload
    const url = new URL(window.location.href);
    url.searchParams.set('lng', newLang);
    window.history.replaceState({}, '', url.toString());

    // Change language and update direction immediately
    i18n.changeLanguage(newLang);
    updateDocumentDirection(newLang);
  };

  return (
    <Button
      type="text"
      icon={<GlobalOutlined />}
      onClick={handleLanguageChange}
      style={{
        color: '#1e3a8a',
        fontWeight: 500,
        border: 'none',
        background: 'transparent',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '6px 12px',
        borderRadius: '8px',
        transition: 'all 0.2s'
      }}
    >
      {i18n.language === 'ar' ? 'English' : 'العربية'}
    </Button>
  );
};