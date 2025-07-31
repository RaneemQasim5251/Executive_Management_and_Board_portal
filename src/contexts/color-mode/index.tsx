import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import { ConfigProvider, theme } from "antd";

type ColorModeContextType = {
  mode: string;
  setMode: (mode: string) => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const colorModeFromLocalStorage = localStorage.getItem("colorMode");
  const isSystemPreferenceDark = window?.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;

  const systemPreference = isSystemPreferenceDark ? "dark" : "light";
  const [mode, setMode] = useState(
    colorModeFromLocalStorage || systemPreference
  );

  useEffect(() => {
    window?.matchMedia("(prefers-color-scheme: dark)").addEventListener(
      "change",
      (e) => {
        setMode(e.matches ? "dark" : "light");
      }
    );
  }, []);

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
        theme={{
          algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#1e3a8a", // Executive blue
            colorSuccess: "#10b981",
            colorWarning: "#f59e0b", 
            colorError: "#ef4444",
            colorInfo: "#3b82f6",
            borderRadius: 8,
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          },
          components: {
            Layout: {
              colorBgHeader: "#ffffff",
              colorBgBody: "#f8fafc",
            },
            Menu: {
              colorBgContainer: "transparent",
              colorItemBg: "transparent",
              colorItemBgSelected: "rgba(255, 255, 255, 0.1)",
              colorItemBgHover: "rgba(255, 255, 255, 0.05)",
              colorItemText: "#ffffff",
              colorItemTextSelected: "#ffffff",
              colorItemTextHover: "#ffffff",
            },
            Card: {
              borderRadius: 12,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            },
            Button: {
              borderRadius: 8,
              fontWeight: 600,
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};