
import { HistoricalData } from './stockService';

const PREDICT_API_URL = "/predict";

interface PredictionRequest {
  ticker: string;
  timeframe?: string;
  include_posts?: boolean;
}

export interface SentimentAnalysis {
  sentiment: string;
  impact: string;
  confidence: string;
  key_factors: string[];
}

export interface PredictionResponse {
  ticker: string;
  prediction_time: string;
  timeframe: string;
  prediction: {
    direction: string;
    expected_impact: string;
    technical_trend: string;
    sentiment: string;
    reasoning?: string[];
    key_factors?: string[];
  };
  technical_signals: {
    trend: string;
    latest_price: number;
    price_change: number;
    price_change_percent: number;
  };
  sentiment_analysis: SentimentAnalysis | string;
  confidence: number;
  predicted_price?: number; // Added at the root level
  supporting_data: {
    post_count: number;
    influencer_post_count: number;
  };
}

/**
 * Calls the AI-powered prediction endpoint and returns a prediction response.
 */
export const fetchPrediction = async (
  symbol: string,
  timeframe: string = "1d"
): Promise<PredictionResponse> => {
  try {
    const requestBody: PredictionRequest = { 
      ticker: symbol,
      timeframe,
      include_posts: false
    };
    console.log("Sending AI prediction request:", requestBody);

    const response = await fetch(PREDICT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`Prediction API request failed with status ${response.status}`);
    }

    const predictionResponse = await response.json() as PredictionResponse;
    console.log("Received AI prediction:", predictionResponse);
    
    // If prediction response doesn't include a predicted price, calculate it
    if (!predictionResponse.predicted_price && predictionResponse.technical_signals.latest_price) {
      predictionResponse.predicted_price = calculatePredictedPrice(
        predictionResponse.technical_signals.latest_price, 
        predictionResponse
      );
    }
    
    return predictionResponse;
  } catch (error) {
    console.error('Error fetching AI prediction:', error);
    throw error;
  }
};

/**
 * Calculate predicted price based on current price and prediction direction.
 */
export const calculatePredictedPrice = (
  currentPrice: number, 
  prediction: PredictionResponse
): number => {
  // Extract the prediction direction and confidence
  const { direction } = prediction.prediction;
  const { confidence } = prediction;
  
  // Define multipliers based on prediction direction
  const directionMultipliers: {[key: string]: number} = {
    'strong_buy': 0.05,
    'buy': 0.02,
    'hold': 0.0,
    'sell': -0.02,
    'strong_sell': -0.05
  };
  
  // Get the base multiplier for the direction
  const baseMultiplier = directionMultipliers[direction] || 0;
  
  // Apply confidence to scale the effect
  const adjustedMultiplier = baseMultiplier * confidence;
  
  // Calculate the predicted price
  const predictedPrice = currentPrice * (1 + adjustedMultiplier);
  
  return Math.round(predictedPrice * 100) / 100; // Round to 2 decimal places
};

/**
 * Generates prediction data points for charts
 */
export const fetchPredictionsFromAPI = async (
  symbol: string,
  celebrityHandle: string,
  historicalData: HistoricalData[]
): Promise<HistoricalData[]> => {
  // This is a mockup function that would normally call the real API
  const lastPrice = historicalData[historicalData.length - 1]?.price || 0;
  
  try {
    // Call the prediction API
    const prediction = await fetchPrediction(symbol, "1d");
    
    // Use the predicted price from the API response or calculate it
    const predictedPrice = prediction.predicted_price || 
      calculatePredictedPrice(lastPrice, prediction);
    
    // Create the predicted data point
    const lastDate = new Date(historicalData[historicalData.length - 1].date);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 1);
    
    // Skip weekends
    while ([0, 6].includes(nextDate.getDay())) {
      nextDate.setDate(nextDate.getDate() + 1);
    }
    
    return [{
      date: nextDate.toISOString().split('T')[0],
      price: predictedPrice
    }];
  } catch (error) {
    console.error("Error in prediction API call:", error);
    return [];
  }
};
