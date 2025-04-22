
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';
type ThemeMode = 'dark' | 'light' | 'auto';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
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

const isDayTime = (): boolean => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 19; // Day time is 6 AM to 7 PM
};

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    return (saved as ThemeMode) || 'auto';
  });

  const [theme, setTheme] = useState<Theme>(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode === 'light' || savedMode === 'dark') return savedMode;
    return isDayTime() ? 'light' : 'dark';
  });

  // Handle mode changes
  const handleModeChange = (newMode: ThemeMode) => {
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
    
    if (newMode === 'auto') {
      setTheme(isDayTime() ? 'light' : 'dark');
    } else {
      setTheme(newMode);
    }
  };

  // Update theme based on time when in auto mode
  useEffect(() => {
    if (mode === 'auto') {
      const updateTheme = () => setTheme(isDayTime() ? 'light' : 'dark');
      updateTheme(); // Initial check
      
      const interval = setInterval(updateTheme, 60000); // Check every minute
      return () => clearInterval(interval);
    }
  }, [mode]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode: handleModeChange }}>
      {children}
    </ThemeContext.Provider>
  );
};
