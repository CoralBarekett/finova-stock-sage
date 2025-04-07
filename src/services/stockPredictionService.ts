import { predictStockPrices } from './predictionService';
import { evaluatePredictionAccuracy } from './evaluationService';
import { HistoricalData } from './stockService';

export const getPredictionsWithSilentEval = async (
  symbol: string,
  fullHistoricalData: HistoricalData[]
): Promise<HistoricalData[]> => {
  const predictionInput = fullHistoricalData.slice(-30); // get last 30 days
  const predictions = await predictStockPrices(symbol, predictionInput);

  // Run internal evaluation if enough historical data exists
  if (fullHistoricalData.length >= 60) {
    const backtestData = fullHistoricalData.slice(0, -7);
    evaluatePredictionAccuracy(symbol, backtestData); // console only
  }

  return predictions;
};