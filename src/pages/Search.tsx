import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import StockCard from '@/components/stocks/StockCard';
import StockSearchBar from '@/components/stocks/StockSearchBar';
import { searchStocks, StockData } from '@/services/stockService';
import { Search as SearchIcon } from 'lucide-react';

const Search: React.FC = () => {
  const [results, setResults] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Search Stocks</h1>
        <p className="text-muted-foreground">Find and analyze stocks by name or symbol</p>
      </div>

      <StockSearchBar onSearch={handleSearch} />

      <div className="mt-6">
        {query && (
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Results for "{query}"
          </h2>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="finova-card p-4 animate-pulse">
                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-muted rounded w-2/3 mt-4"></div>
                <div className="h-4 bg-muted rounded w-1/4 mt-2"></div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((stock) => (
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
        ) : query ? (
          <div className="finova-card p-8 text-center">
            <SearchIcon className="w-12 h-12 mx-auto text-muted" />
            <p className="mt-4 text-foreground text-lg">No results found</p>
            <p className="mt-2 text-muted-foreground">
              Try searching for a different stock name or symbol
            </p>
          </div>
        ) : (
          <div className="finova-card p-8 text-center">
            <SearchIcon className="w-12 h-12 mx-auto text-primary/70" />
            <p className="mt-4 text-foreground text-lg">Enter a search term</p>
            <p className="mt-2 text-muted-foreground">
              Search for stocks by company name or symbol
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Search;