
// Twitter API v2 integration for fetching tweets from influencers
import { toast } from "sonner";

// Define influencer handles that are relevant for stock market predictions
export const FINANCIAL_INFLUENCERS = [
  'jimcramer',
  'TheMotleyFool',
  'StockTwits',
  'CNBC',
  'WSJmarkets',
  'MarketWatch',
  'BillAckman',
  'Carl_C_Icahn',
  'michaeljburry',
  'TheStalwart',
];

export interface Tweet {
  id: string;
  text: string;
  authorId: string;
  username: string;
  createdAt: string;
}

interface TwitterAPIOptions {
  sinceHours?: number;
  maxResults?: number;
}

const DEFAULT_OPTIONS: TwitterAPIOptions = {
  sinceHours: 24,
  maxResults: 10,
};

/**
 * Fetches recent tweets from financial influencers via Supabase Edge Function.
 * The Edge Function should use the secret TWITTER_BEARER_TOKEN
 * stored securely in Supabase (project secrets) to call the Twitter API v2.
 * 
 * Backend Edge Function example (to deploy with Supabase CLI as twitter.ts):
 * 
 * import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
 * const TWITTER_API_BASE = 'https://api.twitter.com/2';
 * const TWITTER_BEARER_TOKEN = Deno.env.get('TWITTER_BEARER_TOKEN');
 * serve(async (req) => { // ... impl as shown in previous examples ... })
 */
export const fetchRecentTweets = async (
  handles: string[] = FINANCIAL_INFLUENCERS,
  options: TwitterAPIOptions = DEFAULT_OPTIONS
): Promise<Tweet[]> => {
  try {
    // Now calls the deployed Supabase Edge Function instead of a mock API endpoint!
    const response = await fetch('/functions/v1/twitter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        handles,
        sinceHours: options.sinceHours || DEFAULT_OPTIONS.sinceHours,
        maxResults: options.maxResults || DEFAULT_OPTIONS.maxResults,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.tweets;
  } catch (error) {
    console.error("Error fetching tweets:", error);
    toast.error("Failed to fetch social media data");
    return [];
  }
};
