#!/usr/bin/env node

/**
 * Twitter Rehash Bot for @NFTLunatic
 *
 * Posts rehashed versions of popular tweets from a manual collection
 * Only rehashes tweets that haven't been posted in the last 5 days
 */

require('dotenv').config();
const { TwitterApi } = require('twitter-api-v2');
const fs = require('fs');
const path = require('path');
const { manualTweets } = require('./tweets-data');

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
 * Check if a tweet can be rehashed (hasn't been rehashed in 5+ days)
 */
function canRehash(tweetId, tracker) {
  const lastRehash = tracker.rehashes[tweetId];
  if (!lastRehash) return true;

  const daysSinceRehash = (Date.now() - new Date(lastRehash).getTime()) / (1000 * 60 * 60 * 24);
  return daysSinceRehash >= DAYS_BEFORE_REHASH;
}

/**
 * Rehash a tweet text (slightly modify to avoid duplicate detection)
 */
function rehashTweetText(originalText) {
  // Add some variation
  const prefixes = [
    '🔥 ',
    '💎 ',
    '📈 ',
    '🚀 ',
    '⚡ ',
    '💰 ',
    '🎯 ',
    '👀 ',
    '📊 ',
    '',
    '',
  ];

  const suffixes = [
    '',
    '',
    ' 🔥',
    ' 💪',
    ' 📊',
    ' 👇',
    '\n\n#stocks #investing',
    '\n\n#trading',
  ];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];

  let rehashed = prefix + originalText + suffix;

  // Ensure tweet is within character limit
  if (rehashed.length > 280) {
    rehashed = originalText.substring(0, 277) + '...';
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
    if (error.data) {
      console.error('Twitter API error details:', JSON.stringify(error.data, null, 2));
    }
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
  console.log(`Total tweets in collection: ${manualTweets.length}`);
  console.log('');

  const tracker = loadRehashTracker();

  try {
    // Find a tweet that can be rehashed
    const availableTweets = manualTweets.filter(tweet => canRehash(tweet.id, tracker));

    console.log(`Available tweets to rehash: ${availableTweets.length}`);

    if (availableTweets.length === 0) {
      console.log('All tweets have been rehashed recently (within 5 days)');
      console.log('Waiting for cooldown period...');
      return;
    }

    // Pick a random tweet from available ones
    const tweetToRehash = availableTweets[Math.floor(Math.random() * availableTweets.length)];

    console.log('');
    console.log('Selected tweet to rehash:');
    console.log(`- ID: ${tweetToRehash.id}`);
    console.log(`- Category: ${tweetToRehash.category}`);
    console.log(`- Original likes: ${tweetToRehash.likes}`);
    console.log(`- Preview: ${tweetToRehash.text.substring(0, 100)}...`);
    console.log('');

    // Rehash the tweet
    const rehashed = rehashTweetText(tweetToRehash.text);
    console.log('Rehashed version:');
    console.log('-'.repeat(40));
    console.log(rehashed);
    console.log('-'.repeat(40));
    console.log('');

    // Post the rehashed tweet
    const posted = await postRehash(rehashed);

    // Update tracker
    tracker.rehashes[tweetToRehash.id] = new Date().toISOString();
    saveRehashTracker(tracker);

    console.log('');
    console.log('✅ Successfully rehashed tweet!');
    console.log(`New tweet ID: ${posted.id}`);
    console.log(`View at: https://twitter.com/NFTLunatic/status/${posted.id}`);

  } catch (error) {
    console.error('Bot error:', error.message);
    process.exit(1);
  }
}

/**
 * Run in scheduled mode (for cron jobs)
 */
async function runScheduled() {
  // Random delay to seem more human (0-1 minute for testing)
  const delay = Math.floor(Math.random() * 1 * 60 * 1000);
  console.log(`Waiting ${Math.round(delay / 1000)} seconds before posting...`);

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
  node twitter-bot.js --list       List available tweets to rehash

Options:
  --help, -h      Show this help message
  --scheduled     Add random delay before posting
  --dry-run       Preview without posting
  --list          List available tweets to rehash
`);
  process.exit(0);
}

if (args.includes('--list')) {
  const tracker = loadRehashTracker();

  console.log('\nManual tweet collection:');
  console.log('-'.repeat(50));

  manualTweets.forEach((tweet, i) => {
    const canRehashNow = canRehash(tweet.id, tracker);
    const lastRehash = tracker.rehashes[tweet.id];
    const status = canRehashNow ? '✅ Can rehash' : `⏳ Last: ${new Date(lastRehash).toLocaleDateString()}`;
    console.log(`\n${i + 1}. [${status}]`);
    console.log(`   Category: ${tweet.category} | Original likes: ${tweet.likes}`);
    console.log(`   ${tweet.text.substring(0, 80)}...`);
  });

  const available = manualTweets.filter(t => canRehash(t.id, tracker)).length;
  console.log(`\n\nTotal: ${manualTweets.length} tweets, ${available} available to rehash`);

} else if (args.includes('--dry-run')) {
  const tracker = loadRehashTracker();
  const availableTweets = manualTweets.filter(tweet => canRehash(tweet.id, tracker));

  if (availableTweets.length > 0) {
    const tweetToRehash = availableTweets[Math.floor(Math.random() * availableTweets.length)];
    const rehashed = rehashTweetText(tweetToRehash.text);
    console.log('\n[DRY RUN] Would post:');
    console.log('-'.repeat(50));
    console.log(rehashed);
    console.log('-'.repeat(50));
    console.log(`\nCharacter count: ${rehashed.length}/280`);
  } else {
    console.log('No tweets available to rehash (all on cooldown)');
  }
} else if (args.includes('--scheduled')) {
  runScheduled();
} else {
  runBot();
}
