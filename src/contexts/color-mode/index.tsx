import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { ConfigProvider, theme } from "antd";
import { useTranslation } from "react-i18next";
import arEG from "antd/locale/ar_EG";
import enUS from "antd/locale/en_US";

type ColorModeContextType = {
  mode: string;
  setMode: (mode: string) => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

export const ColorModeContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const { i18n } = useTranslation();
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(
    colorModeFromLocalStorage || "light"
  );

  useEffect(() => {
    window?.matchMedia("(prefers-color-scheme: dark)").addEventListener(
      "change",
      (e) => {
        setMode(e.matches ? "dark" : "light");
      }
    );
  }, []);

  // RTL Support for Arabic - Full Website Direction Control
  useEffect(() => {
    const isRTL = i18n.language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
    
    // Apply RTL/LTR to body for full coverage
    document.body.dir = isRTL ? 'rtl' : 'ltr';
    document.body.style.direction = isRTL ? 'rtl' : 'ltr';
    
    // Update Ant Design ConfigProvider direction
    const antConfigElement = document.querySelector('.ant-app');
    if (antConfigElement) {
      antConfigElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    }
    
    console.log(`🌍 Language switched to: ${i18n.language}, Direction: ${isRTL ? 'RTL' : 'LTR'}`);
  }, [i18n.language]);

  const setColorMode = (mode: string) => {
    setMode(mode);
    localStorage.setItem("colorMode", mode);
  };

  return (
    <ColorModeContext.Provider
      value={{
        setMode: setColorMode,
        mode,
      }}
    >
      <ConfigProvider
        locale={i18n.language === 'ar' ? arEG : enUS}
        direction={i18n.language === 'ar' ? 'rtl' : 'ltr'}
        theme={{
          algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: mode === "dark" ? "#667eea" : "#1e3a8a",
            colorSuccess: "#10b981",
            colorWarning: "#f59e0b", 
            colorError: "#ef4444",
            colorInfo: mode === "dark" ? "#06b6d4" : "#3b82f6",
            borderRadius: 8,
            fontFamily: i18n.language === 'ar' 
              ? '"Noto Sans Arabic", "Cairo", "Amiri", system-ui, -apple-system, sans-serif'
              : '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            
            // Enhanced dark mode colors
            ...(mode === "dark" && {
              colorBgBase: "#0a0a0a",
              colorBgContainer: "#161616", 
              colorBgElevated: "#1f1f1f",
              colorBgLayout: "#0a0a0a",
              colorText: "#e8e8e8",
              colorTextSecondary: "#a8a8a8",
              colorBorder: "#2a2a2a",
              colorBorderSecondary: "#1a1a1a",
            })
          },
          components: {
            Layout: {
              headerBg: mode === "dark" ? "#161616" : "#ffffff",
              bodyBg: mode === "dark" ? "#0a0a0a" : "#f8fafc",
              siderBg: mode === "dark" ? "#161616" : "#667eea",
            },
            Menu: {
              itemBg: "transparent",
              itemSelectedBg: mode === "dark" 
                ? "rgba(102, 126, 234, 0.2)" 
                : "rgba(255, 255, 255, 0.1)",
              itemHoverBg: mode === "dark" 
                ? "rgba(102, 126, 234, 0.1)" 
                : "rgba(255, 255, 255, 0.05)",
              itemColor: mode === "dark" ? "#e8e8e8" : "#ffffff",
              itemSelectedColor: mode === "dark" ? "#a78bfa" : "#ffffff",
              itemHoverColor: mode === "dark" ? "#c4b5fd" : "#ffffff",
            },
            Card: {
              borderRadius: 12,
              boxShadow: mode === "dark" 
                ? "0 8px 25px -5px rgba(0, 0, 0, 0.4)"
                : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              colorBgContainer: mode === "dark" ? "#161616" : "#ffffff",
            },
            Button: {
              borderRadius: 8,
              fontWeight: 600,
            },
            Input: {
              colorBgContainer: mode === "dark" ? "#1f1f1f" : "#ffffff",
              colorBorder: mode === "dark" ? "#2a2a2a" : "#d1d5db",
              colorText: mode === "dark" ? "#e8e8e8" : "#1f2937",
            },
            Select: {
              colorBgContainer: mode === "dark" ? "#1f1f1f" : "#ffffff",
            },
            Modal: {
              colorBgElevated: mode === "dark" ? "#1f1f1f" : "#ffffff",
              colorBgMask: mode === "dark" ? "rgba(0, 0, 0, 0.75)" : "rgba(0, 0, 0, 0.45)",
            },
            Drawer: {
              colorBgElevated: mode === "dark" ? "#161616" : "#ffffff",
            },
            Tooltip: {
              colorBgSpotlight: mode === "dark" ? "#1f1f1f" : "#ffffff",
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};