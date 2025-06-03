import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStockDetails, getStockHistoricalData } from '@/services/stockService';
import { fetchPrediction } from '@/services/stockPredictionService';
import type { 
  StockDetailState, 
  StockDetailActions,
  TimeRange 
} from '@/types/stockDetail.types';

export const useStockDetail = (symbol: string | undefined): StockDetailState & StockDetailActions => {
  const navigate = useNavigate();
  
  // Main state
  const [stock, setStock] = useState<StockDetailState['stock']>(null);
  const [historicalData, setHistoricalData] = useState<StockDetailState['historicalData']>([]);
  const [predictedData, setPredictedData] = useState<StockDetailState['predictedData']>(null);
  const [predictionResponse, setPredictionResponse] = useState<StockDetailState['predictionResponse']>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>('1m');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stock data and historical data
  const fetchData = useCallback(async () => {
    if (!symbol) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch stock details
      const stockData = await getStockDetails(symbol);
      if (!stockData) {
        setError('Stock not found');
        navigate('/not-found');
        return;
      }

      setStock(stockData);

      // Fetch historical data based on time range
      const days = timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : 365;
      const historical = await getStockHistoricalData(symbol, days);
      setHistoricalData(historical);

      // Reset prediction data when changing symbol or timeRange
      setPredictedData(null);
      setPredictionResponse(null);

    } catch (err) {
      console.error('Error fetching stock details:', err);
      setError(err instanceof Error ? err.message : 'Failed to load stock data');
    } finally {
      setLoading(false);
    }
  }, [symbol, timeRange, navigate]);

  // Refresh all data
  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Navigate to prediction/subscription
  const navigateToPrediction = useCallback(() => {
    // TODO: Check user subscription status
    const isSubscribed = false; // Replace with actual auth check
    
    if (!isSubscribed) {
      navigate('/subscription');
    } else {
      navigate(`/prediction-simulator?symbol=${symbol}`);
    }
  }, [symbol, navigate]);

  // Navigate back
  const navigateBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // Load prediction data (for premium users)
  const loadPredictionData = useCallback(async () => {
    if (!symbol || !stock) return;

    try {
      const prediction = await fetchPrediction(symbol, timeRange);
      setPredictionResponse(prediction);
      
      // TODO: Process prediction data into HistoricalData format
      // This would require converting the prediction response to chart data
      // setPredictedData(processedPredictionData);
      
    } catch (err) {
      console.error('Error loading prediction:', err);
    }
  }, [symbol, stock, timeRange]);

  // Load data when dependencies change
  useEffect(() => {
    if (symbol) {
      fetchData();
    }
  }, [fetchData]);

  // Load prediction data for premium users
  useEffect(() => {
    // TODO: Check if user is premium and load predictions
    // if (isPremiumUser && stock) {
    //   loadPredictionData();
    // }
  }, [stock, loadPredictionData]);

  return {
    // State
    stock,
    historicalData,
    predictedData,
    predictionResponse,
    timeRange,
    loading,
    error,

    // Actions
    setTimeRange,
    refreshData,
    navigateToPrediction,
    navigateBack,
  };
};