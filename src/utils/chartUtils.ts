// utils/chartUtils.ts
import type { ChartDataPoint } from '@/types/stockPrediction.types';

/**
 * Chart configuration and styling utilities
 */

export const CHART_COLORS = {
  historical: '#3B82F6',     // Blue
  prediction: '#8B5CF6',     // Purple
  positive: '#10B981',       // Green
  negative: '#EF4444',       // Red
  grid: {
    light: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(255, 255, 255, 0.1)'
  },
  axis: {
    light: 'rgba(0, 0, 0, 0.6)',
    dark: 'rgba(255, 255, 255, 0.6)'
  }
};

/**
 * Get responsive chart margins based on screen size
 */
export const getChartMargins = () => ({
  top: 20,
  right: 30,
  left: 20,
  bottom: 20
});

/**
 * Format date for chart X-axis display
 */
export const formatChartDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

/**
 * Format price for chart Y-axis display
 */
export const formatChartPrice = (value: number): string => {
  return `$${value.toFixed(0)}`;
};

/**
 * Calculate Y-axis domain with padding
 */
export const calculateYAxisDomain = (data: ChartDataPoint[]): [string, string] => {
  if (!data.length) return ['dataMin - 5', 'dataMax + 5'];
  
  const prices = data
    .map(d => [d.actualPrice, d.predictedPrice])
    .flat()
    .filter((price): price is number => price !== null);
  
  if (!prices.length) return ['dataMin - 5', 'dataMax + 5'];
  
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const padding = (max - min) * 0.1; // 10% padding
  
  return [
    `${Math.max(0, min - padding)}`,
    `${max + padding}`
  ];
};

/**
 * Generate chart gradient definitions for enhanced visuals
 */
export const generateChartGradients = () => [
  {
    id: 'historicalGradient',
    colors: [
      { offset: '0%', color: '#3B82F6', opacity: 0.8 },
      { offset: '100%', color: '#1D4ED8', opacity: 0.6 }
    ]
  },
  {
    id: 'predictionGradient',
    colors: [
      { offset: '0%', color: '#8B5CF6', opacity: 0.8 },
      { offset: '100%', color: '#7C3AED', opacity: 0.6 }
    ]
  }
];

/**
 * Get chart line configuration for different data types
 */
export const getLineConfig = (type: 'historical' | 'prediction') => {
  const baseConfig = {
    strokeWidth: 3,
    dot: { strokeWidth: 2, r: 4 },
    connectNulls: false
  };
  
  if (type === 'historical') {
    return {
      ...baseConfig,
      stroke: CHART_COLORS.historical,
      dot: { ...baseConfig.dot, fill: CHART_COLORS.historical }
    };
  } else {
    return {
      ...baseConfig,
      stroke: CHART_COLORS.prediction,
      strokeDasharray: '8 4',
      strokeWidth: 4,
      dot: { ...baseConfig.dot, fill: CHART_COLORS.prediction, r: 6 }
    };
  }
};

/**
 * Custom tooltip styles based on theme
 */
export const getTooltipStyles = (isDark: boolean) => ({
  backgroundColor: isDark ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
  borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
  color: isDark ? '#ffffff' : '#111827',
  borderRadius: '12px',
  padding: '12px',
  boxShadow: isDark 
    ? '0 10px 25px rgba(0, 0, 0, 0.3)' 
    : '0 10px 25px rgba(0, 0, 0, 0.1)',
  border: '1px solid',
  fontSize: '14px'
});

/**
 * Chart grid configuration based on theme
 */
export const getGridConfig = (isDark: boolean) => ({
  strokeDasharray: '3 3',
  stroke: isDark ? CHART_COLORS.grid.dark : CHART_COLORS.grid.light
});

/**
 * Chart axis configuration based on theme
 */
export const getAxisConfig = (isDark: boolean) => ({
  tick: { 
    fontSize: 12, 
    fill: isDark ? CHART_COLORS.axis.dark : CHART_COLORS.axis.light 
  },
  tickLine: { 
    stroke: isDark ? CHART_COLORS.axis.dark : CHART_COLORS.axis.light 
  },
  axisLine: { 
    stroke: isDark ? CHART_COLORS.axis.dark : CHART_COLORS.axis.light 
  }
});

/**
 * Filter chart data for better performance on large datasets
 */
export const optimizeChartData = (
  data: ChartDataPoint[], 
  maxPoints: number = 100
): ChartDataPoint[] => {
  if (data.length <= maxPoints) return data;
  
  const step = Math.ceil(data.length / maxPoints);
  const optimized: ChartDataPoint[] = [];
  
  for (let i = 0; i < data.length; i += step) {
    optimized.push(data[i]);
  }
  
  // Always include the last point
  if (optimized[optimized.length - 1] !== data[data.length - 1]) {
    optimized.push(data[data.length - 1]);
  }
  
  return optimized;
};

/**
 * Generate chart legend configuration
 */
export const getLegendConfig = () => ({
  wrapperStyle: {
    paddingTop: '20px',
    fontSize: '14px',
    fontWeight: '500'
  },
  iconType: 'line' as const
});