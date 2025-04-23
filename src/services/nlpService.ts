
/**
 * NLP Service for sentiment analysis and relevance classification
 * Note: You must connect to Supabase and set the OPENAI_API_KEY in your environment variables
 */
import { getEmbedding, compareEmbeddings } from './openaiService';

// Market-related keywords for relevance filtering
const MARKET_KEYWORDS = [
  "stock market", "bull market", "bear market", "market crash", "market rally",
  "stock price", "investment", "trading", "portfolio", "shares",
  "nasdaq", "dow jones", "sp500", "s&p 500", "russell 2000",
  "earnings", "revenue", "profit", "loss", "quarterly results",
  "dividend", "split", "ipo", "merger", "acquisition",
  "bullish", "bearish", "volatility", "trend", "correction",
  "recession", "inflation", "interest rates", "federal reserve", "fed"
];

// Relevance threshold - higher value = stricter filtering
const RELEVANCE_THRESHOLD = 0.6;

/**
 * Analyze text sentiment using OpenAI
 * Returns a score between -1 (negative) and 1 (positive)
 */
export const analyzeSentiment = async (text: string): Promise<number> => {
  if (!text || typeof text !== 'string') {
    return 0;
  }

  try {
    // Check for OpenAI API key
    if (typeof process.env.OPENAI_API_KEY !== 'string') {
      console.error("OPENAI_API_KEY not found in environment variables");
      return 0;
    }

    const url = "https://api.openai.com/v1/chat/completions";
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system", 
            content: "You are a financial sentiment analyzer. Analyze the sentiment of the text and return only a number between -1 (extremely negative) and 1 (extremely positive). Return 0 for neutral sentiment."
          },
          {
            role: "user",
            content: text
          }
        ],
        temperature: 0.1,
        max_tokens: 5
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const sentimentText = data.choices[0]?.message?.content || "0";
    
    // Parse the sentiment score
    const sentimentScore = parseFloat(sentimentText.trim());
    
    // Ensure the score is within -1 to 1 range
    return isNaN(sentimentScore) ? 0 : Math.min(Math.max(sentimentScore, -1), 1);
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    return 0;
  }
};

/**
 * Classify if text is relevant to stock market movements
 * Uses embeddings and cosine similarity to determine relevance
 */
export const classifyRelevance = async (text: string): Promise<boolean> => {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  try {
    // Get embedding for the text
    const textEmbedding = await getEmbedding(text);
    
    // If we couldn't get an embedding, return false
    if (!textEmbedding || textEmbedding.length === 0) {
      return false;
    }
    
    // Calculate max similarity to any of the market keywords
    let maxSimilarity = 0;
    
    for (const keyword of MARKET_KEYWORDS) {
      const keywordEmbedding = await getEmbedding(keyword);
      
      if (keywordEmbedding && keywordEmbedding.length > 0) {
        const similarity = compareEmbeddings(textEmbedding, keywordEmbedding);
        maxSimilarity = Math.max(maxSimilarity, similarity);
        
        // Early exit if we find high similarity
        if (maxSimilarity >= RELEVANCE_THRESHOLD) {
          return true;
        }
      }
    }
    
    return maxSimilarity >= RELEVANCE_THRESHOLD;
  } catch (error) {
    console.error("Error classifying relevance:", error);
    return false;
  }
};

/**
 * Batch analyze sentiment for multiple texts
 */
export const batchAnalyzeSentiment = async (texts: string[]): Promise<number[]> => {
  if (!texts || texts.length === 0) {
    return [];
  }
  
  // Process in batches to avoid rate limiting
  const results: number[] = [];
  const batchSize = 10;
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const promises = batch.map(text => analyzeSentiment(text));
    const batchResults = await Promise.all(promises);
    results.push(...batchResults);
  }
  
  return results;
};
