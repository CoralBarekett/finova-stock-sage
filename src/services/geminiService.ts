
import { toast } from "sonner";

const GEMINI_API_KEY = 'AIzaSyCxARdY8769pf-Bm-07lW9APeT6zMTemug';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiResponse {
  text: string;
  error?: string;
}

export async function queryGemini(prompt: string): Promise<GeminiResponse> {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are FinovaBot, a helpful AI assistant for stock market analysis and financial advice. 
                       Respond to this question in a professional but friendly manner: ${prompt}`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return {
        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        error: data.error.message
      };
    }

    // Extract the response text from the Gemini API response
    if (data.candidates && 
        data.candidates[0] && 
        data.candidates[0].content && 
        data.candidates[0].content.parts && 
        data.candidates[0].content.parts[0] && 
        data.candidates[0].content.parts[0].text) {
      return { text: data.candidates[0].content.parts[0].text };
    } else {
      console.error('Unexpected Gemini API response structure:', data);
      return { 
        text: "I'm sorry, I received an unexpected response format. Please try again later.",
        error: "Unexpected response format" 
      };
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return {
      text: "I'm sorry, there was an error connecting to my knowledge base. Please try again later.",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}
