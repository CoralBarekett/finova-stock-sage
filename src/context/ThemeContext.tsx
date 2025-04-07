
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
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

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Determine theme based on time of day
  const getThemeBasedOnTime = (): Theme => {
    const currentHour = new Date().getHours();
    // Light mode from 6 AM to 6 PM (6-18), dark mode otherwise
    return currentHour >= 6 && currentHour < 18 ? 'light' : 'dark';
  };

  const [theme, setTheme] = useState<Theme>(getThemeBasedOnTime);

  // Update theme every minute to check for time changes
  useEffect(() => {
    const updateThemeBasedOnTime = () => {
      setTheme(getThemeBasedOnTime());
    };

    // Update theme on initial load
    updateThemeBasedOnTime();

    // Set interval to check time every minute
    const interval = setInterval(updateThemeBasedOnTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  // Apply theme class to body when theme changes
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
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  );
};
