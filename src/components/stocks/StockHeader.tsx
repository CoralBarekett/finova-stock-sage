
import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import TimeRangeSelector, { TimeRange } from './TimeRangeSelector';
import { StockData } from '@/services/stockService';
import { useTheme } from '@/context/ThemeContext';

interface StockHeaderProps {
  stock: StockData;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  onBack: () => void;
}

const StockHeader: React.FC<StockHeaderProps> = ({ 
  stock, 
  timeRange, 
  onTimeRangeChange,
  onBack 
}) => {
  const isPositive = stock.change >= 0;
  const { theme } = useTheme();

  return (
    <div className="finova-card p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <div className={`text-3xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-foreground'}`}>
            ${stock.price.toFixed(2)}
          </div>
          <div className={`flex items-center mt-1 ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? 
              <ArrowUp className="w-4 h-4 mr-1" /> : 
              <ArrowDown className="w-4 h-4 mr-1" />
            }
            {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
          </div>
        </div>
        <TimeRangeSelector 
          currentRange={timeRange} 
          onRangeChange={onTimeRangeChange} 
        />
      </div>
    </div>
  );
};

export default StockHeader;
