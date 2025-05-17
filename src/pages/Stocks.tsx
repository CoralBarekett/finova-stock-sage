import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StockCard from '@/components/stocks/StockCard';
import StockSearchBar from '@/components/stocks/StockSearchBar';
import { getPopularStocks, StockData } from '@/services/stockService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTheme } from '@/context/ThemeContext';

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const navigate = useNavigate();
  const { theme } = useTheme();

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

  // We'll still keep these functions but modify our approach for adding to watchlist
  // This will be used when we implement a custom add to watchlist button
  const addToWatchlist = (stock: StockData) => {
    // Check if stock is already in watchlist
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

  return (
    <>
      <div className="mb-6">
        <h1 className={`text-3xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>Stocks</h1>
        <p className={theme === 'light' ? 'text-gray-600' : 'text-white/70'}>Track and analyze stock performance</p>
      </div>

      <StockSearchBar onSearch={handleSearch} />

      {/* Search History Section */}
      {searchHistory.length > 0 && (
        <div className="mt-4">
          <h3 className={`text-sm font-medium mb-2 ${theme === 'light' ? 'text-gray-700' : 'text-white/80'}`}>Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((query, index) => (
              <button
                key={index}
                onClick={() => handleSearch(query)}
                className={`px-3 py-1 rounded-full text-xs ${
                  theme === 'light'
                    ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    : 'bg-white/10 text-white/90 hover:bg-white/20'
                }`}
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <Tabs defaultValue="popular" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={theme === 'light' ? 'bg-gray-100' : 'bg-white/10'}>
            <TabsTrigger 
              value="popular" 
              className={theme === 'light' 
                ? 'text-gray-900 data-[state=active]:bg-white' 
                : 'text-white data-[state=active]:bg-white/20'
              }
            >
              Popular
            </TabsTrigger>
            <TabsTrigger 
              value="watchlist" 
              className={theme === 'light' 
                ? 'text-gray-900 data-[state=active]:bg-white' 
                : 'text-white data-[state=active]:bg-white/20'
              }
            >
              Watchlist
            </TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="finova-card p-4 animate-pulse">
                    <div className="h-6 bg-white/10 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-white/10 rounded w-2/3 mt-4"></div>
                    <div className="h-4 bg-white/10 rounded w-1/4 mt-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stocks.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    symbol={stock.symbol}
                    name={stock.name}
                    price={stock.price}
                    change={stock.change}
                    changePercent={stock.changePercent}
                    onClick={() => handleCardClick(stock.symbol)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="watchlist" className="mt-4">
            {watchlist.length === 0 ? (
              <div className="finova-card p-6 text-center">
                <p className={theme === 'light' ? 'text-gray-600' : 'text-white/70'}>Your watchlist is empty.</p>
                <p className={theme === 'light' ? 'text-gray-500 text-sm mt-2' : 'text-white/50 text-sm mt-2'}>
                  Add stocks to your watchlist to track them here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {watchlist.map((stock) => (
                  <StockCard
                    key={stock.symbol}
                    symbol={stock.symbol}
                    name={stock.name}
                    price={stock.price}
                    change={stock.change}
                    changePercent={stock.changePercent}
                    onClick={() => handleCardClick(stock.symbol)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Stocks;