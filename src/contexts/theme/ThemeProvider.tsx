import React, { createContext, useContext, useEffect, useState, FC, PropsWithChildren } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import { useTranslation } from 'react-i18next';
import arEG from 'antd/locale/ar_EG';
import enUS from 'antd/locale/en_US';

// Theme types
export type ThemeMode = 'light' | 'dark' | 'eye-comfort';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';
export type MotionPreference = 'full' | 'reduced' | 'none';

// Theme preferences interface
export interface ThemePreferences {
  mode: ThemeMode;
  fontSize: FontSize;
  motionPreference: MotionPreference;
  highContrast: boolean;
  reducedTransparency: boolean;
  focusRingVisible: boolean;
  colorBlindnessSupport: boolean;
}

// Context interface
interface ThemeContextType {
  preferences: ThemePreferences;
  updatePreferences: (updates: Partial<ThemePreferences>) => void;
  resetPreferences: () => void;
  isSystemDarkMode: boolean;
  wcagCompliant: boolean;
}

// Default preferences [[memory:5325443]]
const defaultPreferences: ThemePreferences = {
  mode: 'light',
  fontSize: 'medium',
  motionPreference: 'full',
  highContrast: false,
  reducedTransparency: false,
  focusRingVisible: true,
  colorBlindnessSupport: false,
};

// Brand colors from memory [[memory:5325443]]
const brandColors = {
  federalBlue: '#0C085C',
  black: '#000000',
  egyptianBlue: '#363692',
  red: '#FF2424',
  celestialBlue: '#0095CE',
};

// Font scale based on size preference
const fontScales = {
  small: {
    base: 14,
    scale: 1.15,
    lineHeight: 1.4,
  },
  medium: {
    base: 16,
    scale: 1.2,
    lineHeight: 1.5,
  },
  large: {
    base: 18,
    scale: 1.25,
    lineHeight: 1.6,
  },
  'extra-large': {
    base: 20,
    scale: 1.3,
    lineHeight: 1.7,
  },
};

// Eye-comfort color palette
const eyeComfortColors = {
  background: '#f8f9fa',
  surface: '#ffffff',
  surfaceVariant: '#f1f3f5',
  primary: '#4c6ef5',
  primaryVariant: '#364fc7',
  secondary: '#6c757d',
  text: '#212529',
  textSecondary: '#495057',
  textTertiary: '#6c757d',
  border: '#e9ecef',
  borderLight: '#f1f3f5',
  success: '#51cf66',
  warning: '#ffd43b',
  error: '#ff6b6b',
  info: '#74c0fc',
};

// High contrast colors for accessibility
const highContrastColors = {
  light: {
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    primary: '#0000ff',
    border: '#000000',
    focus: '#ff0000',
  },
  dark: {
    background: '#000000',
    surface: '#000000',
    text: '#ffffff',
    primary: '#00ffff',
    border: '#ffffff',
    focus: '#ffff00',
  },
};

// Create context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme provider component
export const ThemeProvider: FC<PropsWithChildren> = ({ children }) => {
  const { i18n } = useTranslation();
  const [preferences, setPreferences] = useState<ThemePreferences>(() => {
    // Load from localStorage or use defaults
    const stored = localStorage.getItem('theme-preferences');
    if (stored) {
      try {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      } catch {
        return defaultPreferences;
      }
    }
    return defaultPreferences;
  });

  const [isSystemDarkMode, setIsSystemDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Listen to system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDarkMode(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Listen to accessibility preferences
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    if (prefersReducedMotion && preferences.motionPreference === 'full') {
      updatePreferences({ motionPreference: 'reduced' });
    }
    
    if (prefersHighContrast && !preferences.highContrast) {
      updatePreferences({ highContrast: true });
    }
  }, []);

  // Update preferences function
  const updatePreferences = (updates: Partial<ThemePreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    localStorage.setItem('theme-preferences', JSON.stringify(newPreferences));
  };

  // Reset preferences
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
    localStorage.removeItem('theme-preferences');
  };

  // Apply CSS custom properties for theme
  useEffect(() => {
    const root = document.documentElement;
    const fontScale = fontScales[preferences.fontSize];
    const isRTL = i18n.language === 'ar';
    
    // Font properties
    root.style.setProperty('--font-size-base', `${fontScale.base}px`);
    root.style.setProperty('--font-scale-ratio', fontScale.scale.toString());
    root.style.setProperty('--line-height-base', fontScale.lineHeight.toString());
    
    // Font family
    const fontFamily = isRTL 
      ? '"Noto Sans Arabic", "Cairo", "Amiri", system-ui, -apple-system, sans-serif'
      : '"Inter", "SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    root.style.setProperty('--font-family-base', fontFamily);
    
    // Motion preferences
    if (preferences.motionPreference === 'reduced') {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else if (preferences.motionPreference === 'none') {
      root.style.setProperty('--animation-duration', '0ms');
      root.style.setProperty('--transition-duration', '0ms');
    } else {
      root.style.setProperty('--animation-duration', '300ms');
      root.style.setProperty('--transition-duration', '200ms');
    }
    
    // Focus ring visibility
    if (!preferences.focusRingVisible) {
      root.style.setProperty('--focus-ring-width', '0px');
    } else {
      root.style.setProperty('--focus-ring-width', '2px');
    }
    
    // Direction and text alignment
    root.style.setProperty('--direction', isRTL ? 'rtl' : 'ltr');
    root.style.setProperty('--text-align', isRTL ? 'right' : 'left');
    
    // Apply direction to document
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [preferences, i18n.language]);

  // Generate theme tokens based on preferences
  const getThemeTokens = () => {
    const isRTL = i18n.language === 'ar';
    const fontScale = fontScales[preferences.fontSize];
    
    let colorTokens = {};
    
    // Base theme colors
    if (preferences.mode === 'eye-comfort') {
      colorTokens = {
        colorPrimary: eyeComfortColors.primary,
        colorSuccess: eyeComfortColors.success,
        colorWarning: eyeComfortColors.warning,
        colorError: eyeComfortColors.error,
        colorInfo: eyeComfortColors.info,
        colorBgBase: eyeComfortColors.background,
        colorBgContainer: eyeComfortColors.surface,
        colorBgElevated: eyeComfortColors.surfaceVariant,
        colorText: eyeComfortColors.text,
        colorTextSecondary: eyeComfortColors.textSecondary,
        colorBorder: eyeComfortColors.border,
        colorBorderSecondary: eyeComfortColors.borderLight,
      };
    } else if (preferences.mode === 'dark') {
      colorTokens = {
        colorPrimary: brandColors.celestialBlue,
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: brandColors.red,
        colorInfo: brandColors.celestialBlue,
        colorBgBase: '#0a0a0a',
        colorBgContainer: '#141414',
        colorBgElevated: '#1f1f1f',
        colorText: '#ffffff',
        colorTextSecondary: '#a6a6a6',
        colorBorder: '#2a2a2a',
        colorBorderSecondary: '#1a1a1a',
      };
    } else {
      colorTokens = {
        colorPrimary: brandColors.federalBlue,
        colorSuccess: '#52c41a',
        colorWarning: '#faad14',
        colorError: brandColors.red,
        colorInfo: brandColors.celestialBlue,
        colorBgBase: '#ffffff',
        colorBgContainer: '#ffffff',
        colorBgElevated: '#fafafa',
        colorText: '#000000',
        colorTextSecondary: '#666666',
        colorBorder: '#e5e5e5',
        colorBorderSecondary: '#f0f0f0',
      };
    }
    
    // High contrast override
    if (preferences.highContrast) {
      const hcColors = preferences.mode === 'dark' ? highContrastColors.dark : highContrastColors.light;
      colorTokens = {
        ...colorTokens,
        ...hcColors,
      };
    }
    
    return {
      ...colorTokens,
      borderRadius: 8,
      fontFamily: isRTL 
        ? '"Noto Sans Arabic", "Cairo", "Amiri", system-ui, -apple-system, sans-serif'
        : '"Inter", "SF Pro Display", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: fontScale.base,
      lineHeight: fontScale.lineHeight,
      // Focus ring
      controlOutlineWidth: preferences.focusRingVisible ? 2 : 0,
      controlOutline: preferences.focusRingVisible ? '2px solid #4096ff' : 'none',
    };
  };

  // Check WCAG compliance
  const wcagCompliant = preferences.fontSize !== 'small' && 
                       (preferences.highContrast || preferences.mode === 'eye-comfort');

  const contextValue: ThemeContextType = {
    preferences,
    updatePreferences,
    resetPreferences,
    isSystemDarkMode,
    wcagCompliant,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider
        locale={i18n.language === 'ar' ? arEG : enUS}
        direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        theme={{
          algorithm: preferences.mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: getThemeTokens(),
          components: {
            Layout: {
              headerBg: preferences.mode === 'dark' ? '#141414' : '#ffffff',
              bodyBg: preferences.mode === 'eye-comfort' ? eyeComfortColors.background : 
                     preferences.mode === 'dark' ? '#0a0a0a' : '#f8fafc',
              siderBg: preferences.mode === 'dark' ? '#141414' : brandColors.federalBlue,
            },
            Menu: {
              itemBg: 'transparent',
              itemSelectedBg: preferences.mode === 'dark' 
                ? 'rgba(116, 192, 252, 0.2)' 
                : 'rgba(255, 255, 255, 0.1)',
              itemHoverBg: preferences.mode === 'dark' 
                ? 'rgba(116, 192, 252, 0.1)' 
                : 'rgba(255, 255, 255, 0.05)',
            },
            Card: {
              borderRadius: 12,
              boxShadow: preferences.reducedTransparency ? 'none' : 
                        preferences.mode === 'dark' 
                          ? '0 8px 25px -5px rgba(0, 0, 0, 0.4)'
                          : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            },
            Button: {
              borderRadius: 8,
              fontWeight: 600,
              // Enhanced focus styles
              controlOutlineWidth: preferences.focusRingVisible ? 2 : 0,
            },
            Input: {
              borderRadius: 8,
              controlOutlineWidth: preferences.focusRingVisible ? 2 : 0,
            },
            Select: {
              borderRadius: 8,
              controlOutlineWidth: preferences.focusRingVisible ? 2 : 0,
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
