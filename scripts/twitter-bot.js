#!/usr/bin/env node

/**
 * Twitter Rehash Bot for @NFTLunatic
 *
 * Fetches popular tweets about stocks/crypto and rehashes them
 * Only rehashes tweets that haven't been posted in the last 5 days
 */

require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');

// Initialize Twitter client
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

// Read-write client
const rwClient = client.readWrite;

// Path to track rehashed tweets
const REHASH_TRACKER_PATH = path.join(__dirname, '../data/rehash-tracker.json');
const DAYS_BEFORE_REHASH = 5;
const MIN_LIKES_FOR_POPULAR = 10; // Minimum likes to consider a tweet "popular"

// Keywords to identify crypto/stock tweets
const CRYPTO_STOCK_KEYWORDS = [
  'bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'nft', 'defi',
  'stock', 'stocks', 'trading', 'trade', 'market', 'bull', 'bear',
  'moon', 'pump', 'dump', 'hodl', 'dip', 'ath', 'altcoin', 'altcoins',
  'sol', 'solana', 'doge', 'shib', 'xrp', 'ada', 'bnb', 'avax',
  'portfolio', 'gains', 'profit', 'loss', 'chart', 'analysis',
  'buy', 'sell', 'long', 'short', 'futures', 'spot', 'leverage',
  '$', 'price', 'prediction', 'bullish', 'bearish', 'breakout',
  'support', 'resistance', 'volume', 'whale', 'bag', 'airdrop'
];

/**
 * Load rehash tracker data
 */
function loadRehashTracker() {
  try {
    if (fs.existsSync(REHASH_TRACKER_PATH)) {
      const data = fs.readFileSync(REHASH_TRACKER_PATH, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading rehash tracker:', error.message);
  }
  return { rehashes: {} };
}

/**
 * Save rehash tracker data
 */
function saveRehashTracker(tracker) {
  try {
    const dir = path.dirname(REHASH_TRACKER_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(REHASH_TRACKER_PATH, JSON.stringify(tracker, null, 2));
  } catch (error) {
    console.error('Error saving rehash tracker:', error.message);
  }
}

/**
 * Check if a tweet is about crypto/stocks
 */
function isCryptoStockTweet(text) {
  const lowerText = text.toLowerCase();
  return CRYPTO_STOCK_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

/**
 * Check if a tweet can be rehashed (hasn't been rehashed in 5+ days)
 */
function canRehash(tweetId, tracker) {
  const lastRehash = tracker.rehashes[tweetId];
  if (!lastRehash) return true;

  const daysSinceRehash = (Date.now() - new Date(lastRehash).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceRehash >= DAYS_BEFORE_REHASH;
}

/**
 * Fetch user's popular tweets
 */
async function fetchPopularTweets(username) {
  try {
    // Get user ID first
    const user = await client.v2.userByUsername(username);
    if (!user.data) {
      throw new Error(`User @${username} not found`);
    }

    const userId = user.data.id;
    console.log(`Found user @${username} (ID: ${userId})`);

    // Fetch user's tweets (up to 100 recent tweets)
    const tweets = await client.v2.userTimeline(userId, {
      max_results: 100,
      'tweet.fields': ['public_metrics', 'created_at', 'text'],
      exclude: ['retweets', 'replies'],
    });

    if (!tweets.data?.data) {
      console.log('No tweets found');
      return [];
    }

    // Filter for popular crypto/stock tweets
    const popularTweets = tweets.data.data
      .filter(tweet => {
        const likes = tweet.public_metrics?.like_count || 0;
        return likes >= MIN_LIKES_FOR_POPULAR && isCryptoStockTweet(tweet.text);
      })
      .sort((a, b) => {
        const likesA = a.public_metrics?.like_count || 0;
        const likesB = b.public_metrics?.like_count || 0;
        return likesB - likesA;
      });

    console.log(`Found ${popularTweets.length} popular crypto/stock tweets`);
    return popularTweets;

  } catch (error) {
    console.error('Error fetching tweets:', error.message);
    throw error;
  }
}

/**
 * Rehash a tweet text (slightly modify to avoid duplicate detection)
 */
function rehashTweetText(originalText) {
  // Remove any URLs from the original
  let text = originalText.replace(/https?:\/\/\S+/g, '').trim();

  // Add some variation
  const prefixes = [
    '🔥 ',
    '💎 ',
    '📈 ',
    '🚀 ',
    '⚡ ',
    '💰 ',
    '🎯 ',
    '',
  ];

  const suffixes = [
    '',
    ' 🔥',
    ' 💪',
    ' 📊',
    ' #crypto #stocks',
    ' #trading',
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  let rehashed = prefix + text + suffix;

  // Ensure tweet is within character limit
  if (rehashed.length > 280) {
    rehashed = rehashed.substring(0, 277) + '...';
  }

  return rehashed;
}

/**
 * Post a rehashed tweet
 */
async function postRehash(tweetText) {
  try {
    const result = await rwClient.v2.tweet(tweetText);
    console.log('Successfully posted tweet:', result.data.id);
    return result.data;
  } catch (error) {
    console.error('Error posting tweet:', error.message);
    throw error;
  }
}

/**
 * Main function to run the bot
 */
async function runBot() {
  console.log('='.repeat(50));
  console.log('Twitter Rehash Bot for @NFTLunatic');
  console.log('='.repeat(50));
  console.log(`Time: ${new Date().toISOString()}`);
  console.log('');

  const username = process.env.TWITTER_USERNAME || 'NFTLunatic';
  const tracker = loadRehashTracker();

  try {
    // Fetch popular tweets
    const popularTweets = await fetchPopularTweets(username);

    if (popularTweets.length === 0) {
      console.log('No popular crypto/stock tweets found to rehash');
      return;
    }

    // Find a tweet that can be rehashed
    let tweetToRehash = null;
    for (const tweet of popularTweets) {
      if (canRehash(tweet.id, tracker)) {
        tweetToRehash = tweet;
        break;
      }
    }

    if (!tweetToRehash) {
      console.log('All popular tweets have been rehashed recently (within 5 days)');
      console.log('Waiting for cooldown period...');
      return;
    }

    console.log('');
    console.log('Selected tweet to rehash:');
    console.log(`- ID: ${tweetToRehash.id}`);
    console.log(`- Likes: ${tweetToRehash.public_metrics?.like_count}`);
    console.log(`- Original: ${tweetToRehash.text.substring(0, 100)}...`);
    console.log('');

    // Rehash the tweet
    const rehashed = rehashTweetText(tweetToRehash.text);
    console.log(`Rehashed: ${rehashed}`);
    console.log('');

    // Post the rehashed tweet
    const posted = await postRehash(rehashed);

    // Update tracker
    tracker.rehashes[tweetToRehash.id] = new Date().toISOString();
    saveRehashTracker(tracker);

    console.log('');
    console.log('✅ Successfully rehashed tweet!');
    console.log(`New tweet ID: ${posted.id}`);

  } catch (error) {
    console.error('Bot error:', error.message);
    process.exit(1);
  }
}

/**
 * Run in scheduled mode (for cron jobs)
 */
async function runScheduled() {
  // Random delay to seem more human (0-30 minutes)
  const delay = Math.floor(Math.random() * 30 * 60 * 1000);
  console.log(`Waiting ${Math.round(delay / 1000 / 60)} minutes before posting...`);

  await new Promise(resolve => setTimeout(resolve, delay));
  await runBot();
}

// CLI handling
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Twitter Rehash Bot for @NFTLunatic

Usage:
  node twitter-bot.js              Run once immediately
  node twitter-bot.js --scheduled  Run with random delay (for cron)
  node twitter-bot.js --dry-run    Show what would be posted without posting
  node twitter-bot.js --list       List popular tweets without posting

Options:
  --help, -h      Show this help message
  --scheduled     Add random delay before posting
  --dry-run       Preview without posting
  --list          List available tweets to rehash
`);
  process.exit(0);
}

if (args.includes('--list')) {
  (async () => {
    const username = process.env.TWITTER_USERNAME || 'NFTLunatic';
    const tracker = loadRehashTracker();
    const tweets = await fetchPopularTweets(username);

    console.log('\nPopular crypto/stock tweets:');
    console.log('-'.repeat(50));

    tweets.forEach((tweet, i) => {
      const canRehashNow = canRehash(tweet.id, tracker);
      const status = canRehashNow ? '✅ Can rehash' : '⏳ Cooling down';
      console.log(`\n${i + 1}. [${status}]`);
      console.log(`   Likes: ${tweet.public_metrics?.like_count} | RT: ${tweet.public_metrics?.retweet_count}`);
      console.log(`   ${tweet.text.substring(0, 100)}...`);
    });
  })();
} else if (args.includes('--dry-run')) {
  (async () => {
    const username = process.env.TWITTER_USERNAME || 'NFTLunatic';
    const tracker = loadRehashTracker();
    const tweets = await fetchPopularTweets(username);

    const tweetToRehash = tweets.find(t => canRehash(t.id, tracker));

    if (tweetToRehash) {
      const rehashed = rehashTweetText(tweetToRehash.text);
      console.log('\n[DRY RUN] Would post:');
      console.log('-'.repeat(50));
      console.log(rehashed);
      console.log('-'.repeat(50));
    } else {
      console.log('No tweets available to rehash');
    }
  })();
} else if (args.includes('--scheduled')) {
  runScheduled();
} else {
  runBot();
}
