// pages/Search.tsx - Modern Redesign
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StockCard from '@/components/stocks/StockCard';
import StockSearchBar from '@/components/stocks/StockSearchBar';
import { searchStocks, StockData } from '@/services/stockService';
import { useTheme } from '@/context/ThemeContext';
import { 
  Search as SearchIcon, 
  TrendingUp, 
  Clock, 
  Filter,
  SortAsc,
  SortDesc,
  Sparkles,
  Target
} from 'lucide-react';

const Search: React.FC = () => {
  const [results, setResults] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'change'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filterType, setFilterType] = useState<'all' | 'gainers' | 'losers'>('all');
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('q') || '';

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const data = await searchStocks(searchQuery);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleCardClick = (symbol: string) => {
    navigate(`/stocks/${symbol}`);
  };

  // Filter and sort results
  const filteredAndSortedResults = React.useMemo(() => {
    let filtered = [...results];
    
    // Apply filter
    if (filterType === 'gainers') {
      filtered = filtered.filter(stock => stock.change > 0);
    } else if (filterType === 'losers') {
      filtered = filtered.filter(stock => stock.change < 0);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortBy) {
        case 'name':
          compareValue = a.name.localeCompare(b.name);
          break;
        case 'price':
          compareValue = a.price - b.price;
          break;
        case 'change':
          compareValue = a.changePercent - b.changePercent;
          break;
      }
      
      return sortOrder === 'asc' ? compareValue : -compareValue;
    });
    
    return filtered;
  }, [results, filterType, sortBy, sortOrder]);

  const toggleSort = (newSortBy: 'name' | 'price' | 'change') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

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
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                <SearchIcon className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
                <Target className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                Search Stocks
              </h1>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Find and analyze stocks by name or symbol
              </p>
            </div>
          </div>

          <StockSearchBar onSearch={handleSearch} />
        </div>

        {/* Search Results Header */}
        {query && (
          <div className={`rounded-3xl p-6 mb-6 ${
            isDark 
              ? 'bg-gray-800/90 border border-gray-700/50' 
              : 'bg-white/90 border border-gray-200/50'
          } backdrop-blur-lg shadow-2xl`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center space-x-3">
                <Clock className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Results for "{query}"
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {loading ? 'Searching...' : `${filteredAndSortedResults.length} stocks found`}
                  </p>
                </div>
              </div>

              {/* Filter and Sort Controls */}
              {results.length > 0 && !loading && (
                <div className="flex flex-wrap items-center gap-3">
                  {/* Filter Buttons */}
                  <div className="flex items-center space-x-2">
                    <Filter className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`} />
                    <button
                      onClick={() => setFilterType('all')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        filterType === 'all'
                          ? 'bg-blue-600 text-white'
                          : isDark 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterType('gainers')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        filterType === 'gainers'
                          ? 'bg-emerald-600 text-white'
                          : isDark 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Gainers
                    </button>
                    <button
                      onClick={() => setFilterType('losers')}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                        filterType === 'losers'
                          ? 'bg-red-600 text-white'
                          : isDark 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Losers
                    </button>
                  </div>

                  {/* Sort Buttons */}
                  <div className="flex items-center space-x-2">
                    {(['name', 'price', 'change'] as const).map((sortType) => (
                      <button
                        key={sortType}
                        onClick={() => toggleSort(sortType)}
                        className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                          sortBy === sortType
                            ? 'bg-purple-600 text-white'
                            : isDark 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        <span className="capitalize">{sortType}</span>
                        {sortBy === sortType && (
                          sortOrder === 'asc' ? 
                            <SortAsc className="w-3 h-3" /> : 
                            <SortDesc className="w-3 h-3" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className={`rounded-3xl ${
          isDark 
            ? 'bg-gray-800/90 border border-gray-700/50' 
            : 'bg-white/90 border border-gray-200/50'
        } backdrop-blur-lg shadow-2xl overflow-hidden`}>
          
          {loading ? (
            <div className="p-12">
              <div className="text-center">
                <div className="relative mx-auto w-20 h-20 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-3 rounded-full border-2 border-purple-300 dark:border-purple-800"></div>
                  <div className="absolute inset-3 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Searching Market Data...
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Finding the best matches for your query
                </p>
              </div>
              
              {/* Loading Skeleton */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
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
            </div>
          ) : filteredAndSortedResults.length > 0 ? (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedResults.map((stock, index) => (
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
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
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
            </div>
          ) : query ? (
            /* No Results Found */
            <div className="p-12 text-center">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <SearchIcon className={`w-12 h-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                No Results Found
              </h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                We couldn't find any stocks matching "{query}". Try searching with a different term.
              </p>
              
              {/* Search Suggestions */}
              <div className="max-w-md mx-auto">
                <h4 className={`text-sm font-medium mb-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Search Tips:
                </h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className={`p-3 rounded-xl ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}>
                    <span className="font-medium">Stock Symbols:</span> Try "AAPL", "TSLA", "MSFT"
                  </div>
                  <div className={`p-3 rounded-xl ${
                    isDark ? 'bg-gray-800/50' : 'bg-gray-50'
                  }`}>
                    <span className="font-medium">Company Names:</span> Try "Apple", "Tesla", "Microsoft"
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => handleSearch('')}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* Initial State */
            <div className="p-12 text-center">
              <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
                isDark ? 'bg-gray-700/50' : 'bg-gray-100'
              }`}>
                <SearchIcon className={`w-12 h-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>
              <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Ready to Search
              </h3>
              <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Enter a stock symbol or company name to get started
              </p>
              
              {/* Popular Search Examples */}
              <div className="max-w-lg mx-auto">
                <h4 className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Popular Searches:
                </h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', 'NVDA'].map((symbol) => (
                    <button
                      key={symbol}
                      onClick={() => handleSearch(symbol)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                        isDark
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                    >
                      {symbol}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;