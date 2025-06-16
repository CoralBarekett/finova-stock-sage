import React from 'react';
import { HistoricalData } from '@/services/stockService';
import { PredictionResponse } from '@/services/stockPredictionService';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface PredictionInfoProps {
  predictions: HistoricalData[] | null;
  symbol: string;
  predictionDetails?: PredictionResponse | null;
}

const PredictionInfo: React.FC<PredictionInfoProps> = ({ predictions, symbol, predictionDetails }) => {
  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-white/70 text-sm">
        No prediction data available.
      </div>
    );
  }

  // Get the predicted price
  const predictedPrice = predictions[0].price;

  // Get the current price from prediction details or use a fallback
  const currentPrice = predictionDetails?.technical_signals?.latest_price || 0;

  // Calculate if trend is bullish (price going up)
  const isBullish = predictedPrice > currentPrice;

  // Calculate percentage change
  const percentChange = currentPrice > 0 ? ((predictedPrice - currentPrice) / currentPrice) * 100 : 0;

  // Get sentiment from prediction details
  const sentiment = predictionDetails?.prediction?.sentiment || (isBullish ? 'positive' : 'negative');
  const direction = predictionDetails?.prediction?.direction || (isBullish ? 'buy' : 'sell');

  // Format the prediction date
  const predictionDate = new Date(predictions[0].date).toLocaleDateString();

  // Get key factors if available
  const keyFactors = predictionDetails?.analysis?.social_sentiment?.key_factors || []


  return (
    <div className="space-y-3">
      <div className="flex items-center">
        <div
          className={`p-2 rounded-full ${isBullish ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
        >
          {isBullish ?
            <TrendingUp className="w-5 h-5 text-green-400" /> :
            <TrendingDown className="w-5 h-5 text-red-400" />
          }
        </div>
        <div className="ml-3">
          <div className="text-lg font-medium text-white">
            {direction && direction.includes('strong')
              ? (isBullish ? 'Strongly Bullish' : 'Strongly Bearish')
              : (isBullish ? 'Bullish Prediction' : 'Bearish Prediction')}
          </div>
          <div className="text-white/70 text-sm">
            {Math.abs(percentChange).toFixed(2)}% {isBullish ? 'increase' : 'decrease'} expected
          </div>
        </div>
      </div>

      <div className="text-white/80">
        Our AI model suggests a potential {isBullish ? 'rise' : 'fall'} for {symbol},
        with an estimated price of ${predictedPrice.toFixed(2)} by {predictionDate}.
        {predictionDetails?.analysis?.social_sentiment?.impact && (
          <div className="mt-2 text-sm">
            <span className="text-white/60">Expected impact: </span>
            {predictionDetails.analysis.social_sentiment.impact}
          </div>
        )}

      </div>

      {keyFactors.length > 0 && (
        <div className="mt-2 text-sm text-white/70">
          <span className="text-white/60">Key factors: </span>
          {keyFactors.slice(0, 2).join(', ')}
          {keyFactors.length > 2 ? '...' : ''}
        </div>
      )}

      {predictionDetails && (
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm mt-3 px-3 py-2 bg-background/30 rounded-md">
          <div>
            <span className="text-white/60">Sentiment:</span>{' '}
            <span className={sentiment && sentiment.includes('positive') ? 'text-green-400' : sentiment && sentiment.includes('negative') ? 'text-red-400' : 'text-white'}>
              {sentiment}
            </span>
          </div>
          <div>
            <span className="text-white/60">Confidence:</span>{' '}
            <span className="font-medium">
              {Math.round((predictionDetails.confidence || 0.5) * 100)}%
            </span>
          </div>
          {predictionDetails.technical_signals?.trend && (
            <div>
              <span className="text-white/60">Technical trend:</span>{' '}
              <span className={predictionDetails.technical_signals.trend === 'up' ? 'text-green-400' : predictionDetails.technical_signals.trend === 'down' ? 'text-red-400' : 'text-white'}>
                {predictionDetails.technical_signals.trend}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PredictionInfo;