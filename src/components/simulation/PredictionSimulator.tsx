import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronLeft, ChevronRight, Calendar, TrendingUp, DollarSign, BarChart3, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '@/context/ThemeContext';

// Import your actual services
import { 
  getStockHistoricalData, 
  getPopularStocks,
  HistoricalData, 
  StockData 
} from '@/services/stockService';
import { 
  fetchPrediction, 
  calculatePredictedPrice, 
  PredictionResponse 
} from '@/services/stockPredictionService';

interface ChartDataPoint {
  date: string;
  actualPrice: number | null;
  predictedPrice: number | null;
  type: 'historical' | 'prediction';
}

const StockPredictionSimulator = () => {
  // Use your theme context
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // State management
  const [availableStocks, setAvailableStocks] = useState<StockData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState<'1d' | '1w' | '1m'>('1d');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [showPredictions, setShowPredictions] = useState(true);
  const [showActual, setShowActual] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real data from your APIs
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);

  // Load available stocks on mount
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const stocks = await getPopularStocks();
        setAvailableStocks(stocks);
        if (stocks.length > 0 && !selectedSymbol) {
          setSelectedSymbol(stocks[0].symbol);
        }
      } catch (err) {
        console.error('Error loading stocks:', err);
        toast.error('Failed to load available stocks');
      }
    };
    loadStocks();
  }, []);

  // Calculate days to show based on timeframe and current date
  const timeframeDays = {
    '1d': 30,   // Show 30 days history for 1-day predictions
    '1w': 60,   // Show 60 days history for 1-week predictions  
    '1m': 90    // Show 90 days history for 1-month predictions
  };

  // Load historical data when symbol, timeframe, or date changes
  useEffect(() => {
    if (selectedSymbol) {
      fetchHistoricalData();
    }
  }, [selectedSymbol, timeframe, currentDate]);

  const fetchHistoricalData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const days = timeframeDays[timeframe];
      console.log(`📊 Fetching ${days} days of historical data for ${selectedSymbol}`);
      
      // Use your real API
      const historical = await getStockHistoricalData(selectedSymbol, days);
      
      // Filter data based on current date if needed
      const endDate = new Date(currentDate);
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - days);
      
      const filteredData = historical.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      
      setHistoricalData(filteredData);
      console.log(`✅ Loaded ${filteredData.length} historical data points`);
      
    } catch (err) {
      console.error('❌ Error fetching historical data:', err);
      setError('Failed to load historical data');
      toast.error('Failed to load historical data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch prediction from your real API
  const fetchPredictionData = async () => {
    if (!historicalData.length) {
      toast.error('No historical data available for prediction');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🤖 Fetching AI prediction for ${selectedSymbol} (${timeframe})`);
      
      // Use your real prediction API
      const prediction = await fetchPrediction(selectedSymbol, timeframe);
      setPredictionData(prediction);
      
      console.log('✅ Prediction received:', prediction);
      toast.success('AI prediction generated successfully!');
      
    } catch (err) {
      console.error('❌ Prediction failed:', err);
      setError('Failed to generate prediction');
      toast.error('Failed to generate prediction');
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data combining historical and prediction
  const chartData: ChartDataPoint[] = useMemo(() => {
    const combined: ChartDataPoint[] = [];
    
    // Add historical data
    historicalData.forEach(item => {
      combined.push({
        date: item.date,
        actualPrice: item.price,
        predictedPrice: null,
        type: 'historical'
      });
    });
    
    // Add prediction point if available
    if (predictionData && historicalData.length > 0) {
      const lastHistoricalDate = historicalData[historicalData.length - 1]?.date;
      if (lastHistoricalDate) {
        const predictionDate = new Date(lastHistoricalDate);
        
        // Calculate prediction date based on timeframe
        if (timeframe === '1d') {
          predictionDate.setDate(predictionDate.getDate() + 1);
        } else if (timeframe === '1w') {
          predictionDate.setDate(predictionDate.getDate() + 7);
        } else if (timeframe === '1m') {
          predictionDate.setDate(predictionDate.getDate() + 30);
        }
        
        // Skip weekends
        while ([0, 6].includes(predictionDate.getDay())) {
          predictionDate.setDate(predictionDate.getDate() + 1);
        }
        
        const lastPrice = historicalData[historicalData.length - 1].price;
        const predictedPrice = predictionData.predicted_price || 
                             calculatePredictedPrice(lastPrice, predictionData);
        
        combined.push({
          date: predictionDate.toISOString().split('T')[0],
          actualPrice: null,
          predictedPrice: predictedPrice,
          type: 'prediction'
        });
      }
    }
    
    return combined.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [historicalData, predictionData, timeframe]);

  // Navigation functions
  const navigateDate = (direction: 'prev' | 'next') => {
    const days = Math.floor(timeframeDays[timeframe] / 3);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - days);
    } else {
      newDate.setDate(currentDate.getDate() + days);
    }
    
    setCurrentDate(newDate);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    if (!historicalData.length) return null;
    
    const currentPrice = historicalData[historicalData.length - 1]?.price || 0;
    let predictedPrice = currentPrice;
    let change = 0;
    let changePercent = 0;
    
    if (predictionData) {
      predictedPrice = predictionData.predicted_price || 
                     calculatePredictedPrice(currentPrice, predictionData);
      change = predictedPrice - currentPrice;
      changePercent = currentPrice > 0 ? ((change / currentPrice) * 100) : 0;
    }
    
    return {
      currentPrice,
      predictedPrice,
      change,
      changePercent,
      confidence: predictionData?.confidence || 0,
      direction: predictionData?.prediction?.direction || 'hold',
      sentiment: predictionData?.prediction?.sentiment || 'neutral',
      postsAnalyzed: predictionData?.supporting_data?.post_count || 0,
      influencerPosts: predictionData?.supporting_data?.influencer_post_count || 0,
      technicalTrend: predictionData?.technical_signals?.trend || 'neutral',
      priceChangePercent: predictionData?.technical_signals?.price_change_percent || 0
    };
  }, [historicalData, predictionData]);

  // Custom tooltip with theme support (matching your StockChart style)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const tooltipBg = isDark ? 'rgba(26, 31, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)';
      const tooltipBorderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
      const tooltipTextColor = isDark ? '#fff' : '#333333';
      
      return (
        <div 
          style={{ 
            backgroundColor: tooltipBg, 
            borderColor: tooltipBorderColor,
            color: tooltipTextColor,
            borderRadius: '4px',
            padding: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            border: '1px solid'
          }}
        >
          <p className="font-semibold">{new Date(label).toLocaleDateString()}</p>
          {data.actualPrice && (
            <p style={{ color: '#3B82F6' }}>
              Historical: ${data.actualPrice.toFixed(2)}
            </p>
          )}
          {data.predictedPrice && (
            <p style={{ color: '#F97316' }}>
              AI Prediction: ${data.predictedPrice.toFixed(2)}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Theme-aware styles (matching your project's approach)
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.15)";
  const axisColor = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.7)";

  return (
    <div className={`max-w-7xl mx-auto p-6 min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`rounded-xl shadow-lg p-6 transition-colors duration-200 ${
        isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <TrendingUp className="w-8 h-8 text-blue-500" />
            <div>
              <h1 className={`text-2xl font-bold transition-colors duration-200 ${
                isDark ? 'text-white' : 'text-gray-800'
              }`}>
                AI Stock Prediction Simulator
              </h1>
              <p className={`transition-colors duration-200 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Smart Predictions Powered by AI
              </p>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            {/* Symbol Selector */}
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
              }`}
              disabled={isLoading}
            >
              {availableStocks.map(stock => (
                <option key={stock.symbol} value={stock.symbol}>
                  {stock.symbol} - {stock.name}
                </option>
              ))}
            </select>
            
            {/* Timeframe Selector */}
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as '1d' | '1w' | '1m')}
              className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
              }`}
              disabled={isLoading}
            >
              <option value="1d">1 Day</option>
              <option value="1w">1 Week</option>
              <option value="1m">1 Month</option>
            </select>
            
            {/* Generate Prediction Button */}
            <button
              onClick={fetchPredictionData}
              disabled={isLoading || !historicalData.length}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Analyzing...' : 'Generate Prediction'}</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className={`mb-6 p-4 rounded-lg border flex items-center space-x-2 ${
            isDark 
              ? 'bg-red-900/50 border-red-800 text-red-200' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="mb-6 p-8 text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              {predictionData ? 'Loading historical data...' : 'Analyzing social media sentiment and generating prediction...'}
            </p>
          </div>
        )}

        {/* Statistics Panel */}
        {stats && !isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-blue-900/30 border border-blue-800/50' : 'bg-blue-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Current Price</p>
                  <p className="text-2xl font-bold text-blue-500">
                    ${stats.currentPrice.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-orange-900/30 border border-orange-800/50' : 'bg-orange-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>AI Prediction</p>
                  <p className="text-2xl font-bold text-orange-500">
                    ${stats.predictedPrice.toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              stats.changePercent >= 0 
                ? isDark ? 'bg-green-900/30 border border-green-800/50' : 'bg-green-50'
                : isDark ? 'bg-red-900/30 border border-red-800/50' : 'bg-red-50'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Predicted Change</p>
                  <p className={`text-2xl font-bold ${stats.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stats.changePercent >= 0 ? '+' : ''}{stats.changePercent.toFixed(2)}%
                  </p>
                </div>
                <BarChart3 className={`w-8 h-8 ${stats.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-900/30 border border-purple-800/50' : 'bg-purple-50'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>AI Confidence</p>
                  <p className="text-2xl font-bold text-purple-500">
                    {Math.round(stats.confidence * 100)}%
                  </p>
                  <p className={`text-xs capitalize ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {stats.direction} • {stats.sentiment}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Analysis Summary */}
        {stats && predictionData && !isLoading && (
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <h3 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>AI Analysis Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Social Posts: <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.postsAnalyzed}</span></p>
              </div>
              <div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Influencer Posts: <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.influencerPosts}</span></p>
              </div>
              <div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Technical Trend: <span className={`font-semibold capitalize ${isDark ? 'text-white' : 'text-gray-800'}`}>{stats.technicalTrend}</span></p>
              </div>
              <div>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Recent Change: <span className={`font-semibold ${stats.priceChangePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.priceChangePercent >= 0 ? '+' : ''}{stats.priceChangePercent.toFixed(2)}%
                </span></p>
              </div>
            </div>
          </div>
        )}

        {/* Date Navigation */}
        <div className={`flex items-center justify-between mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <button
            onClick={() => navigateDate('prev')}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-200' 
                : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <Calendar className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
            <span className={`font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              {currentDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          <button
            onClick={() => navigateDate('next')}
            disabled={isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-200' 
                : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
            }`}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Chart Controls */}
        <div className="flex items-center space-x-4 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showActual}
              onChange={(e) => setShowActual(e.target.checked)}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span className="text-blue-500 font-medium">Show Historical Data</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showPredictions}
              onChange={(e) => setShowPredictions(e.target.checked)}
              className="rounded text-orange-500 focus:ring-orange-500"
            />
            <span className="text-orange-500 font-medium">Show AI Predictions</span>
          </label>
        </div>

        {/* Chart */}
        {chartData.length > 0 && !isLoading && (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: axisColor }}
                  tickLine={{ stroke: axisColor }}
                  axisLine={{ stroke: axisColor }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: axisColor }}
                  tickLine={{ stroke: axisColor }}
                  axisLine={{ stroke: axisColor }}
                  tickFormatter={(value) => `$${value}`}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                
                {showActual && (
                  <Line
                    type="monotone"
                    dataKey="actualPrice"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                    name="Historical Price"
                  />
                )}
                
                {showPredictions && (
                  <Line
                    type="monotone"
                    dataKey="predictedPrice"
                    stroke="#F97316"
                    strokeWidth={4}
                    strokeDasharray="8 4"
                    dot={{ fill: '#F97316', strokeWidth: 2, r: 6 }}
                    connectNulls={false}
                    name="AI Prediction"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 bg-blue-500 rounded"></div>
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Historical Market Data</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-1 bg-orange-500 rounded" style={{backgroundImage: 'repeating-linear-gradient(to right, #F97316 0, #F97316 4px, transparent 4px, transparent 8px)'}}></div>
            <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>AI Prediction</span>
          </div>
        </div>

        {/* No Data State */}
        {!historicalData.length && !isLoading && (
          <div className="h-96 flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>No historical data available</p>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-400'}`}>Select a stock symbol to begin analysis</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockPredictionSimulator;