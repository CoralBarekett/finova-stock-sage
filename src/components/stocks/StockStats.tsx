
import React from 'react';
import { Clock, TrendingUp, Activity, DollarSign } from 'lucide-react';
import StockStat from './StockStat';
import { StockData } from '@/services/stockService';

interface StockStatsProps {
  stock: StockData;
}

const StockStats: React.FC<StockStatsProps> = ({ stock }) => {
  return (
    <div className="finova-card p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Key Statistics</h2>
      <div className="space-y-4">
        <StockStat 
          icon={<DollarSign className="w-5 h-5 text-finova-primary" />}
          label="Market Cap"
          value={`$${(stock.marketCap / 1000000000).toFixed(2)}B`}
        />
        <StockStat 
          icon={<Activity className="w-5 h-5 text-finova-primary" />}
          label="Volume"
          value={`${(stock.volume / 1000000).toFixed(2)}M`}
        />
        <StockStat 
          icon={<TrendingUp className="w-5 h-5 text-finova-primary" />}
          label="P/E Ratio"
          value={stock.peRatio.toFixed(2)}
        />
        <StockStat 
          icon={<Clock className="w-5 h-5 text-finova-primary" />}
          label="Updated"
          value="Just now"
        />
      </div>
    </div>
  );
};

export default StockStats;
