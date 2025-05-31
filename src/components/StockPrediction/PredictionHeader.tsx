import React from 'react';
import { TrendingUp, RefreshCw, Sparkles } from 'lucide-react';
import type { StockData } from '@/services/stockService';
import type { TimeframeType } from '@/types/stockPrediction.types';

interface PredictionHeaderProps {
  isDark: boolean;
  availableStocks: StockData[];
  selectedSymbol: string;
  timeframe: TimeframeType;
  isLoading: boolean;
  onSymbolChange: (symbol: string) => void;
  onTimeframeChange: (timeframe: TimeframeType) => void;
  onGeneratePrediction: () => void;
  hasHistoricalData: boolean;
}

const PredictionHeader: React.FC<PredictionHeaderProps> = ({
  isDark,
  availableStocks,
  selectedSymbol,
  timeframe,
  isLoading,
  onSymbolChange,
  onTimeframeChange,
  onGeneratePrediction,
  hasHistoricalData
}) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
      {/* Title Section */}
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        
        <div>
          <h1 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            AI Stock Predictor
          </h1>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Advanced market predictions powered by artificial intelligence
          </p>
        </div>
      </div>
      
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
        {/* Stock Symbol Selector */}
        <div className="relative">
          <select
            value={selectedSymbol}
            onChange={(e) => onSymbolChange(e.target.value)}
            className={`
              appearance-none px-4 py-3 pr-10 rounded-xl border-0 text-sm font-medium 
              transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none
              min-w-[200px] cursor-pointer
              ${isDark 
                ? 'bg-gray-800 text-white shadow-lg hover:bg-gray-700' 
                : 'bg-white text-gray-900 shadow-md hover:shadow-lg'
              }
            `}
            disabled={isLoading}
          >
            {availableStocks.map(stock => (
              <option key={stock.symbol} value={stock.symbol}>
                {stock.symbol} - {stock.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Timeframe Selector */}
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => onTimeframeChange(e.target.value as TimeframeType)}
            className={`
              appearance-none px-4 py-3 pr-10 rounded-xl border-0 text-sm font-medium 
              transition-all duration-200 focus:ring-2 focus:ring-purple-500 focus:outline-none
              min-w-[120px] cursor-pointer
              ${isDark 
                ? 'bg-gray-800 text-white shadow-lg hover:bg-gray-700' 
                : 'bg-white text-gray-900 shadow-md hover:shadow-lg'
              }
            `}
            disabled={isLoading}
          >
            <option value="1d">1 Day</option>
            <option value="1w">1 Week</option>
            <option value="1m">1 Month</option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        
        {/* Generate Prediction Button */}
        <button
          onClick={onGeneratePrediction}
          disabled={isLoading || !hasHistoricalData}
          className={`
            flex items-center justify-center space-x-2 px-6 py-3 rounded-xl 
            font-semibold text-sm transition-all duration-200 transform
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            min-w-[160px] relative overflow-hidden
            ${isLoading || !hasHistoricalData
              ? 'bg-gray-400 text-gray-200'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
            }
          `}
        >
          {/* Background animation for loading */}
          {isLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 animate-pulse"></div>
          )}
          
          <RefreshCw className={`w-4 h-4 relative z-10 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="relative z-10">
            {isLoading ? 'Analyzing...' : 'Generate Prediction'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default PredictionHeader;