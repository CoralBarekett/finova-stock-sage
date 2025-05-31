import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { 
  getStockHistoricalData, 
  getPopularStocks,
  type HistoricalData, 
  type StockData 
} from '@/services/stockService';
import { 
  fetchPrediction, 
  type PredictionResponse 
} from '@/services/stockPredictionService';
import type { 
  TimeframeType, 
  StockPredictionState, 
  StockPredictionActions 
} from '@/types/stockPrediction.types';

const TIMEFRAME_DAYS: Record<TimeframeType, number> = {
  '1d': 30,
  '1w': 60,
  '1m': 90
};

export const useStockPrediction = (): StockPredictionState & StockPredictionActions => {
  // Main state management
  const [availableStocks, setAvailableStocks] = useState<StockData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState('AAPL');
  const [timeframe, setTimeframe] = useState<TimeframeType>('1d');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);

  // Load available stocks on mount
  useEffect(() => {
    const loadStocks = async () => {
      try {
        const stocks = await getPopularStocks();
        setAvailableStocks(stocks);
        if (stocks.length > 0 && selectedSymbol === 'AAPL') {
          setSelectedSymbol(stocks[0].symbol);
        }
      } catch (err) {
        console.error('Error loading stocks:', err);
        toast.error('Failed to load available stocks');
        setError('Failed to load available stocks');
      }
    };
    loadStocks();
  }, []);

  // Fetch historical data when dependencies change
  const fetchHistoricalData = useCallback(async () => {
    if (!selectedSymbol) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const days = TIMEFRAME_DAYS[timeframe];
      console.log(`📊 Fetching ${days} days of historical data for ${selectedSymbol}`);
      
      const historical = await getStockHistoricalData(selectedSymbol, days);
      
      // Filter data based on current date
      const endDate = new Date(currentDate);
      const startDate = new Date(endDate);
      startDate.setDate(endDate.getDate() - days);
      
      const filteredData = historical.filter(item => {
        const itemDate = new Date(item.date);
        return itemDate >= startDate && itemDate <= endDate;
      });
      
      setHistoricalData(filteredData);
      console.log(`✅ Loaded ${filteredData.length} historical data points`);
      
    } catch (err) {
      console.error('❌ Error fetching historical data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to load historical data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSymbol, timeframe, currentDate]);

  // Generate AI prediction
  const generatePrediction = useCallback(async () => {
    if (!historicalData.length) {
      toast.error('No historical data available for prediction');
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🤖 Fetching AI prediction for ${selectedSymbol} (${timeframe})`);
      
      const prediction = await fetchPrediction(selectedSymbol, timeframe);
      setPredictionData(prediction);
      
      console.log('✅ Prediction received:', prediction);
      toast.success('AI prediction generated successfully!');
      
    } catch (err) {
      console.error('❌ Prediction failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate prediction';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSymbol, timeframe, historicalData.length]);

  // Navigate through dates
  const navigateDate = useCallback((direction: 'prev' | 'next') => {
    const days = Math.floor(TIMEFRAME_DAYS[timeframe] / 3);
    const newDate = new Date(currentDate);
    
    if (direction === 'prev') {
      newDate.setDate(currentDate.getDate() - days);
    } else {
      newDate.setDate(currentDate.getDate() + days);
    }
    
    setCurrentDate(newDate);
  }, [currentDate, timeframe]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await fetchHistoricalData();
    if (predictionData) {
      await generatePrediction();
    }
  }, [fetchHistoricalData, generatePrediction, predictionData]);

  // Fetch historical data when dependencies change
  useEffect(() => {
    if (selectedSymbol && availableStocks.length > 0) {
      fetchHistoricalData();
    }
  }, [selectedSymbol, timeframe, currentDate, fetchHistoricalData, availableStocks.length]);

  // Reset prediction when symbol or timeframe changes
  useEffect(() => {
    setPredictionData(null);
  }, [selectedSymbol, timeframe]);

  return {
    // State
    availableStocks,
    selectedSymbol,
    timeframe,
    currentDate,
    isLoading,
    error,
    historicalData,
    predictionData,
    
    // Actions
    setSelectedSymbol,
    setTimeframe,
    generatePrediction,
    navigateDate,
    refreshData,
  };
};