
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/context/ThemeContext';

interface StockChartProps {
  data: Array<{
    date: string;
    price: number;
  }>;
  color?: string;
  predictedData?: Array<{
    date: string;
    price: number;
  }>;
}

const StockChart: React.FC<StockChartProps> = ({ 
  data,
  color = "#8E9196", // Changed to neutral gray as default
  predictedData
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Chart style variables for better contrast
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.15)";
  const axisColor = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.7)";
  const axisTickColor = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.7)";
  const tooltipBg = isDark ? 'rgba(26, 31, 44, 0.95)' : 'rgba(255, 255, 255, 0.95)';
  const tooltipBorderColor = isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  const tooltipTextColor = isDark ? '#fff' : '#333333';
  
  // Check if we have valid data
  const hasValidData = data && data.length > 0;
  
  // Create a processed data array that includes both historical and prediction data
  const processedData = hasValidData ? [...data] : [];
  
  // Create a separate array just for predictions
  let processedPredictions: any[] = [];
  
  // Determine if prediction is bullish or bearish
  let isPredictionBullish = false;
  
  if (predictedData && predictedData.length > 0 && hasValidData) {
    const lastHistoricalPrice = data[data.length - 1].price;
    const predictedPrice = predictedData[predictedData.length - 1].price;
    
    isPredictionBullish = predictedPrice >= lastHistoricalPrice;
    
    // Create prediction data points
    processedPredictions = predictedData.map(item => ({
      date: item.date,
      predictedPrice: item.price,
      formattedDate: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    }));
    
    // Add the last historical data point to connect the lines
    if (data.length > 0) {
      const lastDataPoint = data[data.length - 1];
      processedPredictions.unshift({
        date: lastDataPoint.date,
        predictedPrice: lastDataPoint.price,
        formattedDate: new Date(lastDataPoint.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        })
      });
    }
  }

  // Format dates for better display for historical data
  const formattedData = processedData.map(item => {
    // Ensure date is properly formatted for display
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });

    return {
      ...item,
      formattedDate
    };
  });

  // Combine all data for the chart
  const combinedData = [...formattedData, ...processedPredictions.slice(1)];

  // Calculate domain for y-axis to properly fit the data
  const calculateYDomain = () => {
    if (!hasValidData) return ['auto', 'auto'];
    
    const allPrices = [...formattedData.map(d => d.price)];
    if (processedPredictions.length > 0) {
      allPrices.push(...processedPredictions.map(d => d.predictedPrice));
    }
    
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    
    // Add 5% padding to the top and bottom
    const padding = (maxPrice - minPrice) * 0.05;
    return [Math.max(0, minPrice - padding), maxPrice + padding];
  };

  // Define prediction line color based on trend
  const predictionColor = isPredictionBullish ? "#4ADE80" : "#ea384c"; // Green for up, red for down

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={combinedData}
          margin={{
            top: 10,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={gridColor} 
          />
          <XAxis 
            dataKey="formattedDate" 
            stroke={axisColor}
            tick={{ fill: axisTickColor }}
            tickLine={{ stroke: axisColor }}
            axisLine={{ stroke: axisColor }}
            tickMargin={8}
            minTickGap={10}
          />
          <YAxis 
            stroke={axisColor}
            tick={{ fill: axisTickColor }}
            tickLine={{ stroke: axisColor }}
            axisLine={{ stroke: axisColor }}
            domain={calculateYDomain()}
            tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
            width={60}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              borderColor: tooltipBorderColor,
              color: tooltipTextColor,
              borderRadius: '4px',
              padding: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
            }} 
            formatter={(value: any, name: string) => {
              const formattedValue = `$${Number(value).toFixed(2)}`;
              const displayName = name === 'predictedPrice' ? 'Predicted Price' : 'Current Price';
              return [formattedValue, displayName];
            }}
            labelFormatter={(label) => `Date: ${label}`}
          />
          {/* Historical data line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={(props) => {
              // Only show dots for specific intervals to avoid overcrowding
              const index = props.index || 0;
              return index % 5 === 0 || index === 0 || index === (formattedData.length - 1) ? (
                <circle 
                  key={`dot-${index}`}
                  cx={props.cx} 
                  cy={props.cy} 
                  r={3} 
                  fill={color} 
                  stroke={isDark ? 'white' : '#333333'}
                  strokeWidth={1}
                />
              ) : null;
            }}
            activeDot={{ r: 6, fill: color, stroke: isDark ? 'white' : '#333333', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={1000}
            connectNulls={true}
            name="Current Price"
          />
          {/* Predicted data line */}
          {predictedData && predictedData.length > 0 && (
            <Line
              type="monotone"
              dataKey="predictedPrice"
              stroke={predictionColor}
              strokeWidth={2.5}
              strokeDasharray="5 5" // Dashed line for predictions
              dot={false}
              activeDot={{ r: 6, fill: predictionColor, stroke: isDark ? 'white' : '#333333', strokeWidth: 2 }}
              isAnimationActive={true}
              animationDuration={1000}
              connectNulls={true}
              name="Predicted Price"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
