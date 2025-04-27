
import { fetchPredictionsFromAPI } from './stockPredictionService';
import { HistoricalData } from './stockService';

/**
 * Evaluates the prediction accuracy by comparing predicted and actual stock prices.
 * Calculates the MAPE (Mean Absolute Percentage Error) over the prediction windows.
 */
export const evaluatePredictionAccuracy = async (
  symbol: string,
  fullHistoricalData: HistoricalData[],
  celebrityHandle: string = 'elonmusk', // Optional: specify a Twitter handle for sentiment analysis
  stepSize: number = 5
): Promise<void> => {
  const sortedData = [...fullHistoricalData].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const predictionWindow = 7;
  const windowSize = 30;
  const errors: number[] = [];

  console.log(`[Evaluation] Starting accuracy evaluation for ${symbol}...`);

  for (let i = 0; i < sortedData.length - (windowSize + predictionWindow); i += stepSize) {
    const inputSlice = sortedData.slice(i, i + windowSize);
    const actualSlice = sortedData.slice(i + windowSize, i + windowSize + predictionWindow);

    const predicted = await fetchPredictionsFromAPI(symbol, celebrityHandle, inputSlice);

    if (predicted.length !== actualSlice.length) continue;

    for (let j = 0; j < predicted.length; j++) {
      const actualPrice = actualSlice[j].price;
      const predictedPrice = predicted[j].price;
      const error = Math.abs((predictedPrice - actualPrice) / actualPrice);
      errors.push(error);

      const date = actualSlice[j].date;
      const errorPercent = (error * 100).toFixed(2);
      const logPrefix = parseFloat(errorPercent) > 10 ? '⚠️  ' : '✅';

      console.log(`${logPrefix} ${symbol} ${date} → Predicted: $${predictedPrice} | Actual: $${actualPrice} | Error: ${errorPercent}%`);
    }
  }

  const avgError = errors.reduce((sum, e) => sum + e, 0) / errors.length;
  const mape = (avgError * 100).toFixed(2);

  console.log(`[Evaluation] Final MAPE for ${symbol}: ${mape}%`);
};
