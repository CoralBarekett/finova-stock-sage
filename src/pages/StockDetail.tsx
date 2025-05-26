import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StockChart from '@/components/charts/StockChart';
import PredictionInfo from '@/components/stocks/PredictionInfo';
import StockHeader from '@/components/stocks/StockHeader';
import { getStockDetails, getStockHistoricalData, StockData, HistoricalData } from '@/services/stockService';
import { fetchPrediction, calculatePredictedPrice, PredictionResponse } from '@/services/stockPredictionService';
import { AlertCircle, Sparkles, ArrowRight, TrendingUp, ArrowLeft, DollarSign, TrendingDown, Activity, BarChart3 } from 'lucide-react';
import { TimeRange } from '@/components/stocks/TimeRangeSelector';
import { useTheme } from '@/context/ThemeContext';
// import { useAuth } from '@/context/AuthContext'; // Add this if you have auth system

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stock, setStock] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictedData, setPredictedData] = useState<HistoricalData[] | null>(null);
  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  // const { user } = useAuth(); // Add this if you have auth system

  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;

      setLoading(true);
      try {
        const stockData = await getStockDetails(symbol);
        if (!stockData) {
          navigate('/not-found');
          return;
        }

        setStock(stockData);

        const days = timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : 365;
        const historical = await getStockHistoricalData(symbol, days);
        setHistoricalData(historical);

        // Reset prediction data to ensure UI updates correctly
        setPredictedData(null);
        setPredictionResponse(null);

      } catch (error) {
        console.error("Error fetching stock details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeRange, navigate]);

  // Handle prediction action - navigate to simulator or subscription page
  const handlePredictionAction = () => {
    // Check if user is subscribed - replace with actual auth check
    // const isSubscribed = user?.isSubscribed || false;
    const isSubscribed = false; // Temporary - replace with actual check
    
    if (!isSubscribed) {
      // Free user - redirect to subscription page
      navigate('/subscription');
      return;
    }

    // Subscribed user - redirect to simulator
    navigate(`/prediction-simulator?symbol=${symbol}`);
  };

  const isDark = theme === 'dark';
  // const isSubscribed = user?.isSubscribed || false; // Replace with actual auth check

  if (loading && !stock) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-7xl mx-auto rounded-xl p-8 text-center ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm'
        }`}>
          <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 ${
            isDark ? 'border-white/20 border-t-white' : 'border-gray-200 border-t-blue-500'
          }`}></div>
          <p className={`mt-4 ${isDark ? 'text-white/80' : 'text-gray-600'}`}>Loading stock data...</p>
        </div>
      </div>
    );
  }

  if (!stock) {
    return (
      <div className={`min-h-screen p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`max-w-7xl mx-auto rounded-xl p-8 text-center ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm'
        }`}>
          <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
          <p className={`mt-4 text-xl ${isDark ? 'text-white' : 'text-gray-900'}`}>Stock not found</p>
          <button
            className={`mt-4 px-6 py-3 rounded-lg font-medium transition-colors ${
              isDark 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            onClick={() => navigate('/stocks')}
          >
            Back to Stocks
          </button>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className={`rounded-xl p-6 mb-6 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <button
                onClick={() => navigate(-1)}
                className={`p-2 rounded-lg transition-colors ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {stock.symbol}
                </h1>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                  {stock.name}
                </p>
              </div>
            </div>

            {/* Price Display */}
            <div className="text-right">
              <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${stock.price.toFixed(2)}
              </div>
              <div className={`flex items-center justify-end space-x-2 mt-1 ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                <span className="text-lg font-semibold">
                  {isPositive ? '+' : ''}${stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className={`flex items-center justify-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Volume</span>
              </div>
              <div className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {(stock.volume / 1000000).toFixed(1)}M
              </div>
            </div>
            
            <div className="text-center">
              <div className={`flex items-center justify-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Market Cap</span>
              </div>
              <div className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${(stock.marketCap / 1000000000).toFixed(1)}B
              </div>
            </div>
            
            <div className="text-center">
              <div className={`flex items-center justify-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">P/E Ratio</span>
              </div>
              <div className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stock.peRatio.toFixed(1)}
              </div>
            </div>
            
            <div className="text-center">
              <div className={`flex items-center justify-center space-x-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Today's Range</span>
              </div>
              <div className={`text-lg font-bold mt-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                ${(stock.price - Math.abs(stock.change)).toFixed(2)} - ${stock.price.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Chart Section */}
          <div className={`rounded-xl p-6 ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm'
          }`}>
            <StockHeader
              stock={stock}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              onBack={() => navigate(-1)}
            />

            <div className="mt-6">
              {historicalData.length > 0 ? (
                <StockChart
                  data={historicalData}
                  predictedData={predictedData || undefined}
                  color={stock.change >= 0 ? '#4ADE80' : '#F87171'}
                />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${
                      isDark ? 'text-gray-600' : 'text-gray-300'
                    }`} />
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No chart data available
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section - 2 Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* AI Prediction Card */}
            <div 
              className={`
                rounded-xl p-6 transition-all duration-300 hover:shadow-lg
                ${isDark 
                  ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50' 
                  : 'bg-gradient-to-br from-white to-gray-50 border border-gray-200 hover:border-purple-300 shadow-sm'
                }
              `}
            >
              {/* Header with Icon */}
              <div className="flex items-center space-x-3 mb-4">
                <div 
                  className={`
                    p-2 rounded-lg
                    ${isDark 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-purple-100 text-purple-600'
                    }
                  `}
                >
                  <Sparkles className="w-6 h-6" />
                </div>
                <h2 
                  className={`
                    text-xl font-bold
                    ${isDark ? 'text-white' : 'text-gray-900'}
                  `}
                >
                  AI Prediction
                </h2>
              </div>

              {/* Conditional render: Show results if available, otherwise show CTA */}
              {predictedData && predictedData.length > 0 ? (
                // Option 1: Display prediction results
                <div>
                  <PredictionInfo 
                    predictions={predictedData} 
                    symbol={symbol || ''} 
                    predictionDetails={predictionResponse}
                  />
                </div>
              ) : (
                // Option 2: Show CTA card to encourage subscription/simulator access
                <>
                  {/* Description */}
                  <p 
                    className={`
                      mb-6 leading-relaxed
                      ${isDark ? 'text-gray-300' : 'text-gray-600'}
                    `}
                  >
                    Get advanced AI-powered stock predictions based on social media sentiment analysis, 
                    technical indicators, and market trends for{' '}
                    <span className="font-semibold text-purple-500">{stock.symbol}</span>.
                  </p>

                  {/* Features List */}
                  <div className="space-y-3 mb-6">
                    {[
                      'Social media sentiment analysis',
                      'Technical indicator evaluation',
                      'Market trend prediction',
                      'Confidence scoring'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div 
                          className={`
                            w-2 h-2 rounded-full
                            ${isDark ? 'bg-purple-400' : 'bg-purple-500'}
                          `}
                        />
                        <span 
                          className={`
                            text-sm
                            ${isDark ? 'text-gray-300' : 'text-gray-600'}
                          `}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Premium Badge */}
                  <div 
                    className={`
                      inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium mb-4
                      ${isDark 
                        ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30' 
                        : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200'
                      }
                    `}
                  >
                    <TrendingUp className="w-3 h-3" />
                    <span>Premium Feature</span>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={handlePredictionAction}
                    className={`
                      w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl 
                      font-semibold text-white transition-all duration-300 transform hover:scale-[1.02]
                      ${isDark
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
                      }
                    `}
                  >
                    <Sparkles className="w-5 h-5" />
                    <span>Upgrade to Premium</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Disclaimer */}
                  <p 
                    className={`
                      text-xs mt-4 text-center
                      ${isDark ? 'text-gray-400' : 'text-gray-500'}
                    `}
                  >
                    * AI predictions are for informational purposes only and should not be considered as financial advice.
                  </p>
                </>
              )}
            </div>

            {/* Market Insights Card */}
            <div className={`rounded-xl p-6 ${
              isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm'
            }`}>
              <h3 className={`text-lg font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Market Insights
              </h3>
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className={`w-4 h-4 ${
                      stock.volume > 50000000 ? 'text-green-500' : 'text-orange-500'
                    }`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Trading Volume
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Volume is {stock.volume > 50000000 ? 'above' : 'below'} average today
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {isPositive ? 
                      <TrendingUp className="w-4 h-4 text-green-500" /> : 
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    }
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Price Trend
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    Stock is {isPositive ? 'trending upward' : 'experiencing downward pressure'}
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className={`w-4 h-4 ${
                      stock.peRatio > 25 ? 'text-red-500' : 'text-green-500'
                    }`} />
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Valuation
                    </span>
                  </div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    P/E ratio suggests the stock is {stock.peRatio > 25 ? 'potentially overvalued' : 'reasonably valued'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;