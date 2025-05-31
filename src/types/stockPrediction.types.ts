import { PredictionResponse } from '@/services/stockPredictionService';
import { HistoricalData, StockData } from '@/services/stockService';

// types/stockPrediction.types.ts
export interface ChartDataPoint {
  date: string;
  actualPrice: number | null;
  predictedPrice: number | null;
  type: 'historical' | 'prediction';
}

export interface PredictionStats {
  currentPrice: number;
  predictedPrice: number;
  change: number;
  changePercent: number;
  confidence: number;
  direction: string;
  sentiment: string;
  postsAnalyzed: number;
  influencerPosts: number;
  technicalTrend: string;
  priceChangePercent: number;
}

export type TimeframeType = '1d' | '1w' | '1m';

export interface StockPredictionState {
  availableStocks: StockData[];
  selectedSymbol: string;
  timeframe: TimeframeType;
  currentDate: Date;
  isLoading: boolean;
  error: string | null;
  historicalData: HistoricalData[];
  predictionData: PredictionResponse | null;
}

export interface StockPredictionActions {
  setSelectedSymbol: (symbol: string) => void;
  setTimeframe: (timeframe: TimeframeType) => void;
  generatePrediction: () => Promise<void>;
  navigateDate: (direction: 'prev' | 'next') => void;
  refreshData: () => Promise<void>;
}

// Re-export types from services
export type { StockData, HistoricalData } from '@/services/stockService';
export type { PredictionResponse } from '@/services/stockPredictionService';