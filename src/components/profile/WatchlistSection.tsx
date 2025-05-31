import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const WatchlistSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Get saved watchlist from localStorage
  const savedWatchlistJson = typeof window !== 'undefined' ? localStorage.getItem('watchlist') : null;
  const watchlist = savedWatchlistJson ? JSON.parse(savedWatchlistJson) : [];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          My Stock Watchlist
        </h3>
        <Link to="/stocks">
          <Button 
            variant="outline" 
            size="sm"
            className={`transition-all duration-300 ${isDark 
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-purple-500/50' 
              : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-purple-300'
            }`}
          >
            Manage Watchlist
          </Button>
        </Link>
      </div>
      
      {watchlist.length === 0 ? (
        <div className={`rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDark ? 'border-gray-600 bg-gray-700/20' : 'border-gray-300 bg-gray-50/50'
        }`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isDark ? 'bg-purple-500/20' : 'bg-purple-100'
          }`}>
            <Star className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
          </div>
          <h4 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            No stocks in your watchlist
          </h4>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Start tracking your favorite stocks to receive updates and alerts
          </p>
          <Link to="/stocks">
            <Button 
              size="sm"
              className={`
                px-6 py-3 rounded-xl font-semibold text-white
                transition-all duration-300 transform hover:scale-[1.02]
                ${isDark
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
                }
              `}
            >
              Add Your First Stock
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <div className={`p-4 rounded-xl mb-4 ${
            isDark ? 'bg-gray-700/30 border border-gray-600' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Tracking {watchlist.length} {watchlist.length === 1 ? 'stock' : 'stocks'}
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {watchlist.filter(stock => stock.change >= 0).length} up
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {watchlist.filter(stock => stock.change < 0).length} down
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {watchlist.map((stock, index) => (
            <Link to={`/stocks/${stock.symbol}`} key={index}>
              <div className={`
                group p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] 
                flex items-center justify-between cursor-pointer
                ${isDark 
                  ? 'border border-gray-600 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/25 bg-gray-700/30 hover:bg-gray-700/50' 
                  : 'border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/25 bg-gray-50/50 hover:bg-white'
                }
              `}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    stock.change >= 0 
                      ? 'bg-green-500/20 text-green-500 group-hover:bg-green-500/30' 
                      : 'bg-red-500/20 text-red-500 group-hover:bg-red-500/30'
                  }`}>
                    {stock.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h4 className={`font-semibold transition-colors ${
                      isDark ? 'text-white group-hover:text-purple-300' : 'text-gray-900 group-hover:text-purple-600'
                    }`}>
                      {stock.name}
                    </h4>
                    <p className={`text-sm flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span>{stock.symbol}</span>
                      <span className="w-1 h-1 bg-current rounded-full opacity-50"></span>
                      <span className="text-xs">Stock</span>
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${stock.price?.toFixed(2) || '0.00'}
                  </p>
                  <div className="flex items-center gap-1 justify-end">
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <p className={`text-sm font-medium ${
                      stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {stock.change >= 0 ? '+' : ''}{stock.changePercent?.toFixed(2) || '0.00'}%
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {watchlist.length > 0 && (
            <div className="text-center pt-4">
              <Link to="/stocks">
                <Button 
                  variant="outline"
                  size="sm"
                  className={`transition-all duration-300 ${isDark 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-purple-500/50' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-purple-300'
                  }`}
                >
                  View All Stocks
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default WatchlistSection;