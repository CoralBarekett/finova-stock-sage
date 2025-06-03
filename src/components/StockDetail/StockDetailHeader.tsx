import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { getStockStatus, formatPriceChange } from '@/utils/stockDetailUtils';
import type { StockDetailHeaderProps } from '@/types/stockDetail.types';

const StockDetailHeader: React.FC<StockDetailHeaderProps> = ({
  stock,
  isDark,
  onBack
}) => {
  const status = getStockStatus(stock);
  const priceChange = formatPriceChange(stock);

  return (
    <div className={`rounded-3xl p-8 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50' 
        : 'bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50'
    } backdrop-blur-lg shadow-2xl`}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        
        {/* Left Section - Stock Info */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className={`p-3 rounded-2xl transition-all duration-200 hover:scale-110 ${
              isDark 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-300'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stock.symbol}
              </h1>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                {status.label}
              </div>
            </div>
            <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {stock.name}
            </p>
          </div>
        </div>

        {/* Right Section - Price Info */}
        <div className="text-right">
          <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            ${stock.price.toFixed(2)}
          </div>
          <div className={`flex items-center justify-end space-x-2 ${priceChange.color}`}>
            <div className={`p-1 rounded-lg ${priceChange.bgColor}`}>
              <priceChange.icon className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold">
              {priceChange.value}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetailHeader;