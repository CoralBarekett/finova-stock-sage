export interface OpenAIResponse {
  text: string;
  error?: string;
}

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function queryOpenAI(prompt: string): Promise<OpenAIResponse> {
  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is missing.');
    return {
      text: "API key is missing.",
      error: "Missing API key"
    };
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are FinovaBot, a helpful AI assistant for stock market analysis and financial advice.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    const data = await response.json();

    if (data.error) {
      console.error('OpenAI API error:', data.error);
      return {
        text: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        error: data.error.message
      };
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (reply) {
      return { text: reply };
    } else {
      console.error('Unexpected OpenAI API response structure:', data);
      return {
        text: "I'm sorry, I received an unexpected response format. Please try again later.",
        error: "Unexpected response format"
      };
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return {
      text: "I'm sorry, there was an error connecting to my knowledge base. Please try again later.",
      error: error instanceof Error ? error.message : String(error)
    };
  }
}