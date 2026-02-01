'use client';

import { Tweet } from '@/types';
import { Heart, Repeat2, MessageCircle, Bookmark, Share, BadgeCheck, Eye } from 'lucide-react';
import { useTwitterStore } from '@/store/useTwitterStore';

interface TweetCardProps {
  tweet: Tweet;
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const timestamp = new Date(date);
  const seconds = Math.floor((now.getTime() - timestamp.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;

  return timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const categoryColors: Record<Tweet['category'], string> = {
  discipline: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  strength: 'bg-red-500/10 text-red-400 border-red-500/30',
  perseverance: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  leadership: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  mindset: 'bg-green-500/10 text-green-400 border-green-500/30',
  success: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
};

export const TweetCard = ({ tweet }: TweetCardProps) => {
  const { likeTweet, retweetTweet, bookmarkTweet } = useTwitterStore();

  return (
    <article className="border-b border-gray-800 px-4 py-3 hover:bg-gray-900/50 transition-colors cursor-pointer">
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl">
            {tweet.author.avatar}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-1 flex-wrap">
            <span className="font-bold text-white hover:underline truncate">
              {tweet.author.displayName}
            </span>
            {tweet.author.verified && (
              <BadgeCheck className="w-5 h-5 text-blue-400 flex-shrink-0" fill="currentColor" />
            )}
            <span className="text-gray-500 truncate">@{tweet.author.username}</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500 hover:underline">{formatTimeAgo(tweet.timestamp)}</span>
          </div>

          {/* Tweet Text */}
          <p className="text-white text-[15px] leading-relaxed mt-1 whitespace-pre-wrap">
            {tweet.content}
          </p>

          {/* Category Tag */}
          <div className="mt-2">
            <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${categoryColors[tweet.category]}`}>
              #{tweet.category}
            </span>
          </div>

          {/* Engagement Stats */}
          <div className="flex items-center justify-between mt-3 max-w-md">
            {/* Replies */}
            <button className="flex items-center gap-1 text-gray-500 hover:text-blue-400 group transition-colors">
              <div className="p-2 rounded-full group-hover:bg-blue-400/10 transition-colors">
                <MessageCircle className="w-[18px] h-[18px]" />
              </div>
              <span className="text-sm">{formatNumber(tweet.replies)}</span>
            </button>

            {/* Retweets */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                retweetTweet(tweet.id);
              }}
              className={`flex items-center gap-1 group transition-colors ${
                tweet.retweeted ? 'text-green-400' : 'text-gray-500 hover:text-green-400'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                <Repeat2 className="w-[18px] h-[18px]" />
              </div>
              <span className="text-sm">{formatNumber(tweet.retweets)}</span>
            </button>

            {/* Likes */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                likeTweet(tweet.id);
              }}
              className={`flex items-center gap-1 group transition-colors ${
                tweet.liked ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'
              }`}
            >
              <div className="p-2 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <Heart
                  className="w-[18px] h-[18px]"
                  fill={tweet.liked ? 'currentColor' : 'none'}
                />
              </div>
              <span className="text-sm">{formatNumber(tweet.likes)}</span>
            </button>

            {/* Views */}
            <div className="flex items-center gap-1 text-gray-500">
              <div className="p-2">
                <Eye className="w-[18px] h-[18px]" />
              </div>
              <span className="text-sm">{formatNumber(tweet.views)}</span>
            </div>

            {/* Bookmark & Share */}
            <div className="flex items-center gap-0">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  bookmarkTweet(tweet.id);
                }}
                className={`p-2 rounded-full transition-colors ${
                  tweet.bookmarked
                    ? 'text-blue-400'
                    : 'text-gray-500 hover:text-blue-400 hover:bg-blue-400/10'
                }`}
              >
                <Bookmark
                  className="w-[18px] h-[18px]"
                  fill={tweet.bookmarked ? 'currentColor' : 'none'}
                />
              </button>
              <button className="p-2 rounded-full text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors">
                <Share className="w-[18px] h-[18px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
