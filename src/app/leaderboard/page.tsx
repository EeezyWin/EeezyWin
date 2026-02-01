'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Navbar, Card, Avatar } from '@/components';
import { leaderboardData } from '@/data/courses';
import { Trophy } from 'lucide-react';

export default function LeaderboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Create combined leaderboard with user
  const leaderboard = useMemo(() => {
    if (!user) return leaderboardData;

    const userEntry = {
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      xp: user.xp,
      rank: 0,
    };

    // Combine and sort
    const combined = [...leaderboardData, userEntry].sort((a, b) => b.xp - a.xp);

    // Update ranks
    return combined.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  }, [user]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const userRank = leaderboard.find((e) => e.userId === user.id)?.rank || 0;

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-[#ffc800] text-white';
      case 2:
        return 'bg-[#c0c0c0] text-white';
      case 3:
        return 'bg-[#cd7f32] text-white';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <main className="pt-16 pb-20 md:pb-4 md:pl-64">
        <div className="max-w-2xl mx-auto p-4">
          {/* Header */}
          <div className="text-center mb-6">
            <Trophy className="w-12 h-12 text-[#ffc800] mx-auto mb-2" />
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-gray-500">Weekly XP rankings</p>
          </div>

          {/* User's rank card */}
          <Card variant="elevated" className="mb-6 bg-[#ddf4ff] border-2 border-[#1cb0f6]">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${getRankStyle(userRank)}`}>
                {userRank}
              </div>
              <Avatar fallback={user.username} size="md" />
              <div className="flex-1">
                <div className="font-bold">{user.username}</div>
                <div className="text-sm text-gray-500">You</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#1cb0f6]">{user.xp} XP</div>
              </div>
            </div>
          </Card>

          {/* Leaderboard list */}
          <Card variant="elevated">
            <div className="space-y-3">
              {leaderboard.map((entry, index) => {
                const isCurrentUser = entry.userId === user.id;
                const rankIcon = getRankIcon(entry.rank);

                return (
                  <div
                    key={entry.userId}
                    className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${
                      isCurrentUser ? 'bg-[#ddf4ff]' : index < 3 ? 'bg-gray-50' : ''
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getRankStyle(entry.rank)}`}>
                      {rankIcon || entry.rank}
                    </div>
                    <Avatar fallback={entry.username} size="md" />
                    <div className="flex-1">
                      <div className="font-bold flex items-center gap-2">
                        {entry.username}
                        {isCurrentUser && (
                          <span className="text-xs bg-[#1cb0f6] text-white px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${isCurrentUser ? 'text-[#1cb0f6]' : 'text-gray-700'}`}>
                        {entry.xp} XP
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Rankings reset every week. Keep practicing to climb the leaderboard!</p>
          </div>
        </div>
      </main>
    </div>
  );
}
