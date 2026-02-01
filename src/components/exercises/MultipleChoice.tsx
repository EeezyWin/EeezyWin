'use client';

import { useState } from 'react';
import { MultipleChoiceExercise } from '@/types';
import { Button } from '@/components/Button';

interface MultipleChoiceProps {
  exercise: MultipleChoiceExercise;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export function MultipleChoice({ exercise, onAnswer, disabled }: MultipleChoiceProps) {
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
        <h2 className="text-2xl font-bold text-center mb-8">{exercise.question}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
          {exercise.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(option)}
              disabled={hasAnswered || disabled}
              className={`p-4 rounded-xl border-2 text-left font-medium transition-all ${getOptionStyle(option)} ${
                hasAnswered ? 'cursor-default' : 'cursor-pointer'
              }`}
            >
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg border-2 border-current text-sm mr-3">
                {index + 1}
              </span>
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
