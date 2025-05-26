import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StockCard from '@/components/stocks/StockCard';
import StockChart from '@/components/charts/StockChart';
import { getPopularStocks, getStockHistoricalData, StockData, HistoricalData } from '@/services/stockService';
import { ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Activity, BarChart3, Users, Clock, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const Dashboard: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [trendingStock, setTrendingStock] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stocksData = await getPopularStocks();
        setStocks(stocksData);

        const trending = stocksData.reduce((prev, current) => 
          Math.abs(current.changePercent) > Math.abs(prev.changePercent) ? current : prev
        );
        setTrendingStock(trending);

        if (trending) {
          const historical = await getStockHistoricalData(trending.symbol, 30);
          setHistoricalData(historical);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStockClick = (symbol: string) => {
    navigate(`/stocks/${symbol}`);
  };

  const calculateMarketTrend = () => {
    if (stocks.length === 0) return { positive: 0, negative: 0 };
    const positive = stocks.filter(stock => stock.change > 0).length;
    const negative = stocks.length - positive;
    return { positive, negative };
  };

  const marketTrend = calculateMarketTrend();
  const isMarketPositive = marketTrend.positive >= marketTrend.negative;
  const isDark = theme === 'dark';

  const totalVolume = stocks.reduce((sum, stock) => sum + (stock.volume || 0), 0);
  const avgChange = stocks.reduce((sum, stock) => sum + Math.abs(stock.changePercent), 0) / stocks.length;

  if (loading) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="max-w-7xl mx-auto p-6">
          <div className={`rounded-xl p-8 text-center ${
            isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm'
          }`}>
            <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 ${
              isDark ? 'border-white/20 border-t-white' : 'border-gray-200 border-t-blue-500'
            }`}></div>
            <p className={`mt-4 ${isDark ? 'text-white/80' : 'text-gray-600'}`}>
              Loading market data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto p-6">
        {/* Enhanced Header Section */}
        <div className={`rounded-xl p-6 mb-6 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
            : 'bg-gradient-to-br from-white to-gray-50 shadow-sm'
        }`}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Market Dashboard
              </h1>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                Real-time market overview and trending stocks
              </p>
            </div>
            
            {/* Enhanced Market Status */}
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div 
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isMarketPositive 
                    ? isDark 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-green-100 text-green-700 border border-green-200'
                    : isDark 
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                {isMarketPositive ? 
                  <TrendingUp className="w-4 h-4 mr-2" /> : 
                  <TrendingDown className="w-4 h-4 mr-2" />
                }
                Market: {isMarketPositive ? 'Bullish' : 'Bearish'}
              </div>
              
              <div className={`flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                isDark 
                  ? 'bg-gray-700/50 text-gray-300 border border-gray-600' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
              }`}>
                <Clock className="w-4 h-4 mr-2" />
                Live Data
              </div>
            </div>
          </div>

          {/* Market Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className={`flex items-center space-x-2 mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <BarChart3 className="w-4 h-4" />
                <span className="text-sm font-medium">Active Stocks</span>
              </div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stocks.length}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className={`flex items-center space-x-2 mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Gainers</span>
              </div>
              <div className="text-2xl font-bold text-green-500">
                {marketTrend.positive}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className={`flex items-center space-x-2 mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <TrendingDown className="w-4 h-4" />
                <span className="text-sm font-medium">Decliners</span>
              </div>
              <div className="text-2xl font-bold text-red-500">
                {marketTrend.negative}
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-50'
            }`}>
              <div className={`flex items-center space-x-2 mb-2 ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Avg Change</span>
              </div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {avgChange.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Trending Stock Section */}
        {trendingStock && (
          <div className={`rounded-xl p-6 mb-6 transition-all duration-300 hover:shadow-lg ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50' 
              : 'bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md'
          }`}>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg ${
                    isDark 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'bg-purple-100 text-purple-600'
                  }`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Trending Stock
                  </h2>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {trendingStock.symbol}
                  </span>
                  <span className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {trendingStock.name}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 text-right">
                <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${trendingStock.price.toFixed(2)}
                </div>
                <div className={`flex items-center justify-end space-x-2 mt-1 ${
                  trendingStock.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trendingStock.change >= 0 ? 
                    <TrendingUp className="w-5 h-5" /> : 
                    <TrendingDown className="w-5 h-5" />
                  }
                  <span className="text-lg font-semibold">
                    {trendingStock.change >= 0 ? '+' : ''}${trendingStock.change.toFixed(2)} 
                    ({trendingStock.change >= 0 ? '+' : ''}{trendingStock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className={`rounded-lg p-4 mb-4 ${
              isDark ? 'bg-gray-700/30' : 'bg-gray-50/50'
            }`}>
              {historicalData.length > 0 ? (
                <StockChart 
                  data={historicalData} 
                  color={trendingStock.change >= 0 ? '#4ADE80' : '#F87171'}
                />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${
                      isDark ? 'text-gray-600' : 'text-gray-300'
                    }`} />
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Loading chart data...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="flex justify-end">
              <button 
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold
                  transition-all duration-300 transform hover:scale-[1.02]
                  ${isDark
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                  }
                `}
                onClick={() => handleStockClick(trendingStock.symbol)}
              >
                <span>View Details</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Popular Stocks Section */}
        <div className={`rounded-xl p-6 ${
          isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white shadow-sm'
        }`}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                isDark 
                  ? 'bg-blue-500/20 text-blue-400' 
                  : 'bg-blue-100 text-blue-600'
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Popular Stocks
              </h2>
            </div>
            
            <button
              onClick={() => navigate('/stocks')}
              className={`
                flex items-center space-x-2 px-4 py-2 rounded-lg font-medium
                transition-colors duration-200
                ${isDark
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }
              `}
            >
              <span>View All</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all duration-300 
                  hover:shadow-lg transform hover:scale-[1.02]
                  ${isDark 
                    ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-gray-500' 
                    : 'bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }
                `}
                onClick={() => handleStockClick(stock.symbol)}
              >
                <StockCard
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changePercent}
                  onClick={() => handleStockClick(stock.symbol)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;