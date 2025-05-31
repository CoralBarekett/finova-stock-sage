import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { 
  formatChartDate, 
  formatChartPrice, 
  getLineConfig, 
  getTooltipStyles, 
  getGridConfig, 
  getAxisConfig,
  calculateYAxisDomain,
  optimizeChartData,
  getLegendConfig,
  CHART_COLORS
} from '@/utils/chartUtils';
import type { ChartDataPoint } from '@/types/stockPrediction.types';

interface PredictionChartProps {
  isDark: boolean;
  chartData: ChartDataPoint[];
  showActual: boolean;
  showPredictions: boolean;
  height?: number;
}

const PredictionChart: React.FC<PredictionChartProps> = ({
  isDark,
  chartData,
  showActual,
  showPredictions,
  height = 400
}) => {
  // Optimize data for better performance
  const optimizedData = optimizeChartData(chartData);
  
  // Calculate Y-axis domain for better scaling
  const yAxisDomain = calculateYAxisDomain(optimizedData);
  
  // Get configuration based on theme
  const gridConfig = getGridConfig(isDark);
  const axisConfig = getAxisConfig(isDark);
  const legendConfig = getLegendConfig();
  
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    const data = payload[0].payload;
    const tooltipStyles = getTooltipStyles(isDark);
    
    return (
      <div style={tooltipStyles}>
        <div className="flex items-center space-x-2 mb-3">
          <div className={`w-2 h-2 rounded-full ${
            data.type === 'prediction' ? 'bg-purple-500' : 'bg-blue-500'
          }`}></div>
          <p className="font-semibold text-sm">
            {formatChartDate(label)}
          </p>
        </div>
        
        {data.actualPrice && (
          <div className="flex items-center justify-between space-x-4 mb-1">
            <span className="text-blue-500 font-medium text-sm">Historical:</span>
            <span className="font-bold">{formatChartPrice(data.actualPrice)}</span>
          </div>
        )}
        
        {data.predictedPrice && (
          <div className="flex items-center justify-between space-x-4">
            <span className="text-purple-500 font-medium text-sm">AI Prediction:</span>
            <span className="font-bold">{formatChartPrice(data.predictedPrice)}</span>
          </div>
        )}
        
        {data.type === 'prediction' && (
          <div className="mt-2 pt-2 border-t border-gray-600 dark:border-gray-300">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span className="text-xs font-medium opacity-75">AI Forecast</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Find the boundary between historical and prediction data
  const lastHistoricalIndex = optimizedData.findIndex(item => item.type === 'prediction') - 1;
  const boundaryDate = lastHistoricalIndex >= 0 ? optimizedData[lastHistoricalIndex]?.date : null;

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={optimizedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          {/* Grid */}
          <CartesianGrid {...gridConfig} />
          
          {/* X Axis */}
          <XAxis 
            dataKey="date" 
            {...axisConfig}
            tickFormatter={formatChartDate}
            interval="preserveStartEnd"
          />
          
          {/* Y Axis */}
          <YAxis 
            {...axisConfig}
            tickFormatter={formatChartPrice}
            domain={yAxisDomain}
          />
          
          {/* Tooltip */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* Legend */}
          <Legend {...legendConfig} />
          
          {/* Reference line to separate historical from prediction */}
          {boundaryDate && (
            <ReferenceLine 
              x={boundaryDate} 
              stroke={isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'} 
              strokeDasharray="5 5"
              strokeWidth={1}
            />
          )}
          
          {/* Historical data line */}
          {showActual && (
            <Line
              type="monotone"
              dataKey="actualPrice"
              {...getLineConfig('historical')}
              name="Historical Price"
              connectNulls={false}
              activeDot={{ 
                r: 6, 
                fill: CHART_COLORS.historical,
                stroke: '#fff',
                strokeWidth: 2
              }}
            />
          )}
          
          {/* Prediction data line */}
          {showPredictions && (
            <Line
              type="monotone"
              dataKey="predictedPrice"
              {...getLineConfig('prediction')}
              name="AI Prediction"
              connectNulls={false}
              activeDot={{ 
                r: 8, 
                fill: CHART_COLORS.prediction,
                stroke: '#fff',
                strokeWidth: 2
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      
      {/* Chart annotations */}
      <div className="flex items-center justify-center space-x-6 mt-4 text-xs">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-0.5 rounded ${
            isDark ? 'bg-white/30' : 'bg-gray-400'
          }`} style={{ 
            backgroundImage: 'repeating-linear-gradient(to right, currentColor 0, currentColor 2px, transparent 2px, transparent 4px)' 
          }}></div>
          <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Prediction Boundary
          </span>
        </div>
        
        {optimizedData.length !== chartData.length && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Data Optimized ({optimizedData.length}/{chartData.length} points)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionChart;