import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import { HistoricalData, StockData } from '@/services/stockService';
import {
  getPopularStocks,
  getStockHistoricalData,
} from '@/services/stockService';
import { fetchPrediction, calculatePredictedPrice, PredictionResponse } from '@/services/stockPredictionService';
import { ArrowUpRight } from 'lucide-react';
import TimeRangeSelector, { TimeRange } from '@/components/stocks/TimeRangeSelector';
import PredictionInfo from '@/components/stocks/PredictionInfo';

const PredictionSimulator: React.FC = () => {
  const [symbols, setSymbols] = useState<StockData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictionResponse, setPredictionResponse] = useState<PredictionResponse | null>(null);
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
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
      const days =
        timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : 365;
      const hist = await getStockHistoricalData(selectedSymbol, days);
      setHistoricalData(hist);
      setPredictionResponse(null);
      setPredictedPrice(null);
    } catch (err) {
      console.error('Error loading historical data:', err);
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
      const calculatedPrice = calculatePredictedPrice(lastPrice, prediction);
      setPredictedPrice(calculatedPrice);
      
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = () => {
    const result: any[] = historicalData.map(d => ({
      date: d.date,
      historicalPrice: d.price,
      predictedPrice: null,
    }));

    if (predictedPrice !== null && result.length) {
      const lastDate = new Date(result[result.length - 1].date);
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + 1);
      while ([0, 6].includes(nextDate.getDay())) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
      result.push({
        date: nextDate.toISOString().split('T')[0],
        historicalPrice: null,
        predictedPrice,
      });
    }

    return result;
  };

  const chartData = prepareChartData();
  const lastHist = historicalData[historicalData.length - 1];
  const diff = lastHist && predictedPrice !== null ? predictedPrice - lastHist.price : 0;
  const diffPct = lastHist ? (diff / lastHist.price) * 100 : 0;
  const isBullish = diff >= 0;

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

          {lastHist && predictedPrice !== null && (
            <div className={`flex items-center text-sm font-medium ${isBullish ? 'text-green-600' : 'text-red-600'}`}>
              {diff >= 0 ? '+' : ''}{diffPct.toFixed(2)}% ({predictedPrice.toFixed(2)} USD)
            </div>
          )}
        </div>
      </div>

      <div className="h-80">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={date => {
                  const d = new Date(date);
                  return d.getDate() + '/' + (d.getMonth() + 1);
                }}
              />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip
                formatter={(value: any) => [`$${value}`, 'Price']}
                labelFormatter={label => new Date(label).toLocaleDateString()}
              />
              <Legend />
              {predictedPrice !== null && historicalData.length > 0 && (
                <ReferenceLine
                  x={historicalData[historicalData.length - 1].date}
                  stroke="#888"
                  strokeDasharray="3 3"
                  label={{ value: 'Today', position: 'top', fill: '#888' }}
                />
              )}

              <Line
                type="monotone"
                dataKey="historicalPrice"
                name="Historical"
                stroke="#4ADE80"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="predictedPrice"
                name="Forecast"
                stroke="#888888"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                activeDot={{ r: 6 }}
                isAnimationActive={true}
              />
            </LineChart>
          </ResponsiveContainer>
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
          <h3 className="text-sm font-semibold mb-2">AI Prediction Analysis</h3>
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
              <span className="font-medium">
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
            <>Predict</>
          )}
        </button>
      </div>
    </div>
  );
};

export default PredictionSimulator;