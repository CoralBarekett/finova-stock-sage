
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
 * Fetches recent tweets from financial influencers
 * Requires TWITTER_BEARER_TOKEN to be set in Supabase secrets
 */
export const fetchRecentTweets = async (
  handles: string[] = FINANCIAL_INFLUENCERS,
  options: TwitterAPIOptions = DEFAULT_OPTIONS
): Promise<Tweet[]> => {
  try {
    // This would be a call to Supabase Edge Function that has access to the TWITTER_BEARER_TOKEN
    const response = await fetch('/api/twitter/fetch-tweets', {
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

// For implementing in a Supabase Edge Function (not part of the front-end code):
/*
// Edge Function: /api/twitter/fetch-tweets
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const TWITTER_API_BASE = 'https://api.twitter.com/2';
const TWITTER_BEARER_TOKEN = Deno.env.get('TWITTER_BEARER_TOKEN');

serve(async (req) => {
  try {
    const { handles, sinceHours, maxResults } = await req.json();
    
    // Calculate the start time based on sinceHours
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - sinceHours);
    const formattedStartTime = startTime.toISOString();
    
    const tweets = [];
    
    // For each handle, fetch recent tweets
    for (const handle of handles) {
      // First get the user ID from handle
      const userResponse = await fetch(
        `${TWITTER_API_BASE}/users/by/username/${handle}`,
        {
          headers: {
            'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          }
        }
      );
      
      const userData = await userResponse.json();
      if (!userData.data?.id) continue;
      
      const userId = userData.data.id;
      
      // Then fetch tweets for that user
      const tweetsResponse = await fetch(
        `${TWITTER_API_BASE}/users/${userId}/tweets?max_results=${maxResults}&start_time=${formattedStartTime}&tweet.fields=created_at&expansions=author_id&user.fields=username`,
        {
          headers: {
            'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          }
        }
      );
      
      const tweetsData = await tweetsResponse.json();
      
      if (tweetsData.data) {
        const formattedTweets = tweetsData.data.map(tweet => ({
          id: tweet.id,
          text: tweet.text,
          authorId: tweet.author_id,
          username: handle,
          createdAt: tweet.created_at,
        }));
        
        tweets.push(...formattedTweets);
      }
    }
    
    return new Response(
      JSON.stringify({ tweets }),
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
