import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import StockChart from '@/components/charts/StockChart';
import PredictionInfo from '@/components/stocks/PredictionInfo';
import { getStockDetails, getStockHistoricalData, getPrediction, StockData, HistoricalData } from '@/services/stockService';
import { predictStockPrices } from '@/services/predictionService';
import { ArrowUp, ArrowDown, Clock, TrendingUp, TrendingDown, Activity, DollarSign, AlertCircle } from 'lucide-react';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stock, setStock] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictedData, setPredictedData] = useState<HistoricalData[] | null>(null);
  const [prediction, setPrediction] = useState<{
    bullish: boolean;
    confidence: number;
    prediction: string;
  } | null>(null);
  const [timeRange, setTimeRange] = useState<'1w' | '1m' | '3m' | '1y'>('1m');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        // Get stock details
        const stockData = await getStockDetails(symbol);
        if (!stockData) {
          navigate('/not-found');
          return;
        }
        
        setStock(stockData);
        
        // Get historical data based on time range
        const days = timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : 365;
        const historical = await getStockHistoricalData(symbol, days);
        console.log("Fetched historical data:", historical);
        setHistoricalData(historical);
        
        // Generate price predictions
        const predictions = await predictStockPrices(symbol, historical);
        setPredictedData(predictions);
        
        // Get prediction text
        const predictionData = await getPrediction(symbol);
        setPrediction(predictionData);
      } catch (error) {
        console.error("Error fetching stock details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [symbol, timeRange, navigate]);

  if (loading) {
    return (
      <AppLayout>
        <div className="finova-card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
          <p className="mt-4 text-white/80">Loading stock data...</p>
        </div>
      </AppLayout>
    );
  }

  if (!stock) {
    return (
      <AppLayout>
        <div className="finova-card p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-red-400" />
          <p className="mt-4 text-white text-xl">Stock not found</p>
          <button 
            className="mt-4 finova-button px-4 py-2 rounded-lg"
            onClick={() => navigate('/stocks')}
          >
            Back to Stocks
          </button>
        </div>
      </AppLayout>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">{stock.symbol}</h1>
            <p className="text-white/70 mt-1">{stock.name}</p>
          </div>
          <button
            className="finova-button px-4 py-2 rounded-lg text-sm"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="finova-card p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <div className="text-3xl font-bold text-white">${stock.price.toFixed(2)}</div>
                  <div className={`flex items-center mt-1 ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {isPositive ? 
                      <ArrowUp className="w-4 h-4 mr-1" /> : 
                      <ArrowDown className="w-4 h-4 mr-1" />
                    }
                    {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  <TimeRangeButton range="1w" current={timeRange} onClick={() => setTimeRange('1w')} />
                  <TimeRangeButton range="1m" current={timeRange} onClick={() => setTimeRange('1m')} />
                  <TimeRangeButton range="3m" current={timeRange} onClick={() => setTimeRange('3m')} />
                  <TimeRangeButton range="1y" current={timeRange} onClick={() => setTimeRange('1y')} />
                </div>
              </div>
              
              {historicalData.length > 0 ? (
                <StockChart 
                  data={historicalData} 
                  predictedData={predictedData || undefined}
                  color={isPositive ? '#4ADE80' : '#F87171'} 
                />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-white/70">No chart data available</p>
                </div>
              )}
              
              {predictedData && predictedData.length > 0 && (
                <div className="mt-3 flex justify-end">
                  <div className="flex items-center">
                    <span className="h-1 w-8 bg-primary mr-2"></span>
                    <span className="text-white/70 text-sm mr-4">Historical</span>
                    <span className="h-1 w-8 bg-green-500 mr-2" style={{borderTop: '1px dashed #10B981'}}></span>
                    <span className="text-white/70 text-sm">Predicted</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="finova-card p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">AI Prediction</h2>
              {predictedData && predictedData.length > 0 ? (
                <PredictionInfo predictions={predictedData} symbol={symbol || ''} />
              ) : (
                <div className="text-white/70">No prediction data available.</div>
              )}
            </div>

            <div className="finova-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Key Statistics</h2>
              
              <div className="space-y-4">
                <StockStat 
                  icon={<DollarSign className="w-5 h-5 text-finova-primary" />}
                  label="Market Cap"
                  value={`$${(stock.marketCap / 1000000000).toFixed(2)}B`}
                />
                <StockStat 
                  icon={<Activity className="w-5 h-5 text-finova-primary" />}
                  label="Volume"
                  value={`${(stock.volume / 1000000).toFixed(2)}M`}
                />
                <StockStat 
                  icon={<TrendingUp className="w-5 h-5 text-finova-primary" />}
                  label="P/E Ratio"
                  value={stock.peRatio.toFixed(2)}
                />
                <StockStat 
                  icon={<Clock className="w-5 h-5 text-finova-primary" />}
                  label="Updated"
                  value="Just now"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

interface TimeRangeButtonProps {
  range: '1w' | '1m' | '3m' | '1y';
  current: string;
  onClick: () => void;
}

const TimeRangeButton: React.FC<TimeRangeButtonProps> = ({ range, current, onClick }) => {
  const isActive = current === range;
  
  return (
    <button
      className={`px-3 py-1 rounded-md text-sm ${
        isActive 
          ? 'bg-finova-primary text-white' 
          : 'bg-white/10 text-white/70 hover:bg-white/20'
      }`}
      onClick={onClick}
    >
      {range}
    </button>
  );
};

interface StockStatProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StockStat: React.FC<StockStatProps> = ({ icon, label, value }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {icon}
        <span className="ml-2 text-white/70">{label}</span>
      </div>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
};

export default StockDetail;
