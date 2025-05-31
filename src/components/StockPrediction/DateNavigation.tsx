import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock } from 'lucide-react';

interface DateNavigationProps {
  isDark: boolean;
  currentDate: Date;
  isLoading: boolean;
  onNavigate: (direction: 'prev' | 'next') => void;
  onDateChange?: (date: Date) => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
  isDark,
  currentDate,
  isLoading,
  onNavigate,
  onDateChange
}) => {
  const formatDisplayDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const handleDateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onDateChange) {
      const newDate = new Date(event.target.value);
      onDateChange(newDate);
    }
  };

  return (
    <div className={`
      flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl border transition-all duration-300
      ${isDark 
        ? 'bg-gradient-to-r from-gray-800/50 to-gray-700/30 border-gray-700/50 hover:border-gray-600' 
        : 'bg-gradient-to-r from-gray-50/80 to-white/80 border-gray-200 hover:border-gray-300'
      }
    `}>
      {/* Previous Button */}
      <button
        onClick={() => onNavigate('prev')}
        disabled={isLoading}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 
          disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95
          ${isDark 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 hover:border-gray-500' 
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md'
          }
        `}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous Period</span>
      </button>
      
      {/* Date Display Section */}
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 my-4 sm:my-0">
        {/* Calendar Icon and Current Date */}
        <div className="flex items-center space-x-3">
          <div className={`
            p-3 rounded-xl transition-all duration-300 hover:scale-110
            ${isDark ? 'bg-blue-900/30 hover:bg-blue-800/40' : 'bg-blue-100 hover:bg-blue-200'}
          `}>
            <Calendar className={`w-5 h-5 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
          </div>
          
          <div className="text-center sm:text-left">
            <p className={`text-lg font-bold ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {formatDisplayDate(currentDate)}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className={`w-3 h-3 ${
                isDark ? 'text-gray-500' : 'text-gray-400'
              }`} />
              <span className={`text-xs font-medium ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Analysis Date
              </span>
            </div>
          </div>
        </div>

        {/* Date Input (Hidden but functional) */}
        {onDateChange && (
          <div className="relative">
            <input
              type="date"
              value={formatDateInput(currentDate)}
              onChange={handleDateInputChange}
              disabled={isLoading}
              className={`
                px-4 py-2 rounded-xl border-0 text-sm font-medium transition-all duration-200
                focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50
                ${isDark 
                  ? 'bg-gray-700 text-white hover:bg-gray-600' 
                  : 'bg-white text-gray-900 shadow-sm hover:shadow-md'
                }
              `}
            />
          </div>
        )}
      </div>
      
      {/* Next Button */}
      <button
        onClick={() => onNavigate('next')}
        disabled={isLoading}
        className={`
          flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 
          disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95
          ${isDark 
            ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600 hover:border-gray-500' 
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md'
          }
        `}
      >
        <span>Next Period</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DateNavigation;