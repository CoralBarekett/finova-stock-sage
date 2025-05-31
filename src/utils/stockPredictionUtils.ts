// utils/stockPredictionUtils.ts
import { calculatePredictedPrice } from '@/services/stockPredictionService';
import type { HistoricalData } from '@/services/stockService';
import type { PredictionResponse } from '@/services/stockPredictionService';
import type { 
  ChartDataPoint, 
  PredictionStats, 
  TimeframeType 
} from '@/types/stockPrediction.types';

/**
 * Prepare chart data by combining historical and prediction data
 */
export const prepareChartData = (
  historicalData: HistoricalData[],
  predictionData: PredictionResponse | null,
  timeframe: TimeframeType
): ChartDataPoint[] => {
  const combined: ChartDataPoint[] = [];
  
  // Add historical data points
  historicalData.forEach(item => {
    combined.push({
      date: item.date,
      actualPrice: item.price,
      predictedPrice: null,
      type: 'historical'
    });
  });
  
  // Add prediction point if available
  if (predictionData && historicalData.length > 0) {
    const lastHistoricalDate = historicalData[historicalData.length - 1]?.date;
    
    if (lastHistoricalDate) {
      const predictionDate = new Date(lastHistoricalDate);
      
      // Calculate prediction date based on timeframe
      switch (timeframe) {
        case '1d':
          predictionDate.setDate(predictionDate.getDate() + 1);
          break;
        case '1w':
          predictionDate.setDate(predictionDate.getDate() + 7);
          break;
        case '1m':
          predictionDate.setDate(predictionDate.getDate() + 30);
          break;
      }
      
      // Skip weekends for more realistic display
      while ([0, 6].includes(predictionDate.getDay())) {
        predictionDate.setDate(predictionDate.getDate() + 1);
      }
      
      const lastPrice = historicalData[historicalData.length - 1].price;
      const predictedPrice = predictionData.predicted_price || 
                           calculatePredictedPrice(lastPrice, predictionData);
      
      combined.push({
        date: predictionDate.toISOString().split('T')[0],
        actualPrice: null,
        predictedPrice: predictedPrice,
        type: 'prediction'
      });
    }
  }
  
  // Sort by date to ensure proper chronological order
  return combined.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

/**
 * Calculate comprehensive statistics from historical and prediction data
 */
export const calculateStats = (
  historicalData: HistoricalData[],
  predictionData: PredictionResponse | null
): PredictionStats | null => {
  if (!historicalData.length) return null;
  
  const currentPrice = historicalData[historicalData.length - 1]?.price || 0;
  let predictedPrice = currentPrice;
  let change = 0;
  let changePercent = 0;
  
  if (predictionData) {
    predictedPrice = predictionData.predicted_price || 
                   calculatePredictedPrice(currentPrice, predictionData);
    change = predictedPrice - currentPrice;
    changePercent = currentPrice > 0 ? ((change / currentPrice) * 100) : 0;
  }
  
  return {
    currentPrice,
    predictedPrice,
    change,
    changePercent,
    confidence: predictionData?.confidence || 0,
    direction: predictionData?.prediction?.direction || 'hold',
    sentiment: predictionData?.prediction?.sentiment || 'neutral',
    postsAnalyzed: predictionData?.supporting_data?.post_count || 0,
    influencerPosts: predictionData?.supporting_data?.influencer_post_count || 0,
    technicalTrend: predictionData?.technical_signals?.trend || 'neutral',
    priceChangePercent: predictionData?.technical_signals?.price_change_percent || 0
  };
};

/**
 * Format currency values for display
 */
export const formatCurrency = (value: number, decimals: number = 2): string => {
  return `$${value.toFixed(decimals)}`;
};

/**
 * Format percentage values for display
 */
export const formatPercentage = (value: number, decimals: number = 2): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Get color based on value (green for positive, red for negative)
 */
export const getChangeColor = (value: number): string => {
  return value >= 0 ? 'text-green-500' : 'text-red-500';
};

/**
 * Get trend icon name based on direction
 */
export const getTrendIcon = (direction: string): 'trending-up' | 'trending-down' | 'minus' => {
  switch (direction.toLowerCase()) {
    case 'up':
    case 'bullish':
      return 'trending-up';
    case 'down':
    case 'bearish':
      return 'trending-down';
    default:
      return 'minus';
  }
};

/**
 * Calculate date range for historical data display
 */
export const calculateDateRange = (currentDate: Date, timeframe: TimeframeType) => {
  const days = timeframe === '1d' ? 30 : timeframe === '1w' ? 60 : 90;
  const endDate = new Date(currentDate);
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - days);
  
  return { startDate, endDate, days };
};

/**
 * Validate if prediction data is complete and reliable
 */
export const validatePredictionData = (predictionData: PredictionResponse | null): boolean => {
  if (!predictionData) return false;
  
  return !!(
    predictionData.confidence &&
    predictionData.confidence > 0.3 && // Minimum confidence threshold
    (predictionData.predicted_price || predictionData.prediction)
  );
};