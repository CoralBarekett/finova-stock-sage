
/**
 * Social Media Service - Twitter API V2 Integration
 * Note: You must connect to Supabase and set the TWITTER_BEARER_TOKEN in your environment variables
 */
import { toast } from "sonner";

// List of financial influencer Twitter handles to monitor
const FINANCIAL_INFLUENCERS = [
  "jimcramer",
  "elonmusk",
  "thestreet",
  "cnbc",
  "wsbmoderator",
  "unusual_whales",
  "stockwits",
  "marketwatch",
  "bloombergtv",
  "federalreserve"
];

export interface Tweet {
  id: string;
  text: string;
  createdAt: string;
  username: string;
  metrics: {
    retweets: number;
    likes: number;
    replies: number;
  };
}

export interface SocialMediaFetchOptions {
  sinceHours?: number;
  maxResults?: number;
  handles?: string[];
}

/**
 * Fetch recent tweets from financial influencers
 */
export const fetchRecentTweets = async (
  options: SocialMediaFetchOptions = {}
): Promise<Tweet[]> => {
  const { sinceHours = 24, maxResults = 50, handles = FINANCIAL_INFLUENCERS } = options;
  
  // Check for API token in environment variables
  if (typeof process.env.TWITTER_BEARER_TOKEN !== 'string') {
    console.error("TWITTER_BEARER_TOKEN not found in environment variables");
    toast.error("Twitter API token not configured");
    return [];
  }
  
  try {
    // Calculate time window - tweets from the past x hours
    const sinceTime = new Date();
    sinceTime.setHours(sinceTime.getHours() - sinceHours);
    const startTime = sinceTime.toISOString();
    
    // Create comma-separated list of usernames to search for
    const usernameQuery = handles.join(" OR from:");
    
    // Build Twitter API v2 search URL
    const url = new URL("https://api.twitter.com/2/tweets/search/recent");
    url.searchParams.append("query", `from:${usernameQuery}`);
    url.searchParams.append("max_results", maxResults.toString());
    url.searchParams.append("start_time", startTime);
    url.searchParams.append("tweet.fields", "created_at,public_metrics,author_id");
    url.searchParams.append("user.fields", "username");
    url.searchParams.append("expansions", "author_id");
    
    // Make API request
    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Twitter API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Process and format the tweets
    if (!data.data || !data.includes || !data.includes.users) {
      return [];
    }
    
    // Create a map of user IDs to usernames
    const userMap = data.includes.users.reduce((map: Record<string, string>, user: any) => {
      map[user.id] = user.username;
      return map;
    }, {});
    
    // Format tweets
    return data.data.map((tweet: any) => ({
      id: tweet.id,
      text: tweet.text,
      createdAt: tweet.created_at,
      username: userMap[tweet.author_id] || "unknown",
      metrics: {
        retweets: tweet.public_metrics?.retweet_count || 0,
        likes: tweet.public_metrics?.like_count || 0,
        replies: tweet.public_metrics?.reply_count || 0
      }
    }));
    
  } catch (error) {
    console.error("Error fetching tweets:", error);
    toast.error("Failed to load social media data");
    return [];
  }
};

/**
 * Calculate social impact score based on engagement metrics
 */
export const calculateSocialImpact = (tweets: Tweet[]): number => {
  if (!tweets.length) return 0;
  
  // Calculate total engagement
  let totalEngagement = 0;
  
  for (const tweet of tweets) {
    // Weight engagement metrics differently
    const engagement = 
      tweet.metrics.retweets * 2 + // Retweets have higher weight
      tweet.metrics.likes * 0.5 + // Likes have medium weight
      tweet.metrics.replies * 1.5; // Replies have higher weight than likes
    
    totalEngagement += engagement;
  }
  
  // Normalize to a 0-1 scale (sigmoid function)
  const normalizedScore = 1 / (1 + Math.exp(-totalEngagement / 1000));
  
  return normalizedScore;
};
