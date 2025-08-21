import React, { createContext, useState, useContext, useEffect } from 'react';
import { ConfigProvider } from 'antd';

// Define theme configuration types
interface PortalThemeConfig {
  mode: 'default' | 'dark' | 'light' | 'minimalist' | 'apple' | 'stripe';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  highContrast: boolean;
  reducedMotion: boolean;
  loginMethod: 'password' | 'biometric' | 'sso';
}

// Default theme configuration
const defaultThemeConfig: PortalThemeConfig = {
  mode: 'default',
  primaryColor: '#0C085C', // Federal Blue
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  loginMethod: 'password'
};

// Create context
export const PortalThemeContext = createContext<{
  theme: PortalThemeConfig;
  setTheme: React.Dispatch<React.SetStateAction<PortalThemeConfig>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  theme: defaultThemeConfig,
  setTheme: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {}
});

// Theme provider component
export const PortalThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<PortalThemeConfig>(() => {
    // Load from localStorage or use default
    const savedTheme = localStorage.getItem('portal-theme-config');
    return savedTheme ? JSON.parse(savedTheme) : defaultThemeConfig;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    // Check if user is logged in from localStorage or other auth mechanism
    return !!localStorage.getItem('user-token');
  });

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('portal-theme-config', JSON.stringify(theme));
  }, [theme]);

  // Apply theme-specific CSS classes
  useEffect(() => {
    document.body.classList.remove(
      'theme-default', 
      'theme-dark', 
      'theme-light', 
      'theme-minimalist', 
      'theme-apple', 
      'theme-stripe',
      'high-contrast',
      'reduced-motion'
    );
    
    document.body.classList.add(`theme-${theme.mode}`);
    
    if (theme.highContrast) {
      document.body.classList.add('high-contrast');
    }
    
    if (theme.reducedMotion) {
      document.body.classList.add('reduced-motion');
    }

    // Adjust font size
    document.documentElement.style.fontSize = (() => {
      switch(theme.fontSize) {
        case 'small': return '14px';
        case 'medium': return '16px';
        case 'large': return '18px';
        case 'xlarge': return '20px';
        default: return '16px';
      }
    })();
  }, [theme]);

  return (
    <PortalThemeContext.Provider value={{ theme, setTheme, isLoggedIn, setIsLoggedIn }}>
      <ConfigProvider 
        theme={{
          token: {
            colorPrimary: theme.primaryColor,
          },
        }}
      >
        {children}
      </ConfigProvider>
    </PortalThemeContext.Provider>
  );
};

// Custom hook for using theme
export const usePortalTheme = () => useContext(PortalThemeContext);

export default PortalThemeProvider;
