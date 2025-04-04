
// Mock data for stock API calls

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  peRatio: number;
}

export interface HistoricalData {
  date: string;
  price: number;
}

// Mock popular stocks data
const popularStocks: StockData[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 182.63,
    change: 1.59,
    changePercent: 0.87,
    volume: 64521000,
    marketCap: 2870000000000,
    peRatio: 30.2,
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 267.49,
    change: -3.32,
    changePercent: -1.23,
    volume: 56729000,
    marketCap: 850000000000,
    peRatio: 75.8,
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 429.85,
    change: 5.32,
    changePercent: 1.25,
    volume: 28934000,
    marketCap: 3200000000000,
    peRatio: 37.4,
  },
  {
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    price: 178.15,
    change: 2.50,
    changePercent: 1.42,
    volume: 35621000,
    marketCap: 1860000000000,
    peRatio: 62.1,
  },
  {
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 152.12,
    change: -0.89,
    changePercent: -0.58,
    volume: 22543000,
    marketCap: 1920000000000,
    peRatio: 26.8,
  },
  {
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    price: 487.95,
    change: 8.24,
    changePercent: 1.72,
    volume: 18392000,
    marketCap: 1250000000000,
    peRatio: 33.5,
  },
];

// Generate mock historical data
const generateHistoricalData = (basePrice: number, days: number): HistoricalData[] => {
  const data: HistoricalData[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some random fluctuation to create realistic looking chart
    const randomFactor = 0.98 + Math.random() * 0.04; // Random between 0.98 and 1.02
    const trendFactor = 1 + (days - i) * 0.001; // Slight upward trend over time
    
    const price = basePrice * randomFactor * trendFactor;
    
    data.push({
      date: date.toISOString().split('T')[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  return data;
};

// Mock stock API functions
export const getPopularStocks = async (): Promise<StockData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return popularStocks;
};

export const searchStocks = async (query: string): Promise<StockData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const lowercaseQuery = query.toLowerCase();
  return popularStocks.filter(
    stock => 
      stock.symbol.toLowerCase().includes(lowercaseQuery) || 
      stock.name.toLowerCase().includes(lowercaseQuery)
  );
};

export const getStockDetails = async (symbol: string): Promise<StockData | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  const stock = popularStocks.find(
    s => s.symbol.toLowerCase() === symbol.toLowerCase()
  );
  
  return stock || null;
};

export const getStockHistoricalData = async (
  symbol: string,
  days: number = 30
): Promise<HistoricalData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 900));
  
  const stock = popularStocks.find(
    s => s.symbol.toLowerCase() === symbol.toLowerCase()
  );
  
  if (!stock) {
    return [];
  }
  
  return generateHistoricalData(stock.price, days);
};

export const getPrediction = async (symbol: string): Promise<{
  bullish: boolean;
  confidence: number;
  prediction: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Simulate a prediction
  const bullish = Math.random() > 0.4; // 60% chance of bullish prediction
  const confidence = 65 + Math.floor(Math.random() * 20); // Between 65-85%
  
  return {
    bullish,
    confidence,
    prediction: bullish
      ? `Our AI model predicts a potential ${(2 + Math.random() * 3).toFixed(1)}% increase for ${symbol} in the next 7 days, with ${confidence}% confidence.`
      : `Our AI model indicates a possible ${(1 + Math.random() * 2).toFixed(1)}% decrease for ${symbol} in the coming week, with ${confidence}% confidence.`
  };
};
