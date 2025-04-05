
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
  color = "#8B5CF6",
  predictedData
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Check if we have valid data
  const hasValidData = data && data.length > 0;
  
  // Combine historical and predicted data if available
  const combinedData = hasValidData ? [...data] : [];
  
  if (predictedData && predictedData.length > 0) {
    combinedData.push(...predictedData);
  }

  // Format dates for better display
  const formattedData = combinedData.map(item => {
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

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"} 
          />
          <XAxis 
            dataKey="formattedDate" 
            stroke={isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"}
            tick={{ fill: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
          />
          <YAxis 
            stroke={isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"}
            tick={{ fill: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }}
            domain={['auto', 'auto']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDark ? 'rgba(26, 31, 44, 0.8)' : 'rgba(255, 255, 255, 0.9)', 
              borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
              color: isDark ? '#fff' : '#000'
            }} 
            formatter={(value: any) => [`$${value}`, 'Price']}
          />
          {/* Historical data line */}
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: color, stroke: isDark ? 'white' : 'black', strokeWidth: 2 }}
            isAnimationActive={true}
            animationDuration={1000}
          />
          {/* Predicted data line (if available) */}
          {predictedData && predictedData.length > 0 && (
            <Line
              type="monotone"
              dataKey="predictedPrice"
              stroke="#10B981" // Green color for predictions
              strokeWidth={2}
              strokeDasharray="5 5" // Dashed line for predictions
              dot={false}
              activeDot={{ r: 6, fill: "#10B981", stroke: isDark ? 'white' : 'black', strokeWidth: 2 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
