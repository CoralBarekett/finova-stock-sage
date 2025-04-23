
import { predictStockPrices } from './predictionService';
import { evaluatePredictionAccuracy } from './evaluationService';
import { HistoricalData } from './stockService';
import { fetchRecentTweets, calculateSocialImpact, Tweet } from './socialMediaService';
import { batchAnalyzeSentiment, classifyRelevance } from './nlpService';

// Configuration for social signals
const SOCIAL_SIGNAL_WEIGHT = 0.3; // Social signal influence (0-1)
const SENTIMENT_THRESHOLD = 0.5; // Minimum sentiment strength to consider

/**
 * Enhanced prediction with social media signals
 */
export const getPredictionsWithSilentEval = async (
  symbol: string,
  fullHistoricalData: HistoricalData[]
): Promise<HistoricalData[]> => {
  try {
    // Get baseline predictions from technical analysis
    const predictionInput = fullHistoricalData.slice(-30); // get last 30 days
    let predictions = await predictStockPrices(symbol, predictionInput);

    // Fetch social signals if available
    const socialSignalAdjustment = await getSocialSignalAdjustment(symbol);
    
    // Apply social signal adjustment to predictions
    if (socialSignalAdjustment !== 0) {
      console.log(`Applying social signal adjustment: ${socialSignalAdjustment}`);
      
      // Adjust predictions based on social signals
      predictions = predictions.map((prediction, index) => {
        // Apply increasing adjustment over time (cumulative effect)
        const dayFactor = (index + 1) / predictions.length;
        const adjustedPrice = prediction.price * (1 + socialSignalAdjustment * dayFactor);
        
        return {
          ...prediction,
          price: parseFloat(adjustedPrice.toFixed(2))
        };
      });
    }
    
    // Run internal evaluation if enough historical data exists
    if (fullHistoricalData.length >= 60) {
      const backtestData = fullHistoricalData.slice(0, -7);
      evaluatePredictionAccuracy(symbol, backtestData); // console only
    }

    return predictions;
  } catch (error) {
    console.error("Error in enhanced predictions:", error);
    // Fallback to basic prediction if social signals fail
    const predictionInput = fullHistoricalData.slice(-30);
    return predictStockPrices(symbol, predictionInput);
  }
};

/**
 * Calculate social signal adjustment factor for a stock
 * Returns a factor between -0.1 and 0.1 to multiply with price predictions
 */
async function getSocialSignalAdjustment(symbol: string): Promise<number> {
  try {
    // Fetch relevant tweets about this stock
    const tweets = await fetchRecentTweets({ 
      sinceHours: 48,
      maxResults: 100
    });
    
    if (!tweets || tweets.length === 0) {
      console.log("No tweets found for social signal analysis");
      return 0;
    }
    
    console.log(`Analyzing ${tweets.length} tweets for social signals`);
    
    // Filter tweets by relevance
    const relevantTweets: Tweet[] = [];
    for (const tweet of tweets) {
      const isRelevant = await classifyRelevance(tweet.text);
      if (isRelevant) {
        relevantTweets.push(tweet);
      }
    }
    
    console.log(`Found ${relevantTweets.length} relevant tweets`);
    
    if (relevantTweets.length === 0) {
      return 0;
    }
    
    // Get sentiment for all relevant tweets
    const tweetTexts = relevantTweets.map(tweet => tweet.text);
    const sentiments = await batchAnalyzeSentiment(tweetTexts);
    
    // Calculate weighted sentiment based on social impact
    const socialImpact = calculateSocialImpact(relevantTweets);
    
    let weightedSentiment = 0;
    let totalWeight = 0;
    
    sentiments.forEach((sentiment, i) => {
      // Only consider strong sentiments
      if (Math.abs(sentiment) >= SENTIMENT_THRESHOLD) {
        const tweet = relevantTweets[i];
        const engagementWeight = (
          tweet.metrics.retweets * 3 + 
          tweet.metrics.likes + 
          tweet.metrics.replies * 2
        ) / 100;
        
        weightedSentiment += sentiment * engagementWeight;
        totalWeight += engagementWeight;
      }
    });
    
    // Calculate final sentiment if we have valid weights
    const finalSentiment = totalWeight > 0 
      ? weightedSentiment / totalWeight
      : 0;
    
    // Scale sentiment (-1 to 1) to a smaller adjustment factor
    // Combined with the social impact (0 to 1)
    const adjustmentFactor = finalSentiment * SOCIAL_SIGNAL_WEIGHT * socialImpact;
    
    // Log the factors
    console.log({
      relevantTweetCount: relevantTweets.length,
      finalSentiment: finalSentiment.toFixed(2),
      socialImpact: socialImpact.toFixed(2),
      adjustmentFactor: adjustmentFactor.toFixed(4)
    });
    
    return adjustmentFactor;
  } catch (error) {
    console.error("Error calculating social signal adjustment:", error);
    return 0;
  }
}
