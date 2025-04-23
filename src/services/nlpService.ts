
// NLP service for sentiment analysis and relevance classification
import { getEmbedding, computeCosineSimilarity } from './openaiService';

// Market-related keywords to check tweet relevance against
const MARKET_KEYWORDS = [
  'stock market', 'bull market', 'bear market', 'investment', 'shares', 
  'nasdaq', 'dow jones', 'S&P 500', 'trading', 'stocks', 'bonds', 
  'interest rates', 'Fed', 'inflation', 'recession', 'rally',
  'earnings', 'growth', 'crash', 'correction', 'volatility'
];

// Threshold for determining if a tweet is relevant to market movements
const RELEVANCE_THRESHOLD = 0.75;

// Cache for keyword embeddings to avoid recomputing them
let marketKeywordsEmbeddings: number[][] | null = null;

/**
 * Analyzes sentiment of a text
 * Returns a score from -1.0 (very negative) to 1.0 (very positive)
 */
export const analyzeSentiment = async (text: string): Promise<number> => {
  try {
    // This would be a call to a Supabase Edge Function that has access to the OPENAI_API_KEY
    const response = await fetch('/api/openai/analyze-sentiment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.score;
  } catch (error) {
    console.error("Error analyzing sentiment:", error);
    // Return neutral sentiment on error
    return 0;
  }
};

/**
 * Classifies whether a text is relevant to stock market movements
 * using embeddings similarity to market-related keywords
 */
export const classifyRelevance = async (text: string): Promise<boolean> => {
  try {
    // Get embedding for the input text
    const textEmbedding = await getEmbedding(text);
    
    // Initialize market keywords embeddings if not done yet
    if (!marketKeywordsEmbeddings) {
      // This would be a call to a Supabase Edge Function that has access to the OPENAI_API_KEY
      const response = await fetch('/api/openai/get-market-embeddings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      marketKeywordsEmbeddings = data.embeddings;
    }
    
    // Compute similarities to each market keyword
    const similarities = marketKeywordsEmbeddings.map(keywordEmbedding => 
      computeCosineSimilarity(textEmbedding, keywordEmbedding)
    );
    
    // Take the maximum similarity score
    const maxSimilarity = Math.max(...similarities);
    
    // Return true if similarity exceeds threshold
    return maxSimilarity >= RELEVANCE_THRESHOLD;
  } catch (error) {
    console.error("Error classifying relevance:", error);
    return false;
  }
};

// For implementing in Supabase Edge Function (not part of the front-end code):
/*
// Edge Function: /api/openai/analyze-sentiment
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

serve(async (req) => {
  try {
    const { text } = await req.json();
    
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Analyze the sentiment of the following text for stock market impact. 
              Return only a single number between -1.0 (very bearish) and 1.0 (very bullish):
              
              Text: "${text}"
              
              Sentiment score:`,
      temperature: 0.3,
      max_tokens: 10
    });
    
    // Extract the sentiment score from the response
    const scoreText = response.data.choices[0].text.trim();
    const score = parseFloat(scoreText);
    
    if (isNaN(score)) {
      throw new Error('Failed to parse sentiment score');
    }
    
    // Ensure score is within bounds
    const normalizedScore = Math.max(-1.0, Math.min(1.0, score));
    
    return new Response(
      JSON.stringify({ score: normalizedScore }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
})

// Edge Function: /api/openai/get-market-embeddings
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

const MARKET_KEYWORDS = [
  'stock market', 'bull market', 'bear market', 'investment', 'shares', 
  'nasdaq', 'dow jones', 'S&P 500', 'trading', 'stocks', 'bonds', 
  'interest rates', 'Fed', 'inflation', 'recession', 'rally',
  'earnings', 'growth', 'crash', 'correction', 'volatility'
];

serve(async () => {
  try {
    const embeddings = [];
    
    // Get embeddings for all market keywords
    for (const keyword of MARKET_KEYWORDS) {
      const response = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: keyword,
      });
      
      embeddings.push(response.data.data[0].embedding);
    }
    
    return new Response(
      JSON.stringify({ embeddings }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
})
*/
