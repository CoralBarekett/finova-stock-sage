
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface StockSearchBarProps {
  onSearch: (query: string) => void;
}

const StockSearchBar: React.FC<StockSearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          className="finova-input w-full pl-10 pr-4 py-3 rounded-lg"
          placeholder="Search for stocks (e.g., AAPL, TSLA, MSFT)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <div className="p-1 rounded-md hover:bg-muted">
            <span className="sr-only">Search</span>
            <Search className="h-5 w-5 text-primary" />
          </div>
        </button>
      </div>
    </form>
  );
};

export default StockSearchBar;
