
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void; // for settings panel
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Determines theme by localStorage or system time.
 * If theme has been set (by Settings), respects that.
 * Otherwise: Light from 6AM–6PM, dark otherwise.
 */
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const getThemeBasedOnTime = (): Theme => {
    const currentHour = new Date().getHours();
    return currentHour >= 6 && currentHour < 18 ? 'light' : 'dark';
  };

  const getStoredTheme = (): Theme | null => {
    const t = localStorage.getItem('theme');
    if (t === 'light' || t === 'dark') return t;
    return null;
  };

  const [theme, setThemeState] = useState<Theme>(getStoredTheme() || getThemeBasedOnTime);

  // React to manual theme change
  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('theme', t);
  };

  // React to time if user hasn't set theme
  useEffect(() => {
    if (!getStoredTheme()) {
      setThemeState(getThemeBasedOnTime());
      const interval = setInterval(() => setThemeState(getThemeBasedOnTime()), 60000);
      return () => clearInterval(interval);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
