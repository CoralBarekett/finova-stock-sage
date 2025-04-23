
import { predictStockPrices } from './predictionService';
import { evaluatePredictionAccuracy } from './evaluationService';
import { HistoricalData } from './stockService';
import { fetchRecentTweets, FINANCIAL_INFLUENCERS } from './socialMediaService';
import { analyzeSentiment, classifyRelevance } from './nlpService';
import { toast } from 'sonner';

// Configuration for social signal integration
const SOCIAL_SIGNAL_WEIGHT = 0.3; // How much the social signals affect predictions (0-1)
const MIN_RELEVANT_TWEETS = 3; // Minimum number of relevant tweets needed to factor in social signals

/**
 * Gets stock predictions with social media sentiment analysis enhancement
 * Integrates both time-series prediction and social media signals
 */
export const getPredictionsWithSilentEval = async (
  symbol: string,
  fullHistoricalData: HistoricalData[]
): Promise<HistoricalData[]> => {
  try {
    // Get base time-series predictions
    const predictionInput = fullHistoricalData.slice(-30); // get last 30 days
    const baselinePredictions = await predictStockPrices(symbol, predictionInput);
    
    // Calculate social sentiment score to adjust predictions
    const socialScore = await calculateSocialSignalScore(symbol);
    
    // Apply social sentiment adjustment to predictions
    const enhancedPredictions = applySocialSignalToPredictions(
      baselinePredictions, 
      socialScore
    );
    
    console.log(`Social signal score for ${symbol}: ${socialScore.toFixed(3)} (weight: ${SOCIAL_SIGNAL_WEIGHT})`);
    
    // Run internal evaluation if enough historical data exists
    if (fullHistoricalData.length >= 60) {
      const backtestData = fullHistoricalData.slice(0, -7);
      evaluatePredictionAccuracy(symbol, backtestData); // console only
    }
    
    return enhancedPredictions;
  } catch (error) {
    console.error("Error in prediction pipeline:", error);
    // In case of error, fall back to base time-series prediction
    const predictionInput = fullHistoricalData.slice(-30);
    return predictStockPrices(symbol, predictionInput);
  }
};

/**
 * Calculates a social signal score by analyzing relevant tweets
 * Returns a value between -1 (very bearish) and 1 (very bullish)
 */
const calculateSocialSignalScore = async (symbol: string): Promise<number> => {
  try {
    // Fetch recent tweets from financial influencers
    const allTweets = await fetchRecentTweets(FINANCIAL_INFLUENCERS, { sinceHours: 24 });
    
    if (allTweets.length === 0) {
      console.log("No tweets found for social signal analysis");
      return 0; // Neutral if no tweets
    }
    
    console.log(`Analyzing ${allTweets.length} tweets for ${symbol} social signals...`);
    
    // Filter tweets that are relevant to the stock symbol or market in general
    const relevantTweets = [];
    
    for (const tweet of allTweets) {
      // Check if the tweet mentions the stock symbol explicitly
      const mentionsStock = tweet.text.toLowerCase().includes(symbol.toLowerCase());
      
      // If it doesn't mention the stock directly, check if it's relevant to markets
      const isRelevant = mentionsStock || await classifyRelevance(tweet.text);
      
      if (isRelevant) {
        relevantTweets.push(tweet);
      }
    }
    
    console.log(`Found ${relevantTweets.length} relevant tweets out of ${allTweets.length}`);
    
    // If we don't have enough relevant tweets, return neutral
    if (relevantTweets.length < MIN_RELEVANT_TWEETS) {
      return 0;
    }
    
    // Analyze sentiment for each relevant tweet
    let totalSentiment = 0;
    
    for (const tweet of relevantTweets) {
      const sentiment = await analyzeSentiment(tweet.text);
      totalSentiment += sentiment;
    }
    
    // Calculate average sentiment and normalize to [-1, 1] range
    const avgSentiment = totalSentiment / relevantTweets.length;
    
    // Apply a volume factor - more relevant tweets means stronger signal
    const volumeFactor = Math.min(1, relevantTweets.length / 10);
    
    // Final social score combines sentiment and volume
    return avgSentiment * volumeFactor;
  } catch (error) {
    console.error("Error calculating social signal:", error);
    return 0; // Return neutral on error
  }
};

/**
 * Applies social sentiment adjustments to time-series predictions
 * Higher positive scores shift predictions up, negative scores shift down
 */
const applySocialSignalToPredictions = (
  predictions: HistoricalData[],
  socialScore: number
): HistoricalData[] => {
  // If no social score or no predictions, return original predictions
  if (socialScore === 0 || !predictions.length) return predictions;
  
  return predictions.map((prediction, index) => {
    // Apply gradually increasing effect of social signal over time
    // Earlier predictions are affected less, later predictions more
    const effectFactor = (index + 1) / predictions.length;
    
    // Calculate adjustment percentage based on social score and weight
    const adjustmentPercentage = socialScore * SOCIAL_SIGNAL_WEIGHT * effectFactor;
    
    // Apply adjustment to the predicted price
    const adjustedPrice = prediction.price * (1 + adjustmentPercentage);
    
    return {
      date: prediction.date,
      price: parseFloat(adjustedPrice.toFixed(2))
    };
  });
};
