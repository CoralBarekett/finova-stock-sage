import { HistoricalData } from './stockService';

// Use your existing environment variable for the FastAPI server
const PREDICT_API_URL = import.meta.env.VITE_PREDICT_API_URL || 'http://localhost:8787/predict';

// Timeout for prediction requests (8 minutes)
const PREDICTION_TIMEOUT = 8 * 60 * 1000; // 8 minutes in milliseconds

interface PredictionRequest {
  ticker: string;
  timeframe?: string;
  include_reddit?: boolean;
  include_posts?: boolean;
}

export interface SentimentAnalysis {
  sentiment: string;
  impact: string;
  confidence: string;
  key_factors: string[];
  patterns: string[];
  reasoning: string;
}

export interface PredictionResponse {
  ticker: string;
  timestamp: string;
  prediction_time_seconds?: number;
  processing_time?: number;
  timeframe?: string;
  status?: string;
  prediction: {
    direction: string;
    sentiment: string;
    confidence: number;
    price_target?: number;
    reasoning?: string;
  };
  analysis: {
    technical_analysis?: any;
    social_sentiment?: SentimentAnalysis;
    posts_analyzed: number;
    error?: string;
  };
  data_sources?: {
    total_posts: number;
    influencer_posts: number;
    platforms: string[];
    time_range_days: number;
  };
  posts_sample?: any[];
  performance_metrics?: {
    posts_fetch_time: number;
    ai_analysis_time: number;
    influencer_fetch_time: number;
    total_time: number;
  };
  // Legacy fields for compatibility - NOW OPTIONAL
  technical_signals?: {
    trend: string;
    latest_price: number;
    price_change: number;
    price_change_percent: number;
  };
  sentiment_analysis?: SentimentAnalysis | string;
  predicted_price?: number;
  supporting_data?: {
    post_count: number;
    influencer_post_count: number;
  };
  confidence?: number;
}

/**
 * Create a timeout promise for request cancellation
 */
const createTimeoutPromise = (timeoutMs: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout after ${timeoutMs / 1000} seconds`));
    }, timeoutMs);
  });
};

/**
 * Calls the FastAPI prediction endpoint with debug logging and timeout protection
 */
export const fetchPrediction = async (
  symbol: string,
  timeframe: string = "1d"
): Promise<PredictionResponse> => {
  console.log(`[DEBUG] === STARTING PREDICTION REQUEST FOR ${symbol.toUpperCase()} ===`);
  const requestStartTime = Date.now();

  try {
    const requestBody: PredictionRequest = {
      ticker: symbol.toUpperCase(),
      timeframe,
      include_reddit: true,
      include_posts: true // Keep posts enabled as requested
    };

    console.log("[DEBUG] Prediction request parameters:", requestBody);
    console.log("[DEBUG] API URL:", PREDICT_API_URL);
    console.log(`[DEBUG] Request timeout set to: 180 seconds`);

    // Create fetch promise with timeout
    const fetchPromise = fetch(PREDICT_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody),
    });

    // Race between fetch and timeout
    const response = await Promise.race([
      fetchPromise,
      createTimeoutPromise(PREDICTION_TIMEOUT)
    ]);

    const requestTime = Date.now() - requestStartTime;

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }

      console.error(`[DEBUG] Prediction request failed in ${requestTime}ms:`, {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });

      // If it's a server error (500), try to extract useful info
      if (response.status === 500) {
        // Return a fallback response instead of throwing
        const fallbackResponse: PredictionResponse = {
          ticker: symbol.toUpperCase(),
          timestamp: new Date().toISOString(),
          processing_time: requestTime / 1000,
          status: 'error',
          prediction: {
            direction: 'neutral',
            sentiment: 'neutral',
            confidence: 0.1,
            reasoning: 'Server error occurred during prediction'
          },
          analysis: {
            posts_analyzed: 0,
            error: `Server error: ${response.status}`
          }
        };

        console.log("[DEBUG] Returning fallback response due to server error");
        return mapToCompatibleFormat(fallbackResponse);
      }

      throw new Error(`Prediction API request failed: ${response.status} ${response.statusText}`);
    }

    const predictionResponse = await response.json() as PredictionResponse;

    console.log(`[DEBUG] === PREDICTION COMPLETED FOR ${symbol.toUpperCase()} ===`);
    console.log(`[DEBUG] Client request time: ${requestTime}ms`);
    console.log(`[DEBUG] Server processing time: ${predictionResponse.processing_time || predictionResponse.prediction_time_seconds || 'N/A'}s`);
    console.log(`[DEBUG] Posts analyzed: ${predictionResponse.analysis?.posts_analyzed || predictionResponse.data_sources?.total_posts || 0}`);
    console.log(`[DEBUG] Sentiment: ${predictionResponse.prediction?.sentiment}`);
    console.log(`[DEBUG] Direction: ${predictionResponse.prediction?.direction}`);
    console.log(`[DEBUG] Confidence: ${predictionResponse.prediction?.confidence}`);
    console.log(`[DEBUG] Status: ${predictionResponse.status || 'success'}`);

    if (predictionResponse.performance_metrics) {
      console.log(`[DEBUG] Performance breakdown:`, predictionResponse.performance_metrics);
    }

    if (predictionResponse.analysis?.error) {
      console.warn(`[DEBUG] Analysis warning:`, predictionResponse.analysis.error);
    }

    // Ensure compatibility with existing code by mapping new response format to old format
    const compatibleResponse = mapToCompatibleFormat(predictionResponse);

    console.log("[DEBUG] Mapped response for compatibility:", compatibleResponse);

    return compatibleResponse;
  } catch (error) {
    const requestTime = Date.now() - requestStartTime;
    console.error(`[DEBUG] === PREDICTION FAILED FOR ${symbol.toUpperCase()} AFTER ${requestTime}ms ===`);
    console.error('[DEBUG] Error details:', error);

    // Check if it's a timeout error
    if (error instanceof Error && error.message.includes('timeout')) {
      // Return a timeout fallback response
      const timeoutResponse: PredictionResponse = {
        ticker: symbol.toUpperCase(),
        timestamp: new Date().toISOString(),
        processing_time: requestTime / 1000,
        status: 'timeout',
        prediction: {
          direction: 'neutral',
          sentiment: 'neutral',
          confidence: 0.1,
          reasoning: 'Request timed out after 3 minutes - server may be overloaded'
        },
        analysis: {
          posts_analyzed: 0,
          error: 'Request timeout'
        }
      };

      console.log("[DEBUG] Returning timeout fallback response");
      return mapToCompatibleFormat(timeoutResponse);
    }

    throw error;
  }
};

/**
 * Map FastAPI response to the expected format for existing components
 */
const mapToCompatibleFormat = (response: PredictionResponse): PredictionResponse => {
  // Map new format to legacy format for compatibility
  const mapped: PredictionResponse = {
    ...response,
    // Ensure legacy fields are populated
    technical_signals: response.technical_signals || {
      trend: response.prediction?.direction || 'neutral',
      latest_price: response.prediction?.price_target || 0,
      price_change: 0,
      price_change_percent: 0
    },
    sentiment_analysis: response.analysis?.social_sentiment || response.sentiment_analysis || 'neutral',
    predicted_price: response.prediction?.price_target || response.predicted_price,
    supporting_data: response.supporting_data || {
      post_count: response.analysis?.posts_analyzed || response.data_sources?.total_posts || 0,
      influencer_post_count: response.data_sources?.influencer_posts || 0
    },
    confidence: response.prediction?.confidence || response.confidence || 0.1
  };

  return mapped;
};

/**
 * Calculate predicted price based on current price and prediction direction.
 */
export const calculatePredictedPrice = (
  currentPrice: number,
  prediction: PredictionResponse
): number => {
  console.log(`[DEBUG] Calculating predicted price from current: $${currentPrice}`);

  // If we already have a predicted price, use it
  if (prediction.predicted_price) {
    console.log(`[DEBUG] Using provided predicted price: $${prediction.predicted_price}`);
    return prediction.predicted_price;
  }

  if (prediction.prediction?.price_target) {
    console.log(`[DEBUG] Using price target: $${prediction.prediction.price_target}`);
    return prediction.prediction.price_target;
  }

  // Extract the prediction direction and confidence
  const direction = prediction.prediction?.direction || 'hold';
  const confidence = prediction.prediction?.confidence || prediction.confidence || 0.5;

  console.log(`[DEBUG] Direction: ${direction}, Confidence: ${confidence}`);

  // Define multipliers based on prediction direction
  const directionMultipliers: { [key: string]: number } = {
    'up': 0.03,
    'down': -0.03,
    'strong_buy': 0.05,
    'buy': 0.02,
    'hold': 0.0,
    'sell': -0.02,
    'strong_sell': -0.05,
    'bullish': 0.03,
    'bearish': -0.03,
    'neutral': 0.0
  };

  // Get the base multiplier for the direction
  const baseMultiplier = directionMultipliers[direction.toLowerCase()] || 0;

  // Apply confidence to scale the effect
  const adjustedMultiplier = baseMultiplier * confidence;

  console.log(`[DEBUG] Base multiplier: ${baseMultiplier}, Adjusted: ${adjustedMultiplier}`);

  // Calculate the predicted price
  const predictedPrice = currentPrice * (1 + adjustedMultiplier);
  const finalPrice = Math.round(predictedPrice * 100) / 100; // Round to 2 decimal places

  console.log(`[DEBUG] Calculated predicted price: $${finalPrice}`);
  return finalPrice;
};

/**
 * Generates prediction data points for charts
 */
export const fetchPredictionsFromAPI = async (
  symbol: string,
  celebrityHandle: string,
  historicalData: HistoricalData[]
): Promise<HistoricalData[]> => {
  console.log(`[DEBUG] Fetching prediction data points for ${symbol}`);

  // This is a mockup function that would normally call the real API
  const lastPrice = historicalData[historicalData.length - 1]?.price || 0;

  try {
    // Call the prediction API
    const prediction = await fetchPrediction(symbol, "1d");

    // Use the predicted price from the API response or calculate it
    const predictedPrice = prediction.predicted_price ||
      calculatePredictedPrice(lastPrice, prediction);

    console.log(`[DEBUG] Using predicted price for chart: $${predictedPrice}`);

    // Create the predicted data point
    const lastDate = new Date(historicalData[historicalData.length - 1].date);
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + 1);

    // Skip weekends
    while ([0, 6].includes(nextDate.getDay())) {
      nextDate.setDate(nextDate.getDate() + 1);
    }

    const predictionPoint = {
      date: nextDate.toISOString().split('T')[0],
      price: predictedPrice
    };

    console.log(`[DEBUG] Generated prediction point:`, predictionPoint);

    return [predictionPoint];
  } catch (error) {
    console.error("[DEBUG] Error in prediction API call:", error);
    return [];
  }
};

/**
 * Test connection to the FastAPI prediction service
 */
export const testPredictionConnection = async (): Promise<boolean> => {
  console.log("[DEBUG] Testing connection to FastAPI prediction service...");

  try {
    // Try to reach the health endpoint first
    const healthUrl = PREDICT_API_URL.replace('/predict', '/health');

    const healthResponse = await Promise.race([
      fetch(healthUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      }),
      createTimeoutPromise(5000) // 5 second timeout for health check
    ]);

    if (healthResponse.ok) {
      console.log("[DEBUG] ✅ FastAPI health check successful");
      return true;
    } else {
      console.log("[DEBUG] Health endpoint returned non-OK status, testing prediction endpoint...");

      // Fallback: test prediction endpoint with minimal request
      const testResponse = await Promise.race([
        fetch(PREDICT_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ticker: 'AAPL',
            timeframe: '1d',
            include_reddit: false,
            include_posts: false
          })
        }),
        createTimeoutPromise(5000) // 5 second timeout for test
      ]);

      const isConnected = testResponse.status !== 404; // Any response except 404 means service is running
      console.log(`[DEBUG] ${isConnected ? '✅' : '❌'} FastAPI prediction endpoint test: ${testResponse.status}`);
      return isConnected;
    }
  } catch (error) {
    console.error("[DEBUG] ❌ FastAPI connection test failed:", error);
    return false;
  }
};

// Keep existing functions for compatibility
export const evaluatePredictionAccuracy = async (
  symbol: string,
  fullHistoricalData: HistoricalData[],
  celebrityHandle: string = 'elonmusk',
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

export interface OpenAIResponse {
  text: string;
  error?: string;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function queryOpenAI(prompt: string): Promise<OpenAIResponse> {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is missing.');
    return {
      text: "API key is missing.",
      error: "Missing API key"
    };
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          {
            role: 'system',
            content: 'You are FinovaBot, a helpful AI assistant for stock market analysis and financial advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 512
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return {
        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        error: data.error.message
      };
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (reply) {
      return { text: reply };
    } else {
      console.error('Unexpected OpenAI API response structure:', data);
      return {
        text: "I'm sorry, I received an unexpected response format. Please try again later.",
        error: "Unexpected response format"
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      text: "I'm sorry, there was an error connecting to my knowledge base. Please try again later.",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}