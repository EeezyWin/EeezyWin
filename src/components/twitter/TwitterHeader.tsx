'use client';

import { Settings, Sparkles } from 'lucide-react';

interface TwitterHeaderProps {
  activeTab: 'for-you' | 'following';
  onTabChange: (tab: 'for-you' | 'following') => void;
}

export const TwitterHeader = ({ activeTab, onTabChange }: TwitterHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-gray-800">
      {/* Main Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <h1 className="text-xl font-bold text-white">Masculine Wisdom</h1>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-800 transition-colors">
          <Settings className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex">
        <button
          onClick={() => onTabChange('for-you')}
          className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
            activeTab === 'for-you' ? 'text-white' : 'text-gray-500 hover:bg-gray-900'
          }`}
        >
          <span className="flex items-center justify-center gap-1">
            <Sparkles className="w-4 h-4" />
            For You
          </span>
          {activeTab === 'for-you' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => onTabChange('following')}
          className={`flex-1 py-4 text-center font-semibold transition-colors relative ${
            activeTab === 'following' ? 'text-white' : 'text-gray-500 hover:bg-gray-900'
          }`}
        >
          Following
          {activeTab === 'following' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-blue-400 rounded-full" />
          )}
        </button>
      </div>
    </header>
  );
};
