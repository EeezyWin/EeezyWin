'use client';

import { useState, useEffect } from 'react';
import { MatchingExercise } from '@/types';
import { Button } from '@/components/Button';

interface MatchingProps {
  exercise: MatchingExercise;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

interface MatchedPair {
  leftIndex: number;
  rightIndex: number;
  isCorrect: boolean;
}

export function Matching({ exercise, onAnswer, disabled }: MatchingProps) {
  const [leftSelected, setLeftSelected] = useState<number | null>(null);
  const [rightSelected, setRightSelected] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<MatchedPair[]>([]);
  const [shuffledRight, setShuffledRight] = useState<string[]>([]);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    // Shuffle the right side
    const shuffled = [...exercise.pairs.map((p) => p.right)].sort(() => Math.random() - 0.5);
    setShuffledRight(shuffled);
  }, [exercise]);

  const handleLeftClick = (index: number) => {
    if (hasAnswered || disabled) return;
    if (matchedPairs.some((p) => p.leftIndex === index)) return;

    setLeftSelected(index);

    if (rightSelected !== null) {
      checkMatch(index, rightSelected);
    }
  };

  const handleRightClick = (index: number) => {
    if (hasAnswered || disabled) return;
    if (matchedPairs.some((p) => p.rightIndex === index)) return;

    setRightSelected(index);

    if (leftSelected !== null) {
      checkMatch(leftSelected, index);
    }
  };

  const checkMatch = (leftIdx: number, rightIdx: number) => {
    const leftWord = exercise.pairs[leftIdx].left;
    const rightWord = shuffledRight[rightIdx];
    const correctRight = exercise.pairs[leftIdx].right;
    const isCorrect = rightWord === correctRight;

    const newMatch: MatchedPair = {
      leftIndex: leftIdx,
      rightIndex: rightIdx,
      isCorrect,
    };

    setMatchedPairs([...matchedPairs, newMatch]);
    setLeftSelected(null);
    setRightSelected(null);

    // Check if all pairs are matched
    if (matchedPairs.length + 1 === exercise.pairs.length) {
      const allCorrect = [...matchedPairs, newMatch].every((p) => p.isCorrect);
      setHasAnswered(true);
      setTimeout(() => {
        onAnswer(allCorrect);
      }, 500);
    }
  };

  const getLeftStyle = (index: number) => {
    const match = matchedPairs.find((p) => p.leftIndex === index);
    if (match) {
      return match.isCorrect
        ? 'border-[#58cc02] bg-[#d7ffb8] text-[#58cc02]'
        : 'border-[#ff4b4b] bg-[#ffdfe0] text-[#ff4b4b]';
    }
    if (leftSelected === index) {
      return 'border-[#1cb0f6] bg-[#ddf4ff]';
    }
    return 'border-gray-200 hover:bg-gray-50';
  };

  const getRightStyle = (index: number) => {
    const match = matchedPairs.find((p) => p.rightIndex === index);
    if (match) {
      return match.isCorrect
        ? 'border-[#58cc02] bg-[#d7ffb8] text-[#58cc02]'
        : 'border-[#ff4b4b] bg-[#ffdfe0] text-[#ff4b4b]';
    }
    if (rightSelected === index) {
      return 'border-[#1cb0f6] bg-[#ddf4ff]';
    }
    return 'border-gray-200 hover:bg-gray-50';
  };

  const allCorrect = matchedPairs.length === exercise.pairs.length && matchedPairs.every((p) => p.isCorrect);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-sm text-gray-500 mb-2">{exercise.instruction}</p>
        <p className="text-lg font-bold text-center mb-8">Tap the matching pairs</p>

        <div className="flex gap-8 w-full max-w-lg justify-center">
          {/* Left column */}
          <div className="flex flex-col gap-3">
            {exercise.pairs.map((pair, index) => (
              <button
                key={`left-${index}`}
                onClick={() => handleLeftClick(index)}
                disabled={matchedPairs.some((p) => p.leftIndex === index) || disabled}
                className={`px-6 py-3 rounded-xl border-2 font-medium transition-all min-w-[120px] ${getLeftStyle(index)}`}
              >
                {pair.left}
              </button>
            ))}
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-3">
            {shuffledRight.map((word, index) => (
              <button
                key={`right-${index}`}
                onClick={() => handleRightClick(index)}
                disabled={matchedPairs.some((p) => p.rightIndex === index) || disabled}
                className={`px-6 py-3 rounded-xl border-2 font-medium transition-all min-w-[120px] ${getRightStyle(index)}`}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`p-4 ${hasAnswered ? (allCorrect ? 'bg-[#d7ffb8]' : 'bg-[#ffdfe0]') : 'bg-white'}`}>
        {hasAnswered && (
          <div className="mb-3">
            {allCorrect ? (
              <p className="text-[#58cc02] font-bold text-lg">Perfect!</p>
            ) : (
              <p className="text-[#ff4b4b] font-bold text-lg">
                {matchedPairs.filter((p) => p.isCorrect).length} of {exercise.pairs.length} correct
              </p>
            )}
          </div>
        )}
        {hasAnswered && (
          <Button
            variant={allCorrect ? 'primary' : 'danger'}
            fullWidth
            size="lg"
            disabled
          >
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}
