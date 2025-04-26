import { HistoricalData } from './stockService';

interface PredictionRequest {
  symbol: string;
  celebrity_handle: string;
  historical: HistoricalData[];
}

const PREDICT_API_URL = "http://localhost:8000/PredictStocks";

/**
 * Calls the external API to get stock predictions with social sentiment.
 */
export const getPredictionsWithSocialSentiment = async (
  symbol: string,
  celebrityHandle: string,
  fullHistoricalData: HistoricalData[]
): Promise<HistoricalData[]> => {
  try {
    const response = await fetch(PREDICT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        symbol,
        celebrity_handle: celebrityHandle,
        historical: fullHistoricalData,
      } as PredictionRequest),
    });

    if (!response.ok) {
      throw new Error(`Prediction API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as HistoricalData[];
  } catch (error) {
    console.error("Error fetching predictions:", error);
    throw error;
  }
};