
import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { HistoricalData, StockData } from '@/services/stockService';
import {
  getPopularStocks,
  getStockHistoricalData,
} from '@/services/stockService';
import { fetchPrediction, calculatePredictedPrice, PredictionResponse } from '@/services/stockPredictionService';
import TimeRangeSelector, { TimeRange } from '@/components/stocks/TimeRangeSelector';
import PredictionInfo from '@/components/stocks/PredictionInfo';
import StockChart from '@/components/charts/StockChart';
import { toast } from 'sonner';

const PredictionSimulator: React.FC = () => {
  const [symbols, setSymbols] = useState<StockData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);
  const [predictedData, setPredictedData] = useState<HistoricalData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');

  useEffect(() => {
    (async () => {
      try {
        const list = await getPopularStocks();
        setSymbols(list);
        if (list.length) setSelectedSymbol(list[0].symbol);
      } catch (err) {
        console.error('Error loading symbols', err);
        toast.error('Failed to load stock symbols');
      }
    })();
  }, []);

  useEffect(() => {
    if (selectedSymbol) {
      loadHistoricalData();
    }
  }, [selectedSymbol, timeRange]);

  const loadHistoricalData = async () => {
    try {
      setLoading(true);
      const days =
        timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : 365;
      const hist = await getStockHistoricalData(selectedSymbol, days);
      setHistoricalData(hist);
      setPredictionResponse(null);
      setPredictedData(null);
      setLoading(false);
    } catch (err) {
      console.error('Error loading historical data:', err);
      toast.error('Failed to load historical data');
      setLoading(false);
    }
  };

  const runPrediction = async () => {
    setLoading(true);
    try {
      if (historicalData.length === 0) {
        await loadHistoricalData();
      }

      // Convert timeRange to API format
      const apiTimeframe = timeRange === '1w' ? '1w' : timeRange === '1m' ? '1m' : '1d';
      
      // Get the prediction from our API
      const prediction = await fetchPrediction(selectedSymbol, apiTimeframe);
      setPredictionResponse(prediction);
      
      // Get the last known price
      const lastPrice = historicalData[historicalData.length - 1]?.price || 0;
      
      // Calculate predicted price based on prediction direction and confidence
      const calculatedPrice = prediction.predicted_price || calculatePredictedPrice(lastPrice, prediction);
      
      // Create a predicted data point for the next business day
      const lastDate = new Date(historicalData[historicalData.length - 1]?.date);
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + 1);
      
      // Skip weekends for prediction date
      while ([0, 6].includes(nextDate.getDay())) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      
      const predictedPoint: HistoricalData = {
        date: nextDate.toISOString().split('T')[0],
        price: calculatedPrice
      };
      
      setPredictedData([predictedPoint]);
      toast.success('Prediction generated successfully');
      
    } catch (err) {
      console.error('Prediction error:', err);
      toast.error('Failed to generate prediction');
    } finally {
      setLoading(false);
    }
  };

  // Calculate if prediction is bullish or bearish
  const isBullish = (): boolean => {
    if (!predictedData || !historicalData.length) return true;
    const lastHistoricalPrice = historicalData[historicalData.length - 1].price;
    const predictedPrice = predictedData[0].price;
    return predictedPrice >= lastHistoricalPrice;
  };

  // Calculate prediction difference
  const getPredictionDiff = (): { diff: number, diffPct: number } => {
    if (!predictedData || !historicalData.length) return { diff: 0, diffPct: 0 };
    
    const lastHistoricalPrice = historicalData[historicalData.length - 1].price;
    const predictedPrice = predictedData[0].price;
    const diff = predictedPrice - lastHistoricalPrice;
    const diffPct = (diff / lastHistoricalPrice) * 100;
    
    return { diff, diffPct };
  };

  const bullish = isBullish();
  const { diff, diffPct } = getPredictionDiff();

  return (
    <div className="finova-card p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center">
            Simulation: {selectedSymbol}
            <ArrowUpRight className="ml-2 w-5 h-5 text-primary" />
          </h2>
          <div className="mt-1 flex items-center">
            <select
              className="p-1 border rounded bg-background text-foreground text-sm"
              value={selectedSymbol}
              onChange={e => setSelectedSymbol(e.target.value)}
            >
              {symbols.map(s => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} - {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
          <TimeRangeSelector currentRange={timeRange} onRangeChange={setTimeRange} />

          {predictedData && predictedData.length > 0 && (
            <div className={`flex items-center text-sm font-medium ${bullish ? 'text-green-600' : 'text-red-600'}`}>
              {diff >= 0 ? '+' : ''}{diffPct.toFixed(2)}% ({predictedData[0].price.toFixed(2)} USD)
            </div>
          )}
        </div>
      </div>

      <div className="h-80 mb-4">
        {historicalData.length > 0 ? (
          <StockChart
            data={historicalData}
            predictedData={predictedData || undefined}
            color="#8E9196" // Neutral gray for historical data
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-center text-muted-foreground">
              Select a stock and time range to view data
            </p>
          </div>
        )}
      </div>

      {predictionResponse && (
        <div className="mt-4 px-2 py-3 bg-background/30 rounded-md">
          <h3 className="text-sm font-semibold mb-2 text-foreground">AI Prediction Analysis</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Sentiment:</span>{' '}
              <span className={`font-medium ${predictionResponse.prediction.sentiment === 'positive' || predictionResponse.prediction.sentiment === 'very positive' ? 'text-green-600' : predictionResponse.prediction.sentiment === 'negative' || predictionResponse.prediction.sentiment === 'very negative' ? 'text-red-600' : 'text-foreground'}`}>
                {predictionResponse.prediction.sentiment}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Direction:</span>{' '}
              <span className={`font-medium ${predictionResponse.prediction.direction.includes('buy') ? 'text-green-600' : predictionResponse.prediction.direction.includes('sell') ? 'text-red-600' : 'text-foreground'}`}>
                {predictionResponse.prediction.direction.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Confidence:</span>{' '}
              <span className="font-medium text-foreground">
                {Math.round(predictionResponse.confidence * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={runPrediction}
          disabled={loading}
          className="finova-button w-full flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white mr-2" />
              Predicting...
            </>
          ) : (
            <>Generate Prediction</>
          )}
        </button>
      </div>
    </div>
  );
};

export default PredictionSimulator;
