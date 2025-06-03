import { LucideIcon } from 'lucide-react';
import type { StockData, HistoricalData } from '@/services/stockService';
import type { PredictionResponse } from '@/services/stockPredictionService';
import type { TimeRange } from '@/components/stocks/TimeRangeSelector';

export interface StockDetailState {
  stock: StockData | null;
  historicalData: HistoricalData[];
  predictedData: HistoricalData[] | null;
  predictionResponse: PredictionResponse | null;
  timeRange: TimeRange;
  loading: boolean;
  error: string | null;
}

export interface StockDetailActions {
  setTimeRange: (range: TimeRange) => void;
  refreshData: () => Promise<void>;
  navigateToPrediction: () => void;
  navigateBack: () => void;
}

export interface StockMetric {
  label: string;
  value: string;
  icon: LucideIcon;
  secondaryIcon?: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  description?: string;
}

export interface MarketInsight {
  title: string;
  description: string;
  status: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  badge?: string;
  details?: string;
}

export interface PredictionFeature {
  icon: LucideIcon;
  text: string;
  description?: string;
}

export interface StockDetailHeaderProps {
  stock: StockData;
  isDark: boolean;
  onBack: () => void;
}

export interface StockMetricsGridProps {
  stock: StockData;
  isDark: boolean;
}

export interface StockChartSectionProps {
  stock: StockData;
  historicalData: HistoricalData[];
  predictedData?: HistoricalData[];
  timeRange: TimeRange;
  isDark: boolean;
  onTimeRangeChange: (range: TimeRange) => void;
  onBack: () => void;
}

export interface AIPredictionCardProps {
  stock: StockData;
  predictedData: HistoricalData[] | null;
  predictionResponse: PredictionResponse | null;
  isDark: boolean;
  onNavigateToPrediction: () => void;
}

export interface MarketInsightsCardProps {
  stock: StockData;
  isDark: boolean;
}

// Re-export types for convenience
export type { StockData, HistoricalData, PredictionResponse, TimeRange };