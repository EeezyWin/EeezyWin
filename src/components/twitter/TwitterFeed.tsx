'use client';

import { useEffect, useState } from 'react';
import { useTwitterStore } from '@/store/useTwitterStore';
import { TweetCard } from './TweetCard';
import { TwitterHeader } from './TwitterHeader';
import { RefreshCw, Zap, Filter } from 'lucide-react';
import { Tweet } from '@/types';

const categories: (Tweet['category'] | 'all')[] = ['all', 'discipline', 'strength', 'perseverance', 'leadership', 'mindset', 'success'];

export const TwitterFeed = () => {
  const { tweets, checkAndAutoPost, generateAutonomousTweet, autoPostEnabled } = useTwitterStore();
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const [selectedCategory, setSelectedCategory] = useState<Tweet['category'] | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Check for auto posts on mount and periodically
  useEffect(() => {
    checkAndAutoPost();

    const interval = setInterval(() => {
      checkAndAutoPost();
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [checkAndAutoPost]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    generateAutonomousTweet();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const filteredTweets = selectedCategory === 'all'
    ? tweets
    : tweets.filter(tweet => tweet.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-xl mx-auto border-x border-gray-800 min-h-screen">
        <TwitterHeader activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Auto-post status & Controls */}
        <div className="border-b border-gray-800 px-4 py-3 bg-gradient-to-r from-gray-900 to-black">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${autoPostEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
              <span className="text-sm text-gray-400">
                {autoPostEnabled ? 'Auto-posting enabled' : 'Auto-posting disabled'}
              </span>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 rounded-full text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              New Quote
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="border-b border-gray-800 px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-white text-black'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'All' : `#${category}`}
              </button>
            ))}
          </div>
        </div>

        {/* New Tweets Indicator */}
        {filteredTweets.length > 0 && (
          <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-center gap-2 text-blue-400 hover:bg-gray-900/50 cursor-pointer transition-colors">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">{filteredTweets.length} inspirational quotes loaded</span>
          </div>
        )}

        {/* Tweet Feed */}
        <div>
          {filteredTweets.length > 0 ? (
            filteredTweets.map((tweet) => (
              <TweetCard key={tweet.id} tweet={tweet} />
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center text-4xl">
                🦁
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No quotes yet</h3>
              <p className="text-gray-500 mb-4">
                Start your journey to greatness. Click the button below to load inspirational quotes.
              </p>
              <button
                onClick={handleRefresh}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full font-bold transition-colors"
              >
                Load Quotes
              </button>
            </div>
          )}
        </div>

        {/* Footer Motivational Message */}
        {filteredTweets.length > 0 && (
          <div className="p-6 border-t border-gray-800 text-center bg-gradient-to-t from-gray-900 to-transparent">
            <p className="text-gray-500 text-sm">
              "The best time to plant a tree was 20 years ago. The second best time is now."
            </p>
            <p className="text-gray-600 text-xs mt-2">Keep scrolling. Keep growing. Keep conquering.</p>
          </div>
        )}
      </div>
    </div>
  );
};
