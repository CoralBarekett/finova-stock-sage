
// OpenAI service for embeddings and vector operations
import { toast } from "sonner";

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Delay between retries (in ms), increases exponentially
const RETRY_DELAY_BASE = 1000;

/**
 * Gets an embedding for the given text
 * Uses the text-embedding-ada-002 model from OpenAI
 * Includes retry logic and error handling
 */
export const getEmbedding = async (text: string): Promise<number[]> => {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      // This would be a call to a Supabase Edge Function that has access to the OPENAI_API_KEY
      const response = await fetch('/api/openai/get-embedding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        // If we get rate limited (429) or server error (5xx), retry
        const status = response.status;
        if ((status === 429 || status >= 500) && retries < MAX_RETRIES - 1) {
          retries++;
          // Exponential backoff
          const delay = RETRY_DELAY_BASE * Math.pow(2, retries);
          console.log(`Rate limited or server error. Retrying in ${delay}ms...`);
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
        console.log(`Error getting embedding, retrying in ${delay}ms...`, error);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        console.error("Failed to get embedding after retries:", error);
        toast.error("Error computing text similarity");
        // Return a zero vector as fallback
        return Array(1536).fill(0);
      }
    }
  }
  
  // This should never be reached due to the error handling above,
  // but TypeScript requires a return value
  return Array(1536).fill(0);
};

/**
 * Normalizes a vector to unit length
 */
export const normalizeVector = (vector: number[]): number[] => {
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  
  // Avoid division by zero
  if (magnitude === 0) return vector;
  
  return vector.map(val => val / magnitude);
};

/**
 * Computes the cosine similarity between two vectors
 * Returns a value between -1 and 1, where 1 means identical
 */
export const computeCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  // Ensure vectors have the same length
  if (vecA.length !== vecB.length) {
    console.error("Vectors must have the same length");
    return 0;
  }
  
  // Calculate dot product
  const dotProduct = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  
  // Calculate magnitudes
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));
  
  // Calculate similarity
  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
};

// For implementing in Supabase Edge Function (not part of the front-end code):
/*
// Edge Function: /api/openai/get-embedding
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.1.0'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

serve(async (req) => {
  try {
    const { text } = await req.json();
    
    const response = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: text,
    });
    
    const embedding = response.data.data[0].embedding;
    
    return new Response(
      JSON.stringify({ embedding }),
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
