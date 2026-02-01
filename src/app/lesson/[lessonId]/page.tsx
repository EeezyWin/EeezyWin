'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ProgressBar } from '@/components';
import { ExerciseRenderer } from '@/components/exercises';
import { Exercise, Lesson } from '@/types';
import { X, Heart } from 'lucide-react';

export default function LessonPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const { user, isAuthenticated, courses, completeLesson, useHeart } = useStore();

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [hearts, setHearts] = useState(user?.hearts || 5);
  const [isFinished, setIsFinished] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    // Find the lesson
    for (const course of courses) {
      for (const unit of course.units) {
        const foundLesson = unit.lessons.find((l) => l.id === lessonId);
        if (foundLesson) {
          setLesson(foundLesson);
          // Shuffle exercises
          const shuffled = [...foundLesson.exercises].sort(() => Math.random() - 0.5);
          setExercises(shuffled);
          return;
        }
      }
    }

    // Lesson not found
    router.push('/learn');
  }, [isAuthenticated, lessonId, courses, router]);

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      const heartUsed = useHeart();
      if (heartUsed) {
        setHearts((prev) => prev - 1);
      }
    }

    // Move to next exercise after a delay
    setTimeout(() => {
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
      } else {
        setIsFinished(true);
        setShowResults(true);
      }
    }, 1500);
  }, [currentExerciseIndex, exercises.length, useHeart]);

  const handleClose = () => {
    router.push('/learn');
  };

  const handleFinish = () => {
    if (!lesson) return;

    const score = Math.round((correctAnswers / exercises.length) * 100);
    const xpEarned = Math.round((score / 100) * lesson.xpReward);

    completeLesson(lesson.id, score, xpEarned);
    router.push('/learn');
  };

  if (!isAuthenticated || !lesson || exercises.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100;
  const score = Math.round((correctAnswers / exercises.length) * 100);

  if (showResults) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="mb-6">
            {score >= 80 ? (
              <div className="text-6xl mb-4">🎉</div>
            ) : score >= 50 ? (
              <div className="text-6xl mb-4">👍</div>
            ) : (
              <div className="text-6xl mb-4">💪</div>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-2">
            {score >= 80 ? 'Amazing!' : score >= 50 ? 'Good job!' : 'Keep practicing!'}
          </h1>

          <p className="text-gray-600 mb-8">
            You completed the lesson with {score}% accuracy
          </p>

          <div className="bg-gray-100 rounded-2xl p-6 mb-6">
            <div className="flex justify-around">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#58cc02]">{correctAnswers}</div>
                <div className="text-sm text-gray-500">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ff4b4b]">
                  {exercises.length - correctAnswers}
                </div>
                <div className="text-sm text-gray-500">Incorrect</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#ffc800]">
                  +{Math.round((score / 100) * lesson.xpReward)}
                </div>
                <div className="text-sm text-gray-500">XP Earned</div>
              </div>
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full bg-[#58cc02] hover:bg-[#4caf00] text-white font-bold py-4 px-6 rounded-xl shadow-[0_4px_0_#46a302] active:shadow-[0_2px_0_#46a302] active:translate-y-[2px] transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={handleClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-6 h-6 text-gray-400" />
        </button>

        <div className="flex-1 mx-4">
          <ProgressBar progress={progress} color="green" size="md" />
        </div>

        <div className="flex items-center gap-1 text-[#ff4b4b]">
          <Heart className="w-6 h-6 fill-current" />
          <span className="font-bold">{hearts}</span>
        </div>
      </header>

      {/* Exercise Content */}
      <main className="flex-1 flex flex-col">
        <ExerciseRenderer
          key={exercises[currentExerciseIndex].id}
          exercise={exercises[currentExerciseIndex]}
          onAnswer={handleAnswer}
          disabled={isFinished}
        />
      </main>
    </div>
  );
}
