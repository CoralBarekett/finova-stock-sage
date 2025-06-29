import { calculatePredictedPrice } from "@/services/stockPredictionService";
import type { HistoricalData } from "@/services/stockService";
import type { PredictionResponse } from "@/services/stockPredictionService";
import type {
  ChartDataPoint,
  PredictionStats,
  TimeframeType,
} from "@/types/stockPrediction.types";

/**
 * Prepare chart data by combining historical and prediction data
 * Historical data shows exactly one month, predictions extend from current date
 */
export const prepareChartData = (
  historicalData: HistoricalData[],
  predictionData: PredictionResponse | null,
  timeframe: TimeframeType
): ChartDataPoint[] => {
  console.log("[DEBUG] Preparing chart data...");
  console.log(`[DEBUG] Historical data points: ${historicalData.length}`);
  console.log(`[DEBUG] Prediction data available: ${!!predictionData}`);
  console.log(`[DEBUG] Timeframe: ${timeframe}`);

  const combined: ChartDataPoint[] = [];

  // Add historical data points (always shows one month of data)
  historicalData.forEach((item, index) => {
    combined.push({
      date: item.date,
      actualPrice: item.price,
      predictedPrice: null,
      type: "historical",
    });

    if (index % 10 === 0) {
      console.log(
        `[DEBUG] Added historical point ${index + 1}/${
          historicalData.length
        }: ${item.date} - $${item.price}`
      );
    }
  });

  // Add prediction points if available
  if (predictionData && historicalData.length > 0) {
    console.log("[DEBUG] Adding prediction data points...");

    // Use current date as the starting point for predictions
    const currentDate = new Date();
    const lastPrice = historicalData[historicalData.length - 1].price;
    console.log(
      `[DEBUG] Current date: ${currentDate.toISOString().split("T")[0]}`
    );
    console.log(`[DEBUG] Last historical price: $${lastPrice}`);

    // Try multiple ways to get predicted price for compatibility with different response formats
    let predictedPrice = 0;

    if (predictionData.predicted_price) {
      predictedPrice = predictionData.predicted_price;
      console.log(`[DEBUG] Using predicted_price: $${predictedPrice}`);
    } else if (predictionData.prediction?.price_target) {
      predictedPrice = predictionData.prediction.price_target;
      console.log(`[DEBUG] Using price_target: $${predictedPrice}`);
    } else {
      predictedPrice = calculatePredictedPrice(lastPrice, predictionData);
      console.log(`[DEBUG] Calculated predicted price: $${predictedPrice}`);
    }

    // Calculate prediction date based on timeframe from current date
    const predictionDate = new Date(currentDate);

    switch (timeframe) {
      case "1d":
        predictionDate.setDate(predictionDate.getDate() + 1);
        break;
      case "1w":
        predictionDate.setDate(predictionDate.getDate() + 7);
        break;
      case "1m":
        predictionDate.setDate(predictionDate.getDate() + 30);
        break;
    }

    // Skip weekends for more realistic display
    while ([0, 6].includes(predictionDate.getDay())) {
      predictionDate.setDate(predictionDate.getDate() + 1);
    }

    const predictionPoint: ChartDataPoint = {
      date: predictionDate.toISOString().split("T")[0],
      actualPrice: null,
      predictedPrice: predictedPrice,
      type: "prediction",
    };

    combined.push(predictionPoint);
    console.log(
      `[DEBUG] Added prediction point: ${predictionPoint.date} - $${predictionPoint.predictedPrice}`
    );
  } else {
    console.log(
      "[DEBUG] No prediction data or historical data available for chart"
    );
  }

  // Sort by date to ensure proper chronological order
  const sorted = combined.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  console.log(`[DEBUG] Chart data prepared with ${sorted.length} total points`);
  return sorted;
};

/**
 * Calculate comprehensive statistics from historical and prediction data
 */
export const calculateStats = (
  historicalData: HistoricalData[],
  predictionData: PredictionResponse | null,
  currentPrice?: number
): PredictionStats | null => {
  console.log("[DEBUG] Calculating comprehensive statistics...");

  if (!historicalData.length) {
    console.log("[DEBUG] No historical data available for stats calculation");
    return null;
  }

  // Use provided current price or fall back to historical data
  const actualCurrentPrice =
    currentPrice !== undefined
      ? currentPrice
      : historicalData[historicalData.length - 1]?.price || 0;
  console.log(
    `[DEBUG] Current price: $${actualCurrentPrice} (${
      currentPrice !== undefined
        ? "from real-time data"
        : "from historical data"
    })`
  );

  let predictedPrice = actualCurrentPrice;
  let change = 0;
  let changePercent = 0;
  let confidence = 0;
  let direction = "hold";
  let sentiment = "neutral";
  let postsAnalyzed = 0;
  let influencerPosts = 0;
  let technicalTrend = "neutral";
  let priceChangePercent = 0;

  if (predictionData) {
    console.log("[DEBUG] Processing prediction data for stats...");

    // Get predicted price from various possible sources
    if (predictionData.predicted_price) {
      predictedPrice = predictionData.predicted_price;
    } else if (predictionData.prediction?.price_target) {
      predictedPrice = predictionData.prediction.price_target;
    } else {
      predictedPrice = calculatePredictedPrice(
        actualCurrentPrice,
        predictionData
      );
    }

    change = predictedPrice - actualCurrentPrice;
    changePercent =
      actualCurrentPrice > 0 ? (change / actualCurrentPrice) * 100 : 0;

    // Extract other stats from prediction data (supporting both old and new formats)
    confidence =
      predictionData.prediction?.confidence || predictionData.confidence || 0;
    direction =
      predictionData.prediction?.direction ||
      predictionData.technical_signals?.trend ||
      "hold";
    sentiment =
      predictionData.prediction?.sentiment ||
      (typeof predictionData.sentiment_analysis === "string"
        ? predictionData.sentiment_analysis
        : predictionData.analysis?.social_sentiment?.sentiment) ||
      "neutral";

    // Posts analyzed from various sources
    postsAnalyzed =
      predictionData.analysis?.posts_analyzed ||
      predictionData.data_sources?.total_posts ||
      predictionData.supporting_data?.post_count ||
      0;

    influencerPosts =
      predictionData.data_sources?.influencer_posts ||
      predictionData.supporting_data?.influencer_post_count ||
      0;

    technicalTrend =
      predictionData.technical_signals?.trend ||
      predictionData.prediction?.direction ||
      "neutral";

    priceChangePercent =
      predictionData.technical_signals?.price_change_percent || changePercent;

    console.log(`[DEBUG] Stats calculated:`);
    console.log(`[DEBUG] - Predicted price: $${predictedPrice}`);
    console.log(
      `[DEBUG] - Change: $${change.toFixed(2)} (${changePercent.toFixed(2)}%)`
    );
    console.log(`[DEBUG] - Confidence: ${confidence}`);
    console.log(`[DEBUG] - Direction: ${direction}`);
    console.log(`[DEBUG] - Sentiment: ${sentiment}`);
    console.log(`[DEBUG] - Posts analyzed: ${postsAnalyzed}`);
    console.log(`[DEBUG] - Influencer posts: ${influencerPosts}`);
  } else {
    console.log("[DEBUG] No prediction data available, using default values");
  }

  const stats: PredictionStats = {
    currentPrice: actualCurrentPrice,
    predictedPrice,
    change,
    changePercent,
    confidence,
    direction,
    sentiment,
    postsAnalyzed,
    influencerPosts,
    technicalTrend,
    priceChangePercent,
  };

  console.log("[DEBUG] Final stats object:", stats);
  return stats;
};

/**
 * Format currency values for display
 */
export const formatCurrency = (value: number, decimals: number = 2): string => {
  return `$${value.toFixed(decimals)}`;
};

/**
 * Format percentage values for display
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
};

/**
 * Get color based on value (green for positive, red for negative)
 */
export const getChangeColor = (value: number): string => {
  return value >= 0 ? "text-green-500" : "text-red-500";
};

/**
 * Get sentiment color based on sentiment value
 */
export const getSentimentColor = (sentiment: string): string => {
  const sentimentLower = sentiment.toLowerCase();
  switch (sentimentLower) {
    case "very positive":
      return "text-emerald-600";
    case "positive":
      return "text-green-600";
    case "neutral":
      return "text-gray-600";
    case "negative":
      return "text-red-600";
    case "very negative":
      return "text-red-700";
    default:
      return "text-gray-600";
  }
};

/**
 * Get direction color based on prediction direction
 */
export const getDirectionColor = (direction: string): string => {
  const directionLower = direction.toLowerCase();
  switch (directionLower) {
    case "up":
    case "bullish":
    case "buy":
    case "strong_buy":
      return "text-emerald-600";
    case "down":
    case "bearish":
    case "sell":
    case "strong_sell":
      return "text-red-600";
    case "neutral":
    case "hold":
    default:
      return "text-gray-600";
  }
};

/**
 * Get trend icon name based on direction
 */
export const getTrendIcon = (
  direction: string
): "trending-up" | "trending-down" | "minus" => {
  const directionLower = direction.toLowerCase();
  switch (directionLower) {
    case "up":
    case "bullish":
    case "buy":
    case "strong_buy":
      return "trending-up";
    case "down":
    case "bearish":
    case "sell":
    case "strong_sell":
      return "trending-down";
    default:
      return "minus";
  }
};

/**
 * Calculate date range for historical data display
 * Always returns 30 days regardless of timeframe
 */
export const calculateDateRange = (
  currentDate: Date,
  timeframe: TimeframeType
) => {
  // Always use 30 days for historical data display
  const days = 30;
  const endDate = new Date(currentDate);
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - days);

  console.log(
    `[DEBUG] Date range calculated: ${
      startDate.toISOString().split("T")[0]
    } to ${endDate.toISOString().split("T")[0]} (${days} days)`
  );

  return { startDate, endDate, days };
};

/**
 * Validate if prediction data is complete and reliable
 */
export const validatePredictionData = (
  predictionData: PredictionResponse | null
): boolean => {
  if (!predictionData) {
    console.log("[DEBUG] Prediction validation failed: No prediction data");
    return false;
  }

  const hasConfidence =
    (predictionData.prediction?.confidence || predictionData.confidence || 0) >
    0;
  const hasMinimumConfidence =
    (predictionData.prediction?.confidence || predictionData.confidence || 0) >
    0.3;
  const hasPrediction = !!(
    predictionData.predicted_price ||
    predictionData.prediction?.price_target ||
    predictionData.prediction
  );
  const hasAnalysis = !!(
    predictionData.analysis?.posts_analyzed ||
    predictionData.data_sources?.total_posts ||
    predictionData.supporting_data?.post_count
  );

  const isValid =
    hasConfidence && hasMinimumConfidence && hasPrediction && hasAnalysis;

  console.log(`[DEBUG] Prediction validation:`);
  console.log(`[DEBUG] - Has confidence: ${hasConfidence}`);
  console.log(`[DEBUG] - Minimum confidence: ${hasMinimumConfidence}`);
  console.log(`[DEBUG] - Has prediction: ${hasPrediction}`);
  console.log(`[DEBUG] - Has analysis: ${hasAnalysis}`);
  console.log(`[DEBUG] - Overall valid: ${isValid}`);

  return isValid;
};

/**
 * Get confidence level description
 */
export const getConfidenceDescription = (confidence: number): string => {
  if (confidence >= 0.8) return "High Confidence";
  if (confidence >= 0.6) return "Medium Confidence";
  if (confidence >= 0.4) return "Low-Medium Confidence";
  return "Low Confidence";
};

/**
 * Calculate time until next market open (mock implementation)
 */
export const getTimeUntilMarketOpen = (): string => {
  // This is a simplified mock - in reality you'd check actual market hours
  const now = new Date();
  const marketOpen = new Date();
  marketOpen.setHours(9, 30, 0, 0); // 9:30 AM

  if (now.getHours() >= 9 && now.getHours() < 16) {
    return "Market is Open";
  }

  if (now.getHours() >= 16) {
    marketOpen.setDate(marketOpen.getDate() + 1);
  }

  const diff = marketOpen.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `Market opens in ${hours}h ${minutes}m`;
};
