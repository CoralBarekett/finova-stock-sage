
import { HistoricalData } from "./stockService";

// Implementation of a simplified prediction model based on the provided Python script
export const predictStockPrices = async (
  symbol: string,
  historicalData: HistoricalData[]
): Promise<HistoricalData[]> => {
  if (!historicalData || historicalData.length < 5) {
    console.error("Insufficient data for prediction");
    return [];
  }

  try {
    // Sort historical data by date (ascending)
    const sortedData = [...historicalData].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Simple prediction model (linear regression-like approach)
    // This is a simplified client-side implementation
    const last5Prices = sortedData.slice(-5).map(item => item.price);
    const lastDate = new Date(sortedData[sortedData.length - 1].date);
    
    // Calculate average price change
    let priceChangeSum = 0;
    for (let i = 1; i < last5Prices.length; i++) {
      priceChangeSum += (last5Prices[i] - last5Prices[i-1]);
    }
    const avgPriceChange = priceChangeSum / (last5Prices.length - 1);
    
    // Calculate price momentum (acceleration)
    const momentum = avgPriceChange > 0 ? 1.02 : 0.98;
    
    // Generate predictions for next 7 days
    const predictions: HistoricalData[] = [];
    let lastPrice = last5Prices[last5Prices.length - 1];
    
    for (let i = 1; i <= 7; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + i);
      
      // Apply simple prediction formula with momentum factor
      lastPrice = lastPrice + (avgPriceChange * momentum);
      
      predictions.push({
        date: nextDate.toISOString().split('T')[0],
        price: parseFloat(lastPrice.toFixed(2)),
      });
    }
    
    console.log(`Generated ${predictions.length} price predictions for ${symbol}`);
    return predictions;
  } catch (error) {
    console.error("Error generating stock price predictions:", error);
    return [];
  }
};
