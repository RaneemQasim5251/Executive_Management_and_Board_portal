import { useState } from 'react';

// Custom hook for localStorage with TypeScript support
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

// Hook for managing user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('userPreferences', {
    language: 'ar',
    theme: 'light',
    sidebarCollapsed: false,
    dashboardLayout: 'modern',
    timelineView: 'horizontal',
    notificationSettings: {
      email: true,
      push: true,
      desktop: true,
      sound: false
    }
  });

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateNotificationSettings = (settings: Partial<typeof preferences.notificationSettings>) => {
    setPreferences(prev => ({
      ...prev,
      notificationSettings: {
        ...prev.notificationSettings,
        ...settings
      }
    }));
  };

  return {
    preferences,
    updatePreference,
    updateNotificationSettings,
    setPreferences
  };
}

// Define proper auth data type
interface AuthData {
  token: string | null;
  user: any;
  refreshToken: string | null;
  expiresAt: number | null;
}

// Hook for managing authentication state
export function useAuthStorage() {
  const [authData, setAuthData] = useLocalStorage<AuthData>('authData', {
    token: null,
    user: null,
    refreshToken: null,
    expiresAt: null
  });

  const login = (userData: any, token: string, refreshToken?: string, expiresIn?: number) => {
    const expiresAt = expiresIn ? Date.now() + (expiresIn * 1000) : null;
    setAuthData({
      token,
      user: userData,
      refreshToken: refreshToken || null,
      expiresAt
    });
  };

  const logout = () => {
    setAuthData({
      token: null,
      user: null,
      refreshToken: null,
      expiresAt: null
    });
    localStorage.removeItem('auth'); // Remove legacy auth storage
  };

  const isTokenExpired = () => {
    if (!authData.expiresAt) return false;
    return Date.now() > authData.expiresAt;
  };

  const isAuthenticated = () => {
    return !!authData.token && !isTokenExpired();
  };

  return {
    authData,
    login,
    logout,
    isAuthenticated,
    isTokenExpired
  };
}