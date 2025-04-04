
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center gap-2">
      <Sun className="h-4 w-4 text-white/70 dark:text-white light:text-finova-dark" />
      <Switch 
        checked={theme === 'light'}
        onCheckedChange={toggleTheme} 
      />
      <Moon className="h-4 w-4 text-white/70 dark:text-white light:text-finova-dark" />
    </div>
  );
};

export default ThemeToggle;
