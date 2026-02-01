'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Navbar, Card, Avatar, ProgressBar } from '@/components';
import { achievements } from '@/data/courses';
import { Flame, Gem, Heart, Trophy, Target, Calendar, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, progress, logout } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const completedLessons = Object.values(progress).filter((p) => p.completed).length;
  const perfectLessons = Object.values(progress).filter((p) => p.perfectScore).length;
  const xpToNextLevel = 100 - (user.xp % 100);
  const levelProgress = (user.xp % 100);

  const unlockedAchievements = achievements.filter((a) =>
    user.achievements.includes(a.id)
  );

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      <main className="pt-16 pb-20 md:pb-4 md:pl-64">
        <div className="max-w-2xl mx-auto p-4">
          {/* Profile Header */}
          <Card variant="elevated" className="mb-6">
            <div className="flex items-center gap-4">
              <Avatar fallback={user.username} size="xl" />
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Level {user.level}</span>
                    <span className="text-gray-400">{xpToNextLevel} XP to next level</span>
                  </div>
                  <ProgressBar progress={levelProgress} color="blue" size="sm" />
                </div>
              </div>
            </div>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card variant="outline" className="text-center">
              <div className="text-[#ff9600] mb-2">
                <Flame className="w-8 h-8 mx-auto fill-current" />
              </div>
              <div className="text-2xl font-bold">{user.streak}</div>
              <div className="text-xs text-gray-500 uppercase">Day Streak</div>
            </Card>

            <Card variant="outline" className="text-center">
              <div className="text-[#ffc800] mb-2">
                <Trophy className="w-8 h-8 mx-auto" />
              </div>
              <div className="text-2xl font-bold">{user.xp}</div>
              <div className="text-xs text-gray-500 uppercase">Total XP</div>
            </Card>

            <Card variant="outline" className="text-center">
              <div className="text-[#ff4b4b] mb-2">
                <Heart className="w-8 h-8 mx-auto fill-current" />
              </div>
              <div className="text-2xl font-bold">{user.hearts}</div>
              <div className="text-xs text-gray-500 uppercase">Hearts</div>
            </Card>

            <Card variant="outline" className="text-center">
              <div className="text-[#1cb0f6] mb-2">
                <Gem className="w-8 h-8 mx-auto fill-current" />
              </div>
              <div className="text-2xl font-bold">{user.gems}</div>
              <div className="text-xs text-gray-500 uppercase">Gems</div>
            </Card>
          </div>

          {/* Progress Stats */}
          <Card variant="elevated" className="mb-6">
            <h2 className="text-lg font-bold mb-4">Progress</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#58cc02]/10 flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#58cc02]" />
                </div>
                <div>
                  <div className="text-xl font-bold">{completedLessons}</div>
                  <div className="text-sm text-gray-500">Lessons Completed</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#ffc800]/10 flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
                <div>
                  <div className="text-xl font-bold">{perfectLessons}</div>
                  <div className="text-sm text-gray-500">Perfect Scores</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Achievements */}
          <Card variant="elevated" className="mb-6">
            <h2 className="text-lg font-bold mb-4">
              Achievements ({unlockedAchievements.length}/{achievements.length})
            </h2>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {achievements.map((achievement) => {
                const isUnlocked = user.achievements.includes(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                      isUnlocked
                        ? 'bg-[#ffc800]/10'
                        : 'bg-gray-100 opacity-40 grayscale'
                    }`}
                  >
                    <span className="text-3xl mb-1">{achievement.icon}</span>
                    <span className="text-xs font-medium text-center">
                      {achievement.name}
                    </span>
                    <span className="text-[10px] text-gray-500 text-center">
                      {achievement.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Member Since */}
          <Card variant="outline" className="mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <span className="text-gray-500">Member since </span>
                <span className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>
          </Card>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-4 text-[#ff4b4b] font-bold rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </main>
    </div>
  );
}
