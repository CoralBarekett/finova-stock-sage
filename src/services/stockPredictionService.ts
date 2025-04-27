import { HistoricalData } from './stockService';

const PREDICT_API_URL = "http://localhost:8000/PredictStocks";

interface PredictionRequest {
  symbol: string;
  celebrity_handle: string;
  historical: { date: string; price: number }[];
}

/**
 * Calls the external API to get stock predictions with social sentiment.
 */
export const fetchPredictionsFromAPI = async (
  symbol: string,
  celebrityHandle: string,
  historicalData: HistoricalData[]
): Promise<HistoricalData[]> => {
  try {
    const requestBody: PredictionRequest = {
      symbol,
      celebrity_handle: celebrityHandle,
      historical: historicalData.map(d => ({
        date: d.date,
        price: d.price
      })),
    };

    const response = await fetch(PREDICT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Prediction API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data as HistoricalData[];
  } catch (error) {
    console.error('Error fetching predictions:', error);
    throw error;
  }
};