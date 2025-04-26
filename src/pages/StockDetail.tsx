import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layouts/AppLayout';
import StockChart from '@/components/charts/StockChart';
import PredictionInfo from '@/components/stocks/PredictionInfo';
import StockHeader from '@/components/stocks/StockHeader';
import StockStats from '@/components/stocks/StockStats';
import { getStockDetails, getStockHistoricalData, StockData, HistoricalData } from '@/services/stockService';
import { getPredictionsWithSocialSentiment } from '@/services/stockPredictionService';
import { AlertCircle } from 'lucide-react';
import { TimeRange } from '@/components/stocks/TimeRangeSelector';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stock, setStock] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictedData, setPredictedData] = useState<HistoricalData[] | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const celebrityHandle = "realDonaldTrump"; // default celebrity for prediction

  useEffect(() => {
    const fetchData = async () => {
      if (!symbol) return;
      
      setLoading(true);
      try {
        const stockData = await getStockDetails(symbol);
        if (!stockData) {
          navigate('/not-found');
          return;
        }
        
        setStock(stockData);
        
        const days = timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : 365;
        const historical = await getStockHistoricalData(symbol, days);
        setHistoricalData(historical);
        
        const predictions = await getPredictionsWithSocialSentiment(symbol, celebrityHandle, historical);
        setPredictedData(predictions);

      } catch (error) {
        console.error("Error fetching stock details or predictions:", error);
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

  return (
    <AppLayout>
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{stock.symbol}</h1>
            <p className="text-muted-foreground mt-1">{stock.name}</p>
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
            <StockHeader 
              stock={stock}
              timeRange={timeRange}
              onTimeRangeChange={setTimeRange}
              onBack={() => navigate(-1)}
            />

            <div className="finova-card p-6 mb-6">
              {historicalData.length > 0 ? (
                <StockChart 
                  data={historicalData} 
                  predictedData={predictedData || undefined}
                  color={stock.change >= 0 ? '#4ADE80' : '#F87171'} 
                />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-white/70">No chart data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="finova-card p-6 mb-6">
              <h2 className="text-xl font-bold text-foreground mb-4">AI Prediction</h2>
              {predictedData && predictedData.length > 0 ? (
                <PredictionInfo predictions={predictedData} symbol={symbol || ''} />
              ) : (
                <div className="text-white/70">No prediction data available.</div>
              )}
            </div>

            <StockStats stock={stock} />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default StockDetail;