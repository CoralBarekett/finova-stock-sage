import React from 'react';
import { BarChart3 } from 'lucide-react';
import StockChart from '@/components/charts/StockChart';
import StockHeader from '@/components/stocks/StockHeader';
import type { StockChartSectionProps } from '@/types/stockDetail.types';

const StockChartSection: React.FC<StockChartSectionProps> = ({
  stock,
  historicalData,
  predictedData,
  timeRange,
  isDark,
  onTimeRangeChange,
  onBack
}) => {
  return (
    <div className={`rounded-3xl ${
      isDark 
        ? 'bg-gray-800/90 border border-gray-700/50' 
        : 'bg-white/90 border border-gray-200/50'
    } backdrop-blur-lg shadow-2xl overflow-hidden`}>
      
      {/* Header */}
      <div className={`p-8 border-b ${
        isDark ? 'border-gray-700/50' : 'border-gray-200/50'
      }`}>
        <StockHeader
          stock={stock}
          timeRange={timeRange}
          onTimeRangeChange={onTimeRangeChange}
          onBack={onBack}
        />
      </div>

      {/* Chart Content */}
      <div className="p-8">
        {historicalData.length > 0 ? (
          <div className={`rounded-2xl p-6 ${
            isDark ? 'bg-gray-800/30 border border-gray-700/50' : 'bg-gray-50/50 border border-gray-200'
          }`}>
            <StockChart
              data={historicalData}
              predictedData={predictedData}
              color={stock.change >= 0 ? '#10B981' : '#EF4444'}
            />
          </div>
        ) : (
          /* No Data State */
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <BarChart3 className={`w-10 h-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                No Chart Data Available
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Historical data is currently unavailable for this stock
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockChartSection;