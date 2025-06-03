import React from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

import StockDetailHeader from '@/components/StockDetail/StockDetailHeader';
// import StockMetricsGrid from '@/components/StockDetail/StockMetricsGrid';
import StockChartSection from '@/components/StockDetail/StockChartSection';
import AIPredictionCard from '@/components/StockDetail/AIPredictionCard';
import MarketInsightsCard from '@/components/StockDetail/MarketInsightsCard';

import { useStockDetail } from '@/hooks/useStockDetail';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Use the custom hook for all logic
  const {
    stock,
    historicalData,
    predictedData,
    predictionResponse,
    timeRange,
    loading,
    error,
    setTimeRange,
    refreshData,
    navigateToPrediction,
    navigateBack,
  } = useStockDetail(symbol);

  // Loading State
  if (loading && !stock) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto p-6">
          <div className={`rounded-3xl p-12 text-center ${
            isDark 
              ? 'bg-gray-800/90 border border-gray-700/50' 
              : 'bg-white/90 border border-gray-200/50'
          } backdrop-blur-lg shadow-2xl`}>
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-2 border-purple-300 dark:border-purple-800"></div>
              <div className="absolute inset-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Loading Stock Data...
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Fetching detailed market information
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !stock) {
    return (
      <div className={`min-h-screen transition-all duration-500 ${
        isDark 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto p-6">
          <div className={`rounded-3xl p-12 text-center ${
            isDark 
              ? 'bg-gray-800/90 border border-gray-700/50' 
              : 'bg-white/90 border border-gray-200/50'
          } backdrop-blur-lg shadow-2xl`}>
            <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
              isDark ? 'bg-red-900/30' : 'bg-red-100'
            }`}>
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {error || 'Stock Not Found'}
            </h3>
            <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              The requested stock symbol could not be found in our database.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                onClick={navigateBack}
              >
                Go Back
              </button>
              <button
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
                onClick={refreshData}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Header Section */}
        <StockDetailHeader
          stock={stock}
          isDark={isDark}
          onBack={navigateBack}
        />

        {/* Chart Section */}
        <StockChartSection
          stock={stock}
          historicalData={historicalData}
          predictedData={predictedData}
          timeRange={timeRange}
          isDark={isDark}
          onTimeRangeChange={setTimeRange}
          onBack={navigateBack}
        />

        {/* Bottom Grid - AI Prediction & Market Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AIPredictionCard
            stock={stock}
            predictedData={predictedData}
            predictionResponse={predictionResponse}
            isDark={isDark}
            onNavigateToPrediction={navigateToPrediction}
          />
          
          <MarketInsightsCard
            stock={stock}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
};

export default StockDetail;