import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StockCard from '@/components/stocks/StockCard';
import StockSearchBar from '@/components/stocks/StockSearchBar';
import { getPopularStocks, StockData } from '@/services/stockService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/context/ThemeContext';
import { 
  TrendingUp, 
  Star, 
  Clock, 
  Users, 
  Activity, 
  Heart,
  Sparkles,
  BarChart3
} from 'lucide-react';

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        const data = await getPopularStocks();
        setStocks(data);
      } catch (error) {
        console.error('Failed to fetch stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    // Load any saved watchlist from localStorage
    const savedWatchlist = localStorage.getItem('watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (e) {
        console.error('Failed to load watchlist:', e);
      }
    }

    // Load search history from localStorage
    const savedSearchHistory = localStorage.getItem('stockSearchHistory');
    if (savedSearchHistory) {
      try {
        setSearchHistory(JSON.parse(savedSearchHistory));
      } catch (e) {
        console.error('Failed to load search history:', e);
      }
    }

    fetchStocks();
  }, []);

  const handleSearch = async (query: string) => {
    // Save search to history
    const updatedHistory = [query, ...searchHistory.filter(item => item !== query)].slice(0, 10);
    setSearchHistory(updatedHistory);
    localStorage.setItem('stockSearchHistory', JSON.stringify(updatedHistory));
    
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCardClick = (symbol: string) => {
    navigate(`/stocks/${symbol}`);
  };

  const addToWatchlist = (stock: StockData) => {
    if (!watchlist.some(item => item.symbol === stock.symbol)) {
      const updatedWatchlist = [...watchlist, stock];
      setWatchlist(updatedWatchlist);
      localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    const updatedWatchlist = watchlist.filter(stock => stock.symbol !== symbol);
    setWatchlist(updatedWatchlist);
    localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };

  const displayStocks = activeTab === 'popular' ? stocks : watchlist;

  // Calculate market stats
  const gainers = stocks.filter(stock => stock.change > 0).length;
  const losers = stocks.filter(stock => stock.change < 0).length;
  const avgChange = stocks.reduce((sum, stock) => sum + Math.abs(stock.changePercent), 0) / stocks.length;

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header Section */}
        <div className={`rounded-3xl p-8 mb-6 ${
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
                  Stock Market
                </h1>
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Track and analyze stock performance in real-time
                </p>
              </div>
            </div>

            {/* Market Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-2xl text-center ${
                isDark ? 'bg-emerald-900/30 border border-emerald-800/50' : 'bg-emerald-50 border border-emerald-200'
              }`}>
                <div className="flex items-center justify-center mb-1">
                  <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Gainers
                  </span>
                </div>
                <div className="text-xl font-bold text-emerald-500">{gainers}</div>
              </div>
              
              <div className={`p-4 rounded-2xl text-center ${
                isDark ? 'bg-red-900/30 border border-red-800/50' : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-center mb-1">
                  <Activity className="w-4 h-4 text-red-500 mr-1" />
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Decliners
                  </span>
                </div>
                <div className="text-xl font-bold text-red-500">{losers}</div>
              </div>
              
              <div className={`p-4 rounded-2xl text-center ${
                isDark ? 'bg-blue-900/30 border border-blue-800/50' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center justify-center mb-1">
                  <BarChart3 className="w-4 h-4 text-blue-500 mr-1" />
                  <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Avg Change
                  </span>
                </div>
                <div className="text-xl font-bold text-blue-500">{avgChange.toFixed(1)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className={`rounded-3xl p-6 mb-6 ${
          isDark 
            ? 'bg-gray-800/90 border border-gray-700/50' 
            : 'bg-white/90 border border-gray-200/50'
        } backdrop-blur-lg shadow-2xl`}>
          <StockSearchBar onSearch={handleSearch} />

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Recent Searches
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(query)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105 ${
                      isDark
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className={`rounded-3xl ${
          isDark 
            ? 'bg-gray-800/90 border border-gray-700/50' 
            : 'bg-white/90 border border-gray-200/50'
        } backdrop-blur-lg shadow-2xl overflow-hidden`}>
          <Tabs defaultValue="popular" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={`w-full justify-start p-6 bg-transparent border-b ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <TabsTrigger 
                value="popular" 
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isDark 
                    ? 'text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white' 
                    : 'text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Popular Stocks</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === 'popular' 
                    ? 'bg-white/20 text-white' 
                    : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stocks.length}
                </span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="watchlist" 
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  isDark 
                    ? 'text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white' 
                    : 'text-gray-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Watchlist</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === 'watchlist' 
                    ? 'bg-white/20 text-white' 
                    : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}>
                  {watchlist.length}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="popular" className="p-6">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <div key={i} className={`p-6 rounded-2xl border animate-pulse ${
                      isDark 
                        ? 'bg-gray-800/50 border-gray-700/50' 
                        : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className={`h-6 rounded w-1/3 mb-2 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                      <div className={`h-4 rounded w-1/2 mb-4 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                      <div className={`h-8 rounded w-2/3 mt-4 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                      <div className={`h-4 rounded w-1/4 mt-2 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {stocks.map((stock, index) => (
                    <div
                      key={stock.symbol}
                      className={`
                        p-6 rounded-2xl border cursor-pointer transition-all duration-300 
                        hover:shadow-lg transform hover:scale-[1.02] group
                        ${isDark 
                          ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border-gray-700/50 hover:border-gray-600' 
                          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }
                      `}
                      onClick={() => handleCardClick(stock.symbol)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <StockCard
                        symbol={stock.symbol}
                        name={stock.name}
                        price={stock.price}
                        change={stock.change}
                        changePercent={stock.changePercent}
                        onClick={() => handleCardClick(stock.symbol)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="watchlist" className="p-6">
              {watchlist.length === 0 ? (
                <div className={`p-12 text-center rounded-2xl border ${
                  isDark 
                    ? 'bg-gray-800/30 border-gray-700/50' 
                    : 'bg-gray-50/50 border-gray-200'
                }`}>
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                    isDark ? 'bg-gray-700/50' : 'bg-gray-100'
                  }`}>
                    <Heart className={`w-10 h-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Your Watchlist is Empty
                  </h3>
                  <p className={`mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Add stocks to your watchlist to track them here.
                  </p>
                  <button
                    onClick={() => setActiveTab('popular')}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                  >
                    Browse Popular Stocks
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {watchlist.map((stock, index) => (
                    <div
                      key={stock.symbol}
                      className={`
                        p-6 rounded-2xl border cursor-pointer transition-all duration-300 
                        hover:shadow-lg transform hover:scale-[1.02] group relative
                        ${isDark 
                          ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border-gray-700/50 hover:border-gray-600' 
                          : 'bg-gradient-to-br from-white to-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                        }
                      `}
                      onClick={() => handleCardClick(stock.symbol)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {/* Remove from watchlist button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(stock.symbol);
                        }}
                        className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                          isDark 
                            ? 'bg-red-900/50 hover:bg-red-800/70 text-red-400' 
                            : 'bg-red-100 hover:bg-red-200 text-red-600'
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                      
                      <StockCard
                        symbol={stock.symbol}
                        name={stock.name}
                        price={stock.price}
                        change={stock.change}
                        changePercent={stock.changePercent}
                        onClick={() => handleCardClick(stock.symbol)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Stocks;