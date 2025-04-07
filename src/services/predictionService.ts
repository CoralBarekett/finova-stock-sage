import { HistoricalData } from "./stockService";

// Linear regression utility to compute slope and intercept
const linearRegression = (x: number[], y: number[]) => {
  const n = x.length;
  const xMean = x.reduce((a, b) => a + b) / n;
  const yMean = y.reduce((a, b) => a + b) / n;

  const numerator = x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0);
  const denominator = x.reduce((sum, xi) => sum + (xi - xMean) ** 2, 0);

  const slope = numerator / denominator;
  const intercept = yMean - slope * xMean;
  return { slope, intercept };
};

// Predict stock prices using linear regression on recent trends and volatility
export const predictStockPrices = async (
  symbol: string,
  historicalData: HistoricalData[]
): Promise<HistoricalData[]> => {
  if (!historicalData || historicalData.length < 30) {
    console.error("Insufficient data for prediction (requires at least 30 days)");
    return [];
  }

  try {
    // Sort historical data by date (ascending)
    const sortedData = [...historicalData].sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Use the last 30 days for the regression model
    const recentData = sortedData.slice(-30);
    const prices = recentData.map(d => d.price);

    // Generate a simple index to use as X values: [0, 1, 2, ..., 29]
    const xValues = [...Array(prices.length).keys()];
    const yValues = prices;

    // Fit a linear regression model: price ~ day index
    const { slope, intercept } = linearRegression(xValues, yValues);

    // Calculate standard deviation of daily returns to simulate volatility
    const returns = prices.slice(1).map((price, i) => (price - prices[i]) / prices[i]);
    const avgReturn = returns.reduce((a, b) => a + b) / returns.length;
    const volatility = Math.sqrt(returns.reduce((sum, r) => sum + (r - avgReturn) ** 2, 0) / returns.length);

    // Predict prices for the next 7 trading days (skip weekends)
    const predictions: HistoricalData[] = [];
    let currentDate = new Date(recentData[recentData.length - 1].date);
    let lastIndex = xValues[xValues.length - 1];

    for (let i = 1; predictions.length < 7; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);

      // Skip weekends
      const day = nextDate.getDay();
      if (day === 0 || day === 6) continue;

      const nextIndex = lastIndex + i;
      let predictedPrice = intercept + slope * nextIndex;

      // Add realistic noise based on observed volatility (normal-like)
      const noise = predictedPrice * (Math.random() * volatility - volatility / 2);
      predictedPrice += noise;

      predictions.push({
        date: nextDate.toISOString().split("T")[0],
        price: parseFloat(predictedPrice.toFixed(2)),
      });
    }

    console.log(`Generated ${predictions.length} linear regression-based predictions for ${symbol}:`, predictions);
    return predictions;
  } catch (error) {
    console.error("Error generating stock price predictions:", error);
    return [];
  }
};