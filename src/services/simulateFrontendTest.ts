import { getPredictionsWithSocialSentiment } from "@/services/stockPredictionService";
import { HistoricalData } from "@/services/stockService";

// Utility to generate mock historical data (60 business days)
const generateMockHistoricalData = (): HistoricalData[] => {
  const today = new Date();
  const data: HistoricalData[] = [];

  for (let i = 60; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    if (date.getDay() !== 0 && date.getDay() !== 6) { // skip weekends
      data.push({
        date: date.toISOString().split('T')[0],
        price: +(150 + Math.random() * 10).toFixed(2),
      });
    }
  }
  return data;
};

// Simulation runner
const simulatePrediction = async () => {
  const symbol = "AAPL"; // example stock symbol
  const celebrityHandle = "realDonaldTrump"; // example celebrity handle
  const historicalData = generateMockHistoricalData();

  console.log(`\x1b[36m[Simulation Start]\x1b[0m Simulating prediction for symbol: \x1b[33m${symbol}\x1b[0m considering tweets by \x1b[35m@${celebrityHandle}\x1b[0m\n`);

  try {
    const predictions = await getPredictionsWithSocialSentiment(symbol, celebrityHandle, historicalData);

    console.log(`\x1b[32m[Success]\x1b[0m Received ${predictions.length} predictions:\n`);
    console.table(predictions.map(p => ({
      Date: p.date,
      "Predicted Price": `$${p.price}`,
    })));

    console.log("\n\x1b[36m[Simulation Completed]\x1b[0m\n");
  } catch (error) {
    console.error("\x1b[31m[Error]\x1b[0m Simulation failed:", error);
  }
};

simulatePrediction();