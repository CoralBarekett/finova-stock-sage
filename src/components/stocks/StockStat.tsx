
import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface StockStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StockStat: React.FC<StockStatProps> = ({ icon, label, value }) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {icon}
        <span className={theme === 'light' ? 'ml-2 text-gray-600' : 'ml-2 text-white/70'}>{label}</span>
      </div>
      <span className={theme === 'light' ? 'font-medium text-gray-900' : 'font-medium text-white'}>{value}</span>
    </div>
  );
};

export default StockStat;
