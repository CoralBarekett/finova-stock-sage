import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StockChart from '@/components/charts/StockChart';
import PredictionInfo from '@/components/stocks/PredictionInfo';
import StockHeader from '@/components/stocks/StockHeader';
import StockStats from '@/components/stocks/StockStats';
import { getStockDetails, getStockHistoricalData, StockData, HistoricalData } from '@/services/stockService';
import { fetchPrediction, calculatePredictedPrice, PredictionResponse } from '@/services/stockPredictionService';
import { AlertCircle } from 'lucide-react';
import { TimeRange } from '@/components/stocks/TimeRangeSelector';

const StockDetail: React.FC = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [stock, setStock] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictedData, setPredictedData] = useState<HistoricalData[] | null>(null);
  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [influencer, setInfluencer] = useState<string>('elonmusk');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        // Reset prediction data to ensure UI updates correctly
        setPredictedData(null);
        setPredictionResponse(null);

      } catch (error) {
        console.error("Error fetching stock details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, timeRange, navigate]);

  const generatePrediction = async () => {
    if (!symbol || !historicalData.length) return;
    
    setLoading(true);
    try {
      // Convert timeRange to API format
      const apiTimeframe = timeRange === '1w' ? '1w' : timeRange === '1m' ? '1m' : '1d';
      
      // Get the prediction from our API
      const prediction = await fetchPrediction(symbol, apiTimeframe);
      setPredictionResponse(prediction);
      
      // Get the last known price
      const lastPrice = historicalData[historicalData.length - 1]?.price || 0;
      
      // Use the predicted price from the API if available, otherwise calculate it
      let predictedPrice: number;
      if (prediction.predicted_price) {
        predictedPrice = prediction.predicted_price;
      } else {
        predictedPrice = calculatePredictedPrice(lastPrice, prediction);
      }
      
      // Create a predicted data point for the next business day
      const lastDate = new Date(historicalData[historicalData.length - 1]?.date || new Date());
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + 1);
      
      // Skip weekends for prediction date
      while ([0, 6].includes(nextDate.getDay())) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      
      const predictions: HistoricalData[] = [{
        date: nextDate.toISOString().split('T')[0],
        price: predictedPrice
      }];
      
      setPredictedData(predictions);
      
    } catch (error) {
      console.error("Error generating prediction:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !stock) {
    return (
      <div className="finova-card p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        <p className="mt-4 text-white/80">Loading stock data...</p>
      </div>
    );
  }

  if (!stock) {
    return (
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
    );
  }

  return (
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

      {/* Influencer selection */}
      <div className="mb-6">
        <label htmlFor="influencer-select" className="block text-sm font-semibold text-white mb-2">
          Choose Influencer:
        </label>
        <select
          id="influencer-select"
          value={influencer}
          onChange={(e) => setInfluencer(e.target.value)}
          className="block w-full p-2 rounded-lg border border-gray-300 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="jeromepowell">Jerome Powell</option>
          <option value="elonmusk">Elon Musk</option>
          <option value="jensenhuang">Jensen Huang</option>
          <option value="tim_cook">Tim Cook</option>
          <option value="sundarpichai">Sunder Pichai</option>
          <option value="zuck">Mark Zuckerberg</option>
          <option value="warrenbuffett">Warren Buffett</option>
          <option value="jimcramer">Jim Crammer</option>
        </select>
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
              <div>
                <PredictionInfo 
                  predictions={predictedData} 
                  symbol={symbol || ''} 
                  predictionDetails={predictionResponse}
                />
              </div>
            ) : (
              <div>
                <div className="text-white/70 mb-4">Generate a prediction based on AI analysis of social media and technical indicators.</div>
                <button 
                  className="finova-button w-full py-2"
                  onClick={generatePrediction}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    'Generate Prediction'
                  )}
                </button>
              </div>
            )}
          </div>

          <StockStats stock={stock} />
        </div>
      </div>
    </div>
  );
};

export default StockDetail;