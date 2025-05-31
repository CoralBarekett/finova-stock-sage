import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StockCard from '@/components/stocks/StockCard';
import StockChart from '@/components/charts/StockChart';
import { getPopularStocks, getStockHistoricalData, StockData, HistoricalData } from '@/services/stockService';
import { 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity, 
  BarChart3, 
  Users, 
  Clock, 
  Sparkles,
  Star,
  Brain,
  Zap,
  Target
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const Dashboard: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [trendingStock, setTrendingStock] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

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
  const totalVolume = stocks.reduce((sum, stock) => sum + (stock.volume || 0), 0);
  const avgChange = stocks.reduce((sum, stock) => sum + Math.abs(stock.changePercent), 0) / stocks.length;

  if (loading) {
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
              Loading Market Data...
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Gathering real-time market insights
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* Enhanced Header Section */}
        <div className={`rounded-3xl p-8 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50' 
            : 'bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50'
        } backdrop-blur-lg shadow-2xl`}>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h1 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                  Market Dashboard
                </h1>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Real-time market overview and trending stocks
                </p>
              </div>
            </div>
            
            {/* Enhanced Market Status */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 border ${
                isMarketPositive 
                  ? isDark 
                    ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800/50' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : isDark 
                    ? 'bg-red-900/30 text-red-400 border-red-800/50' 
                    : 'bg-red-50 text-red-700 border-red-200'
              }`}>
                <div className={`p-1 rounded-lg mr-2 ${
                  isMarketPositive ? 'bg-emerald-500/20' : 'bg-red-500/20'
                }`}>
                  {isMarketPositive ? 
                    <TrendingUp className="w-4 h-4" /> : 
                    <TrendingDown className="w-4 h-4" />
                  }
                </div>
                Market: {isMarketPositive ? 'Bullish' : 'Bearish'}
              </div>
              
              <div className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium border ${
                isDark 
                  ? 'bg-blue-900/30 text-blue-400 border-blue-800/50' 
                  : 'bg-blue-50 text-blue-700 border-blue-200'
              }`}>
                <div className="p-1 rounded-lg bg-blue-500/20 mr-2">
                  <Clock className="w-4 h-4" />
                </div>
                Live Data
              </div>
            </div>
          </div>

          {/* Market Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border-gray-700/50' 
                : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-blue-500/20">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                </div>
                <Zap className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Active Stocks
              </div>
              <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {stocks.length}
              </div>
            </div>
            
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              isDark 
                ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-800/50' 
                : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-emerald-500/20">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                </div>
                <Star className="w-4 h-4 text-emerald-500" />
              </div>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Gainers
              </div>
              <div className="text-2xl font-bold text-emerald-500">
                {marketTrend.positive}
              </div>
            </div>
            
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              isDark 
                ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-800/50' 
                : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-red-500/20">
                  <TrendingDown className="w-5 h-5 text-red-500" />
                </div>
                <Target className="w-4 h-4 text-red-500" />
              </div>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Decliners
              </div>
              <div className="text-2xl font-bold text-red-500">
                {marketTrend.negative}
              </div>
            </div>
            
            <div className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
              isDark 
                ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-800/50' 
                : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-xl bg-orange-500/20">
                  <Activity className="w-5 h-5 text-orange-500" />
                </div>
                <Brain className="w-4 h-4 text-orange-500" />
              </div>
              <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Avg Change
              </div>
              <div className="text-2xl font-bold text-orange-500">
                {avgChange.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Trending Stock Section */}
        {trendingStock && (
          <div className={`rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 hover:border-purple-500/50' 
              : 'bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50 hover:border-purple-300'
          } backdrop-blur-lg shadow-2xl`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <div className={`p-3 rounded-2xl ${
                      isDark 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }`}>
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Trending Stock
                    </h2>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Most active in the market today
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {trendingStock.symbol}
                  </span>
                  <span className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {trendingStock.name}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ${trendingStock.price.toFixed(2)}
                </div>
                <div className={`flex items-center justify-end space-x-2 ${
                  trendingStock.change >= 0 ? 'text-emerald-500' : 'text-red-500'
                }`}>
                  <div className={`p-1 rounded-lg ${
                    trendingStock.change >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
                  }`}>
                    {trendingStock.change >= 0 ? 
                      <TrendingUp className="w-5 h-5" /> : 
                      <TrendingDown className="w-5 h-5" />
                    }
                  </div>
                  <span className="text-xl font-bold">
                    {trendingStock.change >= 0 ? '+' : ''}${trendingStock.change.toFixed(2)} 
                    ({trendingStock.change >= 0 ? '+' : ''}{trendingStock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className={`rounded-2xl p-6 mb-6 ${
              isDark ? 'bg-gray-800/30 border border-gray-700/50' : 'bg-gray-50/50 border border-gray-200'
            }`}>
              {historicalData.length > 0 ? (
                <StockChart 
                  data={historicalData} 
                  color={trendingStock.change >= 0 ? '#10B981' : '#EF4444'}
                />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <div className="text-center">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
                      isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                    }`}>
                      <BarChart3 className={`w-8 h-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
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
                  flex items-center space-x-2 px-8 py-4 rounded-2xl font-bold text-lg
                  transition-all duration-300 transform hover:scale-105 active:scale-95
                  bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 
                  text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/25
                `}
                onClick={() => handleStockClick(trendingStock.symbol)}
              >
                <span>View Detailed Analysis</span>
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Enhanced Popular Stocks Section */}
        <div className={`rounded-3xl ${
          isDark 
            ? 'bg-gray-800/90 border border-gray-700/50' 
            : 'bg-white/90 border border-gray-200/50'
        } backdrop-blur-lg shadow-2xl overflow-hidden`}>
          <div className="p-8 border-b border-gray-700/50 dark:border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Popular Stocks
                  </h2>
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Most traded stocks in the market
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => navigate('/stocks')}
                className={`
                  flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold
                  transition-all duration-200 hover:scale-105
                  ${isDark
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 border border-gray-600'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                  }
                `}
              >
                <span>View All Stocks</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stocks.map((stock, index) => (
                <div
                  key={stock.symbol}
                  className={`
                    p-6 rounded-2xl border cursor-pointer transition-all duration-300 
                    hover:shadow-lg transform hover:scale-[1.02] group relative overflow-hidden
                    ${isDark 
                      ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border-gray-700/50 hover:border-gray-600' 
                      : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }
                  `}
                  onClick={() => handleStockClick(stock.symbol)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Background decoration */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
                    <div className={`w-full h-full rounded-full ${
                      stock.change >= 0 ? 'bg-emerald-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  
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
    </div>
  );
};

export default Dashboard;