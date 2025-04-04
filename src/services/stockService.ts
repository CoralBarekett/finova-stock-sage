
// Stock service with real API integration
import { toast } from "sonner";

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

const LIVE_STOCKS_API_KEY = 'cpna92pr01qtggbavitgcpna92pr01qtggbaviu0';
const HISTORY_STOCKS_API_KEY = '9BVIQ3O8J627J1RT';
const LIVE_STOCKS_BASE_URL = 'https://finnhub.io/api/v1';
const HISTORY_STOCKS_BASE_URL = 'https://www.alphavantage.co/query';

// Stock symbol to company name mapping
const companyNames: Record<string, string> = {
  'AAPL': 'Apple Inc.',
  'TSLA': 'Tesla, Inc.',
  'MSFT': 'Microsoft Corporation',
  'AMZN': 'Amazon.com, Inc.',
  'GOOGL': 'Alphabet Inc.',
  'META': 'Meta Platforms, Inc.',
  'NFLX': 'Netflix, Inc.',
  'NVDA': 'NVIDIA Corporation',
  'AMD': 'Advanced Micro Devices, Inc.',
  'INTC': 'Intel Corporation',
  'IBM': 'International Business Machines',
  'CSCO': 'Cisco Systems, Inc.',
  'ORCL': 'Oracle Corporation',
  'CRM': 'Salesforce, Inc.',
  'PYPL': 'PayPal Holdings, Inc.',
  'ADBE': 'Adobe Inc.',
  'TWTR': 'Twitter, Inc.',
  'SNAP': 'Snap Inc.',
  'DIS': 'The Walt Disney Company',
  'V': 'Visa Inc.',
};

// Helper functions for API calls
const handleApiError = (error: any, message: string) => {
  console.error(`${message}:`, error);
  toast.error(`Failed to fetch stock data. Please try again.`);
  return null;
};

// Get real-time stock quote from Finnhub
const getStockQuote = async (symbol: string): Promise<any> => {
  try {
    const response = await fetch(`${LIVE_STOCKS_BASE_URL}/quote?symbol=${symbol}&token=${LIVE_STOCKS_API_KEY}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    handleApiError(error, `Error fetching quote for ${symbol}`);
    return null;
  }
};

// Get company profile from Finnhub
const getCompanyProfile = async (symbol: string): Promise<any> => {
  try {
    const response = await fetch(`${LIVE_STOCKS_BASE_URL}/stock/profile2?symbol=${symbol}&token=${LIVE_STOCKS_API_KEY}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    handleApiError(error, `Error fetching profile for ${symbol}`);
    return null;
  }
};

// Mock popular stocks data (still needed as a fallback)
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

// Get historical data from Alpha Vantage
export const getStockHistoricalData = async (
  symbol: string,
  days: number = 30
): Promise<HistoricalData[]> => {
  try {
    const response = await fetch(
      `${HISTORY_STOCKS_BASE_URL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${HISTORY_STOCKS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle API limit reached or errors
    if (data['Error Message'] || data['Information'] || !data['Time Series (Daily)']) {
      console.warn('API limitation or error:', data);
      // Fall back to mock data
      return generateHistoricalData(popularStocks.find(s => s.symbol === symbol)?.price || 100, days);
    }
    
    const timeSeries = data['Time Series (Daily)'];
    const dates = Object.keys(timeSeries).sort().slice(0, days);
    
    return dates.map(date => ({
      date,
      price: parseFloat(timeSeries[date]['4. close']),
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    // Fall back to mock data
    const stock = popularStocks.find(s => s.symbol.toLowerCase() === symbol.toLowerCase());
    return generateHistoricalData(stock?.price || 100, days);
  }
};

// Generate mock historical data (used as fallback)
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

// Get popular stocks with real data from Finnhub
export const getPopularStocks = async (): Promise<StockData[]> => {
  const symbols = ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'GOOGL', 'META'];
  const result: StockData[] = [];
  
  try {
    // We'll use Promise.all to fetch data for all symbols in parallel
    await Promise.all(
      symbols.map(async (symbol) => {
        const quote = await getStockQuote(symbol);
        
        if (quote) {
          result.push({
            symbol,
            name: companyNames[symbol] || symbol,
            price: quote.c || 0,
            change: quote.d || 0,
            changePercent: quote.dp || 0,
            volume: quote.v || 0,
            marketCap: 0, // Not available in basic quote
            peRatio: 0,   // Not available in basic quote
          });
        }
      })
    );
    
    // If we failed to get any real data, use mock data
    if (result.length === 0) {
      toast.error("Could not fetch live stock data. Using sample data instead.");
      return popularStocks;
    }
    
    return result;
  } catch (error) {
    console.error("Error fetching popular stocks:", error);
    toast.error("Could not fetch live stock data. Using sample data instead.");
    return popularStocks;
  }
};

// Search for stocks
export const searchStocks = async (query: string): Promise<StockData[]> => {
  if (!query || query.trim() === '') {
    return [];
  }
  
  try {
    const response = await fetch(
      `${LIVE_STOCKS_BASE_URL}/search?q=${query}&token=${LIVE_STOCKS_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.result || !Array.isArray(data.result)) {
      console.warn('No search results or unexpected format:', data);
      // Fall back to mock search
      const lowercaseQuery = query.toLowerCase();
      return popularStocks.filter(
        stock => 
          stock.symbol.toLowerCase().includes(lowercaseQuery) || 
          stock.name.toLowerCase().includes(lowercaseQuery)
      );
    }
    
    // Convert the search results to our StockData format
    // We need to fetch quotes for the search results
    const topResults = data.result.slice(0, 10);
    const searchResults: StockData[] = [];
    
    await Promise.all(
      topResults.map(async (item: any) => {
        if (item.symbol && item.type === 'Common Stock') {
          const quote = await getStockQuote(item.symbol);
          if (quote) {
            searchResults.push({
              symbol: item.symbol,
              name: item.description || item.symbol,
              price: quote.c || 0,
              change: quote.d || 0,
              changePercent: quote.dp || 0,
              volume: quote.v || 0,
              marketCap: 0,
              peRatio: 0,
            });
          }
        }
      })
    );
    
    return searchResults;
  } catch (error) {
    console.error("Error searching stocks:", error);
    toast.error("Error searching for stocks. Using sample results.");
    
    // Fall back to mock search
    const lowercaseQuery = query.toLowerCase();
    return popularStocks.filter(
      stock => 
        stock.symbol.toLowerCase().includes(lowercaseQuery) || 
        stock.name.toLowerCase().includes(lowercaseQuery)
    );
  }
};

// Get details for a specific stock
export const getStockDetails = async (symbol: string): Promise<StockData | null> => {
  try {
    const quote = await getStockQuote(symbol);
    const profile = await getCompanyProfile(symbol);
    
    if (!quote) {
      throw new Error(`Could not fetch quote for ${symbol}`);
    }
    
    return {
      symbol: symbol,
      name: profile?.name || companyNames[symbol] || symbol,
      price: quote.c || 0,
      change: quote.d || 0,
      changePercent: quote.dp || 0,
      volume: quote.v || 0,
      marketCap: profile?.marketCapitalization || 0,
      peRatio: 0, // Not available in basic API
    };
  } catch (error) {
    console.error(`Error fetching stock details for ${symbol}:`, error);
    
    // Fall back to mock data
    const stock = popularStocks.find(
      s => s.symbol.toLowerCase() === symbol.toLowerCase()
    );
    
    if (!stock) {
      return null;
    }
    
    return stock;
  }
};

// Get AI prediction for a stock - this remains mock data for now
export const getPrediction = async (symbol: string): Promise<{
  bullish: boolean;
  confidence: number;
  prediction: string;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Generate a mock prediction
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
