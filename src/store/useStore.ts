'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Progress, Course } from '@/types';
import { courses } from '@/data/courses';

interface GameState {
  user: User | null;
  isAuthenticated: boolean;
  progress: Record<string, Progress>;
  courses: Course[];

  // Auth actions
  login: (username: string, email: string) => void;
  logout: () => void;

  // Progress actions
  completeLesson: (lessonId: string, score: number, xpEarned: number) => void;
  getLessonProgress: (lessonId: string) => Progress | undefined;
  isLessonUnlocked: (courseId: string, unitIndex: number, lessonIndex: number) => boolean;

  // User actions
  updateStreak: () => void;
  addXp: (amount: number) => void;
  useHeart: () => boolean;
  refillHearts: () => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  selectCourse: (courseId: string) => void;

  // Achievement actions
  unlockAchievement: (achievementId: string) => void;
  checkAchievements: () => void;
}

const INITIAL_HEARTS = 5;
const MAX_HEARTS = 5;
const XP_PER_LEVEL = 100;
const HEART_COST_GEMS = 350;

export const useStore = create<GameState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      progress: {},
      courses: courses,

      login: (username: string, email: string) => {
        const avatarIndex = Math.floor(Math.random() * 6) + 1;
        set({
          user: {
            id: crypto.randomUUID(),
            username,
            email,
            avatar: `/avatars/avatar${avatarIndex}.svg`,
            xp: 0,
            level: 1,
            streak: 0,
            hearts: INITIAL_HEARTS,
            gems: 500,
            lastPracticeDate: null,
            createdAt: new Date().toISOString(),
            achievements: [],
            currentCourseId: null,
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          progress: {},
        });
      },

      completeLesson: (lessonId: string, score: number, xpEarned: number) => {
        const { progress, user } = get();
        const existing = progress[lessonId];
        const isPerfect = score === 100;

        set({
          progress: {
            ...progress,
            [lessonId]: {
              lessonId,
              completed: true,
              perfectScore: isPerfect || (existing?.perfectScore ?? false),
              lastAttempt: new Date().toISOString(),
              bestScore: Math.max(score, existing?.bestScore ?? 0),
              attempts: (existing?.attempts ?? 0) + 1,
            },
          },
        });

        get().addXp(xpEarned);
        get().updateStreak();
        get().checkAchievements();
      },

      getLessonProgress: (lessonId: string) => {
        return get().progress[lessonId];
      },

      isLessonUnlocked: (courseId: string, unitIndex: number, lessonIndex: number) => {
        const { progress, courses } = get();
        const course = courses.find((c) => c.id === courseId);
        if (!course) return false;

        // First lesson of first unit is always unlocked
        if (unitIndex === 0 && lessonIndex === 0) return true;

        // Check if previous lesson is completed
        if (lessonIndex > 0) {
          const prevLesson = course.units[unitIndex].lessons[lessonIndex - 1];
          return progress[prevLesson.id]?.completed ?? false;
        }

        // First lesson of a unit requires last lesson of previous unit
        if (unitIndex > 0) {
          const prevUnit = course.units[unitIndex - 1];
          const lastLesson = prevUnit.lessons[prevUnit.lessons.length - 1];
          return progress[lastLesson.id]?.completed ?? false;
        }

        return false;
      },

      updateStreak: () => {
        const { user } = get();
        if (!user) return;

        const today = new Date().toDateString();
        const lastPractice = user.lastPracticeDate
          ? new Date(user.lastPracticeDate).toDateString()
          : null;

        if (lastPractice === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();

        let newStreak = user.streak;
        if (lastPractice === yesterdayStr) {
          newStreak += 1;
        } else if (lastPractice !== today) {
          newStreak = 1;
        }

        set({
          user: {
            ...user,
            streak: newStreak,
            lastPracticeDate: new Date().toISOString(),
          },
        });
      },

      addXp: (amount: number) => {
        const { user } = get();
        if (!user) return;

        const newXp = user.xp + amount;
        const newLevel = Math.floor(newXp / XP_PER_LEVEL) + 1;

        set({
          user: {
            ...user,
            xp: newXp,
            level: newLevel,
          },
        });
      },

      useHeart: () => {
        const { user } = get();
        if (!user || user.hearts <= 0) return false;

        set({
          user: {
            ...user,
            hearts: user.hearts - 1,
          },
        });
        return true;
      },

      refillHearts: () => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            hearts: MAX_HEARTS,
          },
        });
      },

      addGems: (amount: number) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            gems: user.gems + amount,
          },
        });
      },

      spendGems: (amount: number) => {
        const { user } = get();
        if (!user || user.gems < amount) return false;

        set({
          user: {
            ...user,
            gems: user.gems - amount,
          },
        });
        return true;
      },

      selectCourse: (courseId: string) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            currentCourseId: courseId,
          },
        });
      },

      unlockAchievement: (achievementId: string) => {
        const { user } = get();
        if (!user || user.achievements.includes(achievementId)) return;

        set({
          user: {
            ...user,
            achievements: [...user.achievements, achievementId],
          },
        });
      },

      checkAchievements: () => {
        const { user, progress, unlockAchievement } = get();
        if (!user) return;

        const completedLessons = Object.values(progress).filter((p) => p.completed).length;
        const perfectLessons = Object.values(progress).filter((p) => p.perfectScore).length;

        // XP achievements
        if (user.xp >= 100) unlockAchievement('xp_100');
        if (user.xp >= 500) unlockAchievement('xp_500');
        if (user.xp >= 1000) unlockAchievement('xp_1000');

        // Streak achievements
        if (user.streak >= 3) unlockAchievement('streak_3');
        if (user.streak >= 7) unlockAchievement('streak_7');
        if (user.streak >= 30) unlockAchievement('streak_30');

        // Lesson achievements
        if (completedLessons >= 1) unlockAchievement('lessons_1');
        if (completedLessons >= 10) unlockAchievement('lessons_10');
        if (completedLessons >= 50) unlockAchievement('lessons_50');

        // Perfect score achievements
        if (perfectLessons >= 1) unlockAchievement('perfect_1');
        if (perfectLessons >= 10) unlockAchievement('perfect_10');
      },
    }),
    {
      name: 'duolingo-clone-storage',
    }
  )
);
