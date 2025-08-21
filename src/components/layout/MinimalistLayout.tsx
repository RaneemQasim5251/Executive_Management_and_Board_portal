import React, { useState } from 'react';
import { Typography, Space, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '@refinedev/core';
import '../../styles/minimalist.css';

const { Text } = Typography;

interface MinimalistLayoutProps {
  children: React.ReactNode;
}

export const MinimalistLayout: React.FC<MinimalistLayoutProps> = ({ children }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: logout } = useLogout();
  const [navVisible, setNavVisible] = useState(false);

  // Essential navigation only - 5 items maximum
  const navigationItems = [
    { key: 'dashboard', label: t('Dashboard'), route: '/' },
    { key: 'projects', label: t('Projects'), route: '/board' },
    { key: 'timeline', label: t('Timeline'), route: '/timeline' },
    { key: 'reports', label: t('Reports'), route: '/reports' },
    { key: 'companies', label: t('Companies'), route: '/companies/jtc' },
  ];

  const getCurrentPageTitle = () => {
    const currentItem = navigationItems.find(item => 
      location.pathname === item.route || 
      (item.route !== '/' && location.pathname.startsWith(item.route))
    );
    return currentItem?.label || t('Executive Portal');
  };

  const isCurrentPage = (route: string) => {
    return location.pathname === route || 
           (route !== '/' && location.pathname.startsWith(route));
  };

  const toggleLanguage = () => {
    const newLng = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLng);
    localStorage.setItem('selectedLanguage', newLng);
    
    const isRTL = newLng === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = newLng;
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: 'Inter, system-ui, sans-serif',
    }}>
      
      {/* Minimal Header - Essential Only */}
      <header style={{
        position: 'sticky',
        top: 0,
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        padding: '16px 48px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100,
      }}>
        {/* Left: Current Page */}
        <div>
          <Text style={{ 
            fontSize: '18px', 
            fontWeight: 600, 
            color: '#000000',
          }}>
            {getCurrentPageTitle()}
          </Text>
        </div>

        {/* Right: Essential Actions */}
        <Space size={24}>
          {/* Navigation Menu */}
          <nav style={{ display: 'flex', gap: '24px' }}>
            {navigationItems.map((item) => (
              <button
                key={item.key}
                onClick={() => navigate(item.route)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isCurrentPage(item.route) ? '#0C085C' : '#666666',
                  fontSize: '14px',
                  fontWeight: isCurrentPage(item.route) ? 600 : 400,
                  cursor: 'pointer',
                  padding: '8px 0',
                  borderBottom: isCurrentPage(item.route) ? '2px solid #0C085C' : '2px solid transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentPage(item.route)) {
                    e.currentTarget.style.color = '#000000';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrentPage(item.route)) {
                    e.currentTarget.style.color = '#666666';
                  }
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Actions */}
          <Space size={16}>
            <button
              onClick={toggleLanguage}
              style={{
                background: 'transparent',
                border: '1px solid #e0e0e0',
                color: '#666666',
                fontSize: '12px',
                padding: '6px 10px',
                cursor: 'pointer',
              }}
            >
              {i18n.language === 'ar' ? 'EN' : 'ع'}
            </button>
            
            <button
              onClick={() => logout()}
              style={{
                background: 'transparent',
                border: '1px solid #000000',
                color: '#000000',
                fontSize: '14px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: 500,
              }}
            >
              {t('Exit')}
            </button>
          </Space>
        </Space>
      </header>

      {/* Main Content - Pure Focus */}
      <main style={{
        padding: '0',
        background: '#ffffff',
      }}>
        {children}
      </main>

      {/* Mobile Navigation Overlay */}
      {navVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
            display: 'none', // Hidden by default, shown on mobile
          }}
          onClick={() => setNavVisible(false)}
        >
          <div style={{
            background: '#ffffff',
            width: '250px',
            height: '100vh',
            padding: '32px',
            borderRight: '1px solid #f0f0f0',
          }}>
            <nav>
              {navigationItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    navigate(item.route);
                    setNavVisible(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    background: 'transparent',
                    border: 'none',
                    color: isCurrentPage(item.route) ? '#0C085C' : '#000000',
                    fontSize: '16px',
                    fontWeight: isCurrentPage(item.route) ? 600 : 400,
                    cursor: 'pointer',
                    padding: '16px 0',
                    textAlign: 'left',
                    borderBottom: '1px solid #f8f8f8',
                  }}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <button
        onClick={() => setNavVisible(true)}
        style={{
          display: 'none', // Show only on mobile
          position: 'fixed',
          top: '16px',
          left: '16px',
          background: '#ffffff',
          border: '1px solid #000000',
          color: '#000000',
          fontSize: '16px',
          padding: '8px',
          cursor: 'pointer',
          zIndex: 101,
        }}
      >
        ☰
      </button>

      {/* Mobile Styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          header {
            padding: 16px 24px !important;
          }
          
          header nav {
            display: none !important;
          }
          
          .mobile-menu-button {
            display: block !important;
          }
          
          .mobile-nav-overlay {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default MinimalistLayout;
