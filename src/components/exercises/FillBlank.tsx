'use client';

import { useState } from 'react';
import { FillBlankExercise } from '@/types';
import { Button } from '@/components/Button';

interface FillBlankProps {
  exercise: FillBlankExercise;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export function FillBlank({ exercise, onAnswer, disabled }: FillBlankProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelect = (option: string) => {
    if (hasAnswered || disabled) return;
    setSelectedOption(option);
  };

  const handleCheck = () => {
    if (!selectedOption || hasAnswered) return;

    const correct = selectedOption === exercise.correctAnswer;
    setIsCorrect(correct);
    setHasAnswered(true);
    onAnswer(correct);
  };

  const renderSentenceWithBlank = () => {
    const parts = exercise.sentence.split('___');
    return (
      <div className="text-2xl font-bold text-center mb-8 flex items-center justify-center flex-wrap gap-2">
        {parts[0]}
        <span
          className={`px-4 py-2 min-w-[100px] border-b-4 mx-2 ${
            hasAnswered
              ? isCorrect
                ? 'border-[#58cc02] text-[#58cc02]'
                : 'border-[#ff4b4b] text-[#ff4b4b]'
              : selectedOption
              ? 'border-[#1cb0f6] text-[#1cb0f6]'
              : 'border-gray-300 text-gray-400'
          }`}
        >
          {selectedOption || '_____'}
        </span>
        {parts[1]}
      </div>
    );
  };

  const getOptionStyle = (option: string) => {
    if (!hasAnswered) {
      return selectedOption === option
        ? 'border-[#1cb0f6] bg-[#ddf4ff]'
        : 'border-gray-200 hover:bg-gray-50';
    }

    if (option === exercise.correctAnswer) {
      return 'border-[#58cc02] bg-[#d7ffb8]';
    }

    if (option === selectedOption && !isCorrect) {
      return 'border-[#ff4b4b] bg-[#ffdfe0]';
    }

    return 'border-gray-200 opacity-50';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-sm text-gray-500 mb-2">{exercise.instruction}</p>
        {renderSentenceWithBlank()}

        <div className="flex flex-wrap gap-3 justify-center w-full max-w-lg">
          {exercise.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={hasAnswered || disabled}
              className={`px-6 py-3 rounded-xl border-2 font-medium transition-all ${getOptionStyle(option)} ${
                hasAnswered ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className={`p-4 ${hasAnswered ? (isCorrect ? 'bg-[#d7ffb8]' : 'bg-[#ffdfe0]') : 'bg-white'}`}>
        {hasAnswered && (
          <div className="mb-3">
            {isCorrect ? (
              <p className="text-[#58cc02] font-bold text-lg">Correct!</p>
            ) : (
              <div>
                <p className="text-[#ff4b4b] font-bold text-lg">Incorrect!</p>
                <p className="text-[#ff4b4b] text-sm">
                  Correct answer: {exercise.correctAnswer}
                </p>
              </div>
            )}
          </div>
        )}
        <Button
          onClick={handleCheck}
          disabled={!selectedOption || disabled}
          variant={hasAnswered ? (isCorrect ? 'primary' : 'danger') : 'primary'}
          fullWidth
          size="lg"
        >
          {hasAnswered ? 'Continue' : 'Check'}
        </Button>
      </div>
    </div>
  );
}
