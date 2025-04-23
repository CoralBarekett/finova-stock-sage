
// OpenAI service for embeddings and vector operations, powered by Supabase Edge Function + secure OPENAI_API_KEY
import { toast } from "sonner";

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
const RETRY_DELAY_BASE = 1000;

/**
 * Gets an embedding for the given text, via Edge Function using OPENAI_API_KEY secret.
 * Edge Function (openai.ts) should handle: reading secret, calling OpenAI API, and returning the embedding.
 *
 * Example Edge Function snippet:
 * import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
 * const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
 * serve(async (req) => { ...call chat/completions or embedding API... })
 */
export const getEmbedding = async (text: string): Promise<number[]> => {
  let retries = 0;

  while (retries < MAX_RETRIES) {
    try {
      // Calls Supabase Edge Function (openai.ts)
      const response = await fetch('/functions/v1/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const status = response.status;
        if ((status === 429 || status >= 500) && retries < MAX_RETRIES - 1) {
          retries++;
          const delay = RETRY_DELAY_BASE * Math.pow(2, retries);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return normalizeVector(data.embedding);
    } catch (error) {
      if (retries < MAX_RETRIES - 1) {
        retries++;
        const delay = RETRY_DELAY_BASE * Math.pow(2, retries);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("Failed to get embedding after retries:", error);
        toast.error("Error computing text similarity");
        return Array(1536).fill(0);
      }
    }
  }
  return Array(1536).fill(0);
};

/** Normalizes a vector to unit length */
export const normalizeVector = (vector: number[]): number[] => {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  if (magnitude === 0) return vector;
  return vector.map(val => val / magnitude);
};

/** Computes cosine similarity between two vectors */
export const computeCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length) {
    return 0;
  }
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
};
