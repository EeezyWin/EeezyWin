'use client';

import { useStore } from '@/store/useStore';
import { Lesson } from '@/types';
import { Lock, Check, Star } from 'lucide-react';

interface LessonCardProps {
  lesson: Lesson;
  courseId: string;
  unitIndex: number;
  lessonIndex: number;
  onClick: () => void;
}

export function LessonCard({ lesson, courseId, unitIndex, lessonIndex, onClick }: LessonCardProps) {
  const { isLessonUnlocked, getLessonProgress } = useStore();

  const isUnlocked = isLessonUnlocked(courseId, unitIndex, lessonIndex);
  const progress = getLessonProgress(lesson.id);
  const isCompleted = progress?.completed ?? false;
  const isPerfect = progress?.perfectScore ?? false;

  const getStatusStyles = () => {
    if (!isUnlocked) {
      return 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed';
    }
    if (isPerfect) {
      return 'bg-[#ffc800] border-[#e6b400] text-white cursor-pointer hover:scale-105';
    }
    if (isCompleted) {
      return 'bg-[#58cc02] border-[#46a302] text-white cursor-pointer hover:scale-105';
    }
    return 'bg-white border-[#e5e5e5] text-gray-700 cursor-pointer hover:scale-105 hover:border-[#58cc02]';
  };

  const getIcon = () => {
    if (!isUnlocked) {
      return <Lock className="w-8 h-8" />;
    }
    if (isPerfect) {
      return <Star className="w-8 h-8 fill-current" />;
    }
    if (isCompleted) {
      return <Check className="w-8 h-8" />;
    }
    return <Star className="w-8 h-8" />;
  };

  return (
    <button
      onClick={isUnlocked ? onClick : undefined}
      disabled={!isUnlocked}
      className={`relative flex flex-col items-center justify-center w-20 h-20 rounded-full border-4 transition-transform duration-200 shadow-lg ${getStatusStyles()}`}
    >
      {getIcon()}
      {isUnlocked && (
        <div className="absolute -bottom-6 text-xs font-bold text-gray-700 whitespace-nowrap">
          {lesson.title}
        </div>
      )}
    </button>
  );
}
