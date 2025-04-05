
import React from 'react';
import { HistoricalData } from '@/services/stockService';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PredictionInfoProps {
  predictions: HistoricalData[] | null;
  symbol: string;
}

const PredictionInfo: React.FC<PredictionInfoProps> = ({ predictions, symbol }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-white/70 text-sm">
        No prediction data available.
      </div>
    );
  }

  // Calculate if trend is bullish (price going up)
  const firstPrediction = predictions[0].price;
  const lastPrediction = predictions[predictions.length - 1].price;
  const isBullish = lastPrediction > firstPrediction;
  
  // Calculate percentage change
  const percentChange = ((lastPrediction - firstPrediction) / firstPrediction) * 100;
  
  // Get prediction for 7 days from now
  const sevenDayPrediction = predictions[predictions.length - 1];

  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <div 
          className={`p-2 rounded-full ${
            isBullish ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}
        >
          {isBullish ? 
            <TrendingUp className="w-5 h-5 text-green-400" /> : 
            <TrendingDown className="w-5 h-5 text-red-400" />
          }
        </div>
        <div className="ml-3">
          <div className="text-lg font-medium text-white">
            {isBullish ? 'Bullish Prediction' : 'Bearish Prediction'}
          </div>
          <div className="text-white/70 text-sm">
            {Math.abs(percentChange).toFixed(2)}% {isBullish ? 'increase' : 'decrease'} expected
          </div>
        </div>
      </div>
      
      <div className="text-white/80">
        Our prediction model suggests a potential {isBullish ? 'rise' : 'fall'} for {symbol} over the next 7 days,
        with an estimated price of ${sevenDayPrediction.price.toFixed(2)} by {new Date(sevenDayPrediction.date).toLocaleDateString()}.
      </div>
    </div>
  );
};

export default PredictionInfo;
