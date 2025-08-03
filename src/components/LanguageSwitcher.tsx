import React from 'react';
import { Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    
    console.log(`🔄 Language switch: ${currentLang} → ${newLang}`);
    
    // Simply set URL parameter - i18next will detect and handle it
    const url = new URL(window.location.href);
    url.searchParams.set('lng', newLang);
    window.location.href = url.toString();
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