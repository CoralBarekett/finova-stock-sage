
// NLP service for sentiment analysis and relevance classification via Supabase Edge Function
import { getEmbedding, computeCosineSimilarity } from './openaiService';

const MARKET_KEYWORDS = [
  'stock market', 'bull market', 'bear market', 'investment', 'shares', 
  'nasdaq', 'dow jones', 'S&P 500', 'trading', 'stocks', 'bonds', 
  'interest rates', 'Fed', 'inflation', 'recession', 'rally',
  'earnings', 'growth', 'crash', 'correction', 'volatility'
];

const RELEVANCE_THRESHOLD = 0.75;

/** 
 * Analyze sentiment using Edge Function (`/functions/v1/openai`)
 * Edge Function must use OPENAI_API_KEY from Supabase secrets!
 */
export const analyzeSentiment = async (text: string): Promise<number> => {
  try {
    const response = await fetch('/functions/v1/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, analyze: 'sentiment' }),
    });
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data.score;
  } catch (error) {
    return 0;
  }
};

// Keywords embeddings are cached
let marketKeywordsEmbeddings: number[][] | null = null;

/**
 * Classifies whether a text is relevant to market using cosine similarity on embeddings.
 * Edge Function must use OPENAI_API_KEY from Supabase secrets!
 */
export const classifyRelevance = async (text: string): Promise<boolean> => {
  try {
    const textEmbedding = await getEmbedding(text);

    // Lazy load market keyword embeddings
    if (!marketKeywordsEmbeddings) {
      const response = await fetch('/functions/v1/openai?type=market-embeddings', { method: 'GET' });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      marketKeywordsEmbeddings = data.embeddings;
    }
    const similarities = marketKeywordsEmbeddings.map(keywordEmbedding => 
      computeCosineSimilarity(textEmbedding, keywordEmbedding)
    );
    const maxSimilarity = Math.max(...similarities);
    return maxSimilarity >= RELEVANCE_THRESHOLD;
  } catch (error) {
    return false;
  }
};
