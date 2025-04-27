
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StockCard from '@/components/stocks/StockCard';
import StockChart from '@/components/charts/StockChart';
import { getPopularStocks, getStockHistoricalData, StockData, HistoricalData } from '@/services/stockService';
import { ArrowUpRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [trendingStock, setTrendingStock] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  // Helper: utility tailwind string for mode-aware color
  const light = "light";
  const dark = "dark";

  return (

      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Market overview and trending stocks</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center">
            <div 
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                isMarketPositive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
              }`}
            >
              {isMarketPositive ? 
                <TrendingUp className="w-4 h-4 mr-1.5" /> : 
                <TrendingDown className="w-4 h-4 mr-1.5" />
              }
              Market: {isMarketPositive ? 'Bullish' : 'Bearish'}
            </div>
            <div className="ml-2 px-3 py-1.5 bg-white/10 rounded-full text-foreground text-sm font-medium flex items-center">
              <DollarSign className="w-4 h-4 mr-1.5" />
              Trading Day
            </div>
          </div>
        </div>

        {loading ? (
          <div className="finova-card p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            <p className="mt-4 text-muted-foreground">Loading market data...</p>
          </div>
        ) : (
          <>
            {trendingStock && (
              <div className="finova-card p-6 mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground flex items-center">
                      Trending Stock 
                      <ArrowUpRight className="ml-2 w-5 h-5 text-primary" />
                    </h2>
                    <div className="mt-1 flex items-center">
                      <span className="text-2xl font-bold mr-2 text-foreground">{trendingStock.symbol}</span>
                      <span className="text-muted-foreground">{trendingStock.name}</span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <div className="text-2xl font-bold text-foreground">${trendingStock.price.toFixed(2)}</div>
                    <div className={`text-sm ${trendingStock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {trendingStock.change >= 0 ? '+' : ''}{trendingStock.change.toFixed(2)} ({trendingStock.changePercent.toFixed(2)}%)
                    </div>
                  </div>
                </div>
                {historicalData.length > 0 ? (
                  <StockChart 
                    data={historicalData} 
                    color={trendingStock.change >= 0 ? '#4ADE80' : '#F87171'}
                  />
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading chart data...</p>
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <button 
                    className="finova-button px-4 py-2 rounded-lg bg-primary hover:bg-accent transition-colors text-primary-foreground text-sm flex items-center"
                    onClick={() => handleStockClick(trendingStock.symbol)}
                  >
                    View Details
                    <ArrowUpRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            <h2 className="text-xl font-bold text-foreground mb-4">Popular Stocks</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stocks.map((stock) => (
                <StockCard
                  key={stock.symbol}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change={stock.change}
                  changePercent={stock.changePercent}
                  onClick={() => handleStockClick(stock.symbol)}
                />
              ))}
            </div>
          </>
        )}
      </div>
  );
};

export default Dashboard;
