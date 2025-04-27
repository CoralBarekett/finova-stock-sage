
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import StockCard from '@/components/stocks/StockCard';
import StockSearchBar from '@/components/stocks/StockSearchBar';
import { getPopularStocks, StockData } from '@/services/stockService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Stocks: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('popular');
  const [watchlist, setWatchlist] = useState<StockData[]>([]);
  const navigate = useNavigate();

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

    fetchStocks();
  }, []);

  const handleSearch = async (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCardClick = (symbol: string) => {
    navigate(`/stocks/${symbol}`);
  };

  const displayStocks = activeTab === 'popular' ? stocks : watchlist;

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Stocks</h1>
        <p className="text-white/70">Track and analyze stock performance</p>
      </div>

      <StockSearchBar onSearch={handleSearch} />

      <div className="mt-6">
        <Tabs defaultValue="popular" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white/10">
            <TabsTrigger value="popular" className="text-white data-[state=active]:bg-white/20">
              Popular
            </TabsTrigger>
            <TabsTrigger value="watchlist" className="text-white data-[state=active]:bg-white/20">
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
                <p className="text-white/70">Your watchlist is empty.</p>
                <p className="text-white/50 text-sm mt-2">
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
    </AppLayout>
  );
};

export default Stocks;
