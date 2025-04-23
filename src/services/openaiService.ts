
/**
 * OpenAI Service for embeddings and related functionality
 * Note: You must connect to Supabase and set the OPENAI_API_KEY in your environment variables
 */

// Embedding cache to avoid redundant API calls
const embeddingCache: Record<string, number[]> = {};

/**
 * Get an embedding for text using OpenAI's embedding API
 * With error handling and retry logic
 */
export const getEmbedding = async (text: string): Promise<number[]> => {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  // Normalize and clean the text
  const normalizedText = text.trim().toLowerCase();
  
  // Check cache first
  if (embeddingCache[normalizedText]) {
    return embeddingCache[normalizedText];
  }
  
  // Check for API key
  if (typeof process.env.OPENAI_API_KEY !== 'string') {
    console.error("OPENAI_API_KEY not found in environment variables");
    return [];
  }
  
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          input: normalizedText,
          model: "text-embedding-3-small"
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        
        // Handle rate limiting
        if (response.status === 429) {
          retries++;
          const backoff = Math.pow(2, retries) * 1000; // Exponential backoff
          console.warn(`Rate limited, retrying in ${backoff}ms...`);
          await new Promise(resolve => setTimeout(resolve, backoff));
          continue;
        }
        
        throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      const embedding = data.data[0]?.embedding;
      
      if (!embedding) {
        throw new Error("No embedding returned from API");
      }
      
      // Normalize embedding to unit length
      const normalizedEmbedding = normalizeVector(embedding);
      
      // Save to cache
      embeddingCache[normalizedText] = normalizedEmbedding;
      
      return normalizedEmbedding;
    } catch (error) {
      retries++;
      console.error(`Error getting embedding (attempt ${retries}/${maxRetries}):`, error);
      
      if (retries >= maxRetries) {
        console.error("Max retries reached, giving up");
        return [];
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, retries * 1000));
    }
  }
  
  return [];
};

/**
 * Compare two embeddings using cosine similarity
 * Returns a value between -1 (opposite) and 1 (identical)
 */
export const compareEmbeddings = (embeddingA: number[], embeddingB: number[]): number => {
  if (!embeddingA || !embeddingB || embeddingA.length !== embeddingB.length) {
    return 0;
  }
  
  // Calculate dot product
  let dotProduct = 0;
  for (let i = 0; i < embeddingA.length; i++) {
    dotProduct += embeddingA[i] * embeddingB[i];
  }
  
  return dotProduct;
};

/**
 * Normalize a vector to have a magnitude (length) of 1
 */
export const normalizeVector = (vector: number[]): number[] => {
  // Calculate the magnitude (length) of the vector
  const magnitude = Math.sqrt(
    vector.reduce((sum, val) => sum + val * val, 0)
  );
  
  // Avoid division by zero
  if (magnitude === 0) {
    return vector;
  }
  
  // Normalize each component
  return vector.map(val => val / magnitude);
};

/**
 * Clear the embedding cache
 */
export const clearEmbeddingCache = (): void => {
  Object.keys(embeddingCache).forEach(key => {
    delete embeddingCache[key];
  });
  console.log("Embedding cache cleared");
};
