import { 
  DollarSign, 
  BarChart3, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Eye,
  Star,
  Target,
  Zap,
  Brain,
  Award
} from 'lucide-react';
import type { 
  StockData, 
  StockMetric, 
  MarketInsight, 
  PredictionFeature 
} from '@/types/stockDetail.types';

/**
 * Calculate and format stock metrics for display
 */
export const calculateStockMetrics = (stock: StockData, isDark: boolean): StockMetric[] => {
  return [
    {
      label: 'Volume',
      value: `${(stock.volume / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      secondaryIcon: Eye,
      color: 'text-blue-500',
      bgColor: isDark 
        ? 'bg-gradient-to-br from-blue-900/30 to-blue-800/20' 
        : 'bg-gradient-to-br from-blue-50 to-blue-100',
      borderColor: isDark ? 'border-blue-800/50' : 'border-blue-200',
      description: 'Trading volume in millions'
    },
    {
      label: 'Market Cap',
      value: `$${(stock.marketCap / 1000000000).toFixed(1)}B`,
      icon: BarChart3,
      secondaryIcon: Star,
      color: 'text-purple-500',
      bgColor: isDark 
        ? 'bg-gradient-to-br from-purple-900/30 to-purple-800/20' 
        : 'bg-gradient-to-br from-purple-50 to-purple-100',
      borderColor: isDark ? 'border-purple-800/50' : 'border-purple-200',
      description: 'Total market capitalization'
    },
    {
      label: 'P/E Ratio',
      value: stock.peRatio.toFixed(1),
      icon: Activity,
      secondaryIcon: Target,
      color: 'text-orange-500',
      bgColor: isDark 
        ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/20' 
        : 'bg-gradient-to-br from-orange-50 to-orange-100',
      borderColor: isDark ? 'border-orange-800/50' : 'border-orange-200',
      description: 'Price-to-earnings ratio'
    },
    {
      label: "Today's Range",
      value: `$${(stock.price - Math.abs(stock.change)).toFixed(2)} - $${stock.price.toFixed(2)}`,
      icon: TrendingUp,
      secondaryIcon: Zap,
      color: 'text-emerald-500',
      bgColor: isDark 
        ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/20' 
        : 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      borderColor: isDark ? 'border-emerald-800/50' : 'border-emerald-200',
      description: 'Daily price range'
    }
  ];
};

/**
 * Generate market insights based on stock data
 */
export const generateMarketInsights = (stock: StockData): MarketInsight[] => {
  const isPositive = stock.change >= 0;
  const volumeAnalysis = stock.volume > 50000000;
  const valuationAnalysis = stock.peRatio <= 25;

  return [
    {
      title: 'Trading Volume',
      description: `Volume is ${volumeAnalysis ? 'above' : 'below'} average today, indicating ${volumeAnalysis ? 'strong' : 'moderate'} market interest.`,
      status: volumeAnalysis ? 'positive' : 'neutral',
      icon: Activity,
      badge: volumeAnalysis ? 'HIGH' : 'MODERATE',
      details: `${(stock.volume / 1000000).toFixed(1)}M shares traded`
    },
    {
      title: 'Price Momentum',
      description: `Stock is ${isPositive ? 'trending upward with positive momentum' : 'experiencing downward pressure'}.`,
      status: isPositive ? 'positive' : 'negative',
      icon: isPositive ? TrendingUp : TrendingDown,
      badge: isPositive ? 'BULLISH' : 'BEARISH',
      details: `${isPositive ? '+' : ''}${stock.changePercent.toFixed(2)}% today`
    },
    {
      title: 'Valuation',
      description: `P/E ratio suggests the stock is ${valuationAnalysis ? 'reasonably valued' : 'potentially overvalued'}.`,
      status: valuationAnalysis ? 'positive' : 'negative',
      icon: BarChart3,
      badge: valuationAnalysis ? 'FAIR' : 'HIGH',
      details: `P/E: ${stock.peRatio.toFixed(1)}`
    }
  ];
};

/**
 * Get prediction features for AI card
 */
export const getPredictionFeatures = (): PredictionFeature[] => [
  {
    icon: Brain,
    text: 'AI Sentiment Analysis',
    description: 'Social media and news sentiment analysis'
  },
  {
    icon: Target,
    text: 'Technical Indicators',
    description: 'Advanced technical analysis'
  },
  {
    icon: TrendingUp,
    text: 'Market Predictions',
    description: 'Future price movement forecasting'
  },
  {
    icon: Award,
    text: 'Confidence Scoring',
    description: 'AI confidence levels and reliability metrics'
  }
];

/**
 * Format stock status for display
 */
export const getStockStatus = (stock: StockData) => {
  const isPositive = stock.change >= 0;
  
  return {
    label: isPositive ? 'GAINING' : 'DECLINING',
    color: isPositive 
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };
};

/**
 * Format price change for display
 */
export const formatPriceChange = (stock: StockData) => {
  const isPositive = stock.change >= 0;
  
  return {
    value: `${isPositive ? '+' : ''}$${stock.change.toFixed(2)} (${isPositive ? '+' : ''}${stock.changePercent.toFixed(2)}%)`,
    color: isPositive ? 'text-emerald-500' : 'text-red-500',
    icon: isPositive ? TrendingUp : TrendingDown,
    bgColor: isPositive ? 'bg-emerald-500/20' : 'bg-red-500/20'
  };
};

/**
 * Get insight status styling
 */
export const getInsightStatusStyle = (status: MarketInsight['status'], isDark: boolean) => {
  switch (status) {
    case 'positive':
      return {
        badge: isDark 
          ? 'bg-emerald-900/30 text-emerald-400' 
          : 'bg-emerald-100 text-emerald-700',
        bg: isDark 
          ? 'bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-800/50' 
          : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
        icon: 'text-emerald-500'
      };
    case 'negative':
      return {
        badge: isDark 
          ? 'bg-red-900/30 text-red-400' 
          : 'bg-red-100 text-red-700',
        bg: isDark 
          ? 'bg-gradient-to-br from-red-900/30 to-red-800/20 border-red-800/50' 
          : 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
        icon: 'text-red-500'
      };
    default:
      return {
        badge: isDark 
          ? 'bg-orange-900/30 text-orange-400' 
          : 'bg-orange-100 text-orange-700',
        bg: isDark 
          ? 'bg-gradient-to-br from-orange-900/30 to-orange-800/20 border-orange-800/50' 
          : 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
        icon: 'text-orange-500'
      };
  }
};

/**
 * Calculate days for time range
 */
export const getTimeRangeDays = (timeRange: string): number => {
  switch (timeRange) {
    case '1w': return 7;
    case '1m': return 30;
    case '3m': return 90;
    case '1y': return 365;
    default: return 30;
  }
};