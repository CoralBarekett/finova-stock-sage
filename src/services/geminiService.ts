export interface GeminiResponse {
  text: string;
  error?: string;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent';

export async function queryGemini(prompt: string): Promise<GeminiResponse> {
  if (!GEMINI_API_KEY) {
    console.error('Gemini API key is missing.');
    return {
      text: "API key is missing.",
      error: "Missing API key"
    };
  }

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

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (reply) {
      return { text: reply };
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