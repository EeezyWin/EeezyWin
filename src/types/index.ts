export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  hearts: number;
  gems: number;
  lastPracticeDate: string | null;
  createdAt: string;
  achievements: string[];
  currentCourseId: string | null;
}

export interface Course {
  id: string;
  name: string;
  fromLanguage: string;
  toLanguage: string;
  flag: string;
  description: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  exercises: Exercise[];
  order: number;
  type: 'skill' | 'checkpoint' | 'bonus';
}

export type ExerciseType =
  | 'multiple-choice'
  | 'translation'
  | 'fill-blank'
  | 'matching'
  | 'listening'
  | 'speaking';

export interface BaseExercise {
  id: string;
  type: ExerciseType;
  instruction: string;
}

export interface MultipleChoiceExercise extends BaseExercise {
  type: 'multiple-choice';
  question: string;
  options: string[];
  correctAnswer: string;
  audioUrl?: string;
}

export interface TranslationExercise extends BaseExercise {
  type: 'translation';
  sentence: string;
  correctTranslations: string[];
  wordBank: string[];
  direction: 'toTarget' | 'fromTarget';
}

export interface FillBlankExercise extends BaseExercise {
  type: 'fill-blank';
  sentence: string;
  blank: string;
  options: string[];
  correctAnswer: string;
}

export interface MatchingExercise extends BaseExercise {
  type: 'matching';
  pairs: { left: string; right: string }[];
}

export interface ListeningExercise extends BaseExercise {
  type: 'listening';
  audioText: string;
  options: string[];
  correctAnswer: string;
}

export type Exercise =
  | MultipleChoiceExercise
  | TranslationExercise
  | FillBlankExercise
  | MatchingExercise
  | ListeningExercise;

export interface Progress {
  lessonId: string;
  completed: boolean;
  perfectScore: boolean;
  lastAttempt: string | null;
  bestScore: number;
  attempts: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: {
    type: 'xp' | 'streak' | 'lessons' | 'perfect';
    value: number;
  };
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  avatar: string;
  xp: number;
  rank: number;
}

// Twitter Types
export interface TwitterUser {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  verified: boolean;
  followers: number;
  following: number;
}

export interface Tweet {
  id: string;
  author: TwitterUser;
  content: string;
  timestamp: Date;
  likes: number;
  retweets: number;
  replies: number;
  views: number;
  liked: boolean;
  retweeted: boolean;
  bookmarked: boolean;
  category: 'discipline' | 'strength' | 'perseverance' | 'leadership' | 'mindset' | 'success';
}
