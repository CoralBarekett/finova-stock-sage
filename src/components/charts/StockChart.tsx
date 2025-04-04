
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface StockChartProps {
  data: Array<{
    date: string;
    price: number;
  }>;
  color?: string;
}

const StockChart: React.FC<StockChartProps> = ({ data, color = "#8B5CF6" }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="rgba(255, 255, 255, 0.6)"
            tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
          />
          <YAxis 
            stroke="rgba(255, 255, 255, 0.6)"
            tick={{ fill: 'rgba(255, 255, 255, 0.6)' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(26, 31, 44, 0.8)', 
              borderColor: 'rgba(255, 255, 255, 0.2)',
              color: '#fff'
            }} 
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: color, stroke: 'white', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
