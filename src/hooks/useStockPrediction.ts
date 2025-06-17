/**
 * Custom hook for stock prediction functionality with FastAPI integration and debug logging
 */

import { useState, useEffect, useCallback } from 'react';
import { fetchPrediction, testPredictionConnection, PredictionResponse } from '@/services/stockPredictionService';
import { getPopularStocks, getStockHistoricalData, StockData, HistoricalData } from '@/services/stockService';
import type { TimeframeType } from '@/types/stockPrediction.types';

interface UseStockPredictionReturn {
  // State
  availableStocks: StockData[];
  selectedSymbol: string;
  timeframe: TimeframeType;
  currentDate: Date;
  isLoading: boolean;
  error: string | null;
  
  // Data
  historicalData: HistoricalData[];
  predictionData: PredictionResponse | null;
  
  // Actions
  setSelectedSymbol: (symbol: string) => void;
  setTimeframe: (timeframe: TimeframeType) => void;
  generatePrediction: () => Promise<void>;
  navigateDate: (direction: 'prev' | 'next') => void;
  refreshData: () => Promise<void>;
}

export const useStockPrediction = (): UseStockPredictionReturn => {
  console.log('[DEBUG] useStockPrediction: Initializing hook...');
  
  // State management
  const [availableStocks, setAvailableStocks] = useState<StockData[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [timeframe, setTimeframe] = useState<TimeframeType>('1d');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Prediction data
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);

  /**
   * Load available stocks on mount
   */
  useEffect(() => {
    console.log('[DEBUG] useStockPrediction: Loading available stocks...');
    loadAvailableStocks();
  }, []);

  /**
   * Test connection to FastAPI backend on mount
   */
  useEffect(() => {
    console.log('[DEBUG] useStockPrediction: Testing FastAPI prediction service connection...');
    testPredictionServiceConnection();
  }, []);

  /**
   * Load available stocks from your existing stock service
   */
  const loadAvailableStocks = async () => {
    const loadStartTime = Date.now();
    console.log('[DEBUG] useStockPrediction: Fetching available stocks from stock service...');
    
    try {
      const stocks = await getPopularStocks();
      setAvailableStocks(stocks);
      
      // Set first stock as default if none selected
      if (stocks.length > 0 && !selectedSymbol) {
        setSelectedSymbol(stocks[0].symbol);
        console.log(`[DEBUG] useStockPrediction: Set default symbol to ${stocks[0].symbol}`);
      }
      
      const loadTime = Date.now() - loadStartTime;
      console.log(`[DEBUG] useStockPrediction: Loaded ${stocks.length} stocks in ${loadTime}ms`);
    } catch (err) {
      const loadTime = Date.now() - loadStartTime;
      console.error(`[DEBUG] useStockPrediction: Failed to load available stocks in ${loadTime}ms:`, err);
      setError('Failed to load available stocks');
    }
  };

  /**
   * Test connection to FastAPI prediction service
   */
  const testPredictionServiceConnection = async () => {
    const testStartTime = Date.now();
    
    try {
      const isConnected = await testPredictionConnection();
      const testTime = Date.now() - testStartTime;
      
      if (!isConnected) {
        const errorMsg = 'Unable to connect to FastAPI prediction server. Please check if the server is running.';
        console.warn(`[DEBUG] useStockPrediction: ${errorMsg} (tested in ${testTime}ms)`);
        setError(errorMsg);
      } else {
        console.log(`[DEBUG] useStockPrediction: ✅ FastAPI prediction service connection successful in ${testTime}ms`);
        // Clear any previous connection errors
        if (error && error.includes('FastAPI')) {
          setError(null);
        }
      }
    } catch (err) {
      const testTime = Date.now() - testStartTime;
      console.error(`[DEBUG] useStockPrediction: ❌ FastAPI prediction service connection failed in ${testTime}ms:`, err);
      setError('FastAPI prediction service connection failed. Please ensure the server is running.');
    }
  };

  /**
   * Load historical data for the selected symbol
   */
  const loadHistoricalData = useCallback(async () => {
    if (!selectedSymbol) return;
    
    const loadStartTime = Date.now();
    console.log(`[DEBUG] useStockPrediction: Loading historical data for ${selectedSymbol}...`);
    
    try {
      const days = timeframe === '1d' ? 30 : timeframe === '1w' ? 60 : 90;
      const data = await getStockHistoricalData(selectedSymbol, days);
      setHistoricalData(data);
      
      const loadTime = Date.now() - loadStartTime;
      console.log(`[DEBUG] useStockPrediction: Historical data loaded in ${loadTime}ms: ${data.length} points`);
    } catch (err) {
      const loadTime = Date.now() - loadStartTime;
      console.error(`[DEBUG] useStockPrediction: Failed to load historical data in ${loadTime}ms:`, err);
      setError('Failed to load historical data');
    }
  }, [selectedSymbol, timeframe]);

  /**
   * Generate AI prediction using FastAPI
   */
  const generatePrediction = useCallback(async () => {
    if (!selectedSymbol) {
      console.warn('[DEBUG] useStockPrediction: No symbol selected for prediction');
      return;
    }

    console.log(`[DEBUG] useStockPrediction: === STARTING PREDICTION FOR ${selectedSymbol} ===`);
    const hookStartTime = Date.now();
    
    setIsLoading(true);
    setError(null);

    try {
      // Load historical data first if not available
      if (historicalData.length === 0) {
        console.log('[DEBUG] useStockPrediction: Loading historical data first...');
        await loadHistoricalData();
      }

      // Call FastAPI prediction endpoint
      console.log('[DEBUG] useStockPrediction: Calling FastAPI prediction service...');
      const prediction = await fetchPrediction(selectedSymbol, timeframe);
      
      // Store prediction data
      setPredictionData(prediction);
      
      const hookTotalTime = Date.now() - hookStartTime;
      console.log(`[DEBUG] useStockPrediction: === PREDICTION COMPLETED FOR ${selectedSymbol} ===`);
      console.log(`[DEBUG] useStockPrediction: Total hook processing time: ${hookTotalTime}ms`);
      console.log(`[DEBUG] useStockPrediction: Server processing time: ${prediction.processing_time || prediction.prediction_time_seconds || 'N/A'}s`);
      console.log(`[DEBUG] useStockPrediction: Posts analyzed: ${prediction.analysis?.posts_analyzed || prediction.data_sources?.total_posts || 0}`);
      console.log(`[DEBUG] useStockPrediction: Prediction direction: ${prediction.prediction?.direction}`);
      console.log(`[DEBUG] useStockPrediction: Sentiment: ${prediction.prediction?.sentiment}`);
      console.log(`[DEBUG] useStockPrediction: Confidence: ${prediction.prediction?.confidence}`);
      
    } catch (err: any) {
      const hookTotalTime = Date.now() - hookStartTime;
      console.error(`[DEBUG] useStockPrediction: === PREDICTION FAILED FOR ${selectedSymbol} AFTER ${hookTotalTime}ms ===`);
      console.error('[DEBUG] useStockPrediction: Error details:', err);
      
      setError(err.message || 'Failed to generate prediction');
      setPredictionData(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedSymbol, timeframe, historicalData.length, loadHistoricalData]);

  /**
   * Navigate between dates
   */
  const navigateDate = useCallback((direction: 'prev' | 'next') => {
    console.log(`[DEBUG] useStockPrediction: Navigating date ${direction}`);
    
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      const daysToMove = timeframe === '1d' ? 1 : timeframe === '1w' ? 7 : 30;
      
      if (direction === 'prev') {
        newDate.setDate(newDate.getDate() - daysToMove);
      } else {
        newDate.setDate(newDate.getDate() + daysToMove);
      }
      
      console.log(`[DEBUG] useStockPrediction: Date navigated to: ${newDate.toISOString().split('T')[0]}`);
      return newDate;
    });
  }, [timeframe]);

  /**
   * Refresh all data
   */
  const refreshData = useCallback(async () => {
    console.log('[DEBUG] useStockPrediction: Refreshing all data...');
    const refreshStartTime = Date.now();
    
    setError(null);
    
    try {
      // Test connection first
      await testPredictionServiceConnection();
      
      // Reload stocks
      await loadAvailableStocks();
      
      // Reload historical data
      await loadHistoricalData();
      
      // Generate new prediction if we have a selected symbol
      if (selectedSymbol) {
        await generatePrediction();
      }
      
      const refreshTime = Date.now() - refreshStartTime;
      console.log(`[DEBUG] useStockPrediction: Data refresh completed in ${refreshTime}ms`);
      
    } catch (err) {
      const refreshTime = Date.now() - refreshStartTime;
      console.error(`[DEBUG] useStockPrediction: Data refresh failed in ${refreshTime}ms:`, err);
      setError('Failed to refresh data');
    }
  }, [selectedSymbol, loadHistoricalData, generatePrediction]);

  // Load historical data when symbol or timeframe changes
  useEffect(() => {
    if (selectedSymbol && availableStocks.length > 0) {
      console.log(`[DEBUG] useStockPrediction: Symbol or timeframe changed, loading historical data...`);
      loadHistoricalData();
    }
  }, [selectedSymbol, timeframe, availableStocks.length, loadHistoricalData]);

  return {
    // State
    availableStocks,
    selectedSymbol,
    timeframe,
    currentDate,
    isLoading,
    error,
    
    // Data
    historicalData,
    predictionData,
    
    // Actions
    setSelectedSymbol,
    setTimeframe,
    generatePrediction,
    navigateDate,
    refreshData
  };
};