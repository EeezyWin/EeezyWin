'use client';

import { useState } from 'react';
import { TranslationExercise } from '@/types';
import { Button } from '@/components/Button';
import { X } from 'lucide-react';

interface TranslationProps {
  exercise: TranslationExercise;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export function Translation({ exercise, onAnswer, disabled }: TranslationProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([...exercise.wordBank]);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSelectWord = (word: string, index: number) => {
    if (hasAnswered || disabled) return;

    setSelectedWords([...selectedWords, word]);
    const newAvailable = [...availableWords];
    newAvailable.splice(index, 1);
    setAvailableWords(newAvailable);
  };

  const handleRemoveWord = (word: string, index: number) => {
    if (hasAnswered || disabled) return;

    const newSelected = [...selectedWords];
    newSelected.splice(index, 1);
    setSelectedWords(newSelected);
    setAvailableWords([...availableWords, word]);
  };

  const handleCheck = () => {
    if (selectedWords.length === 0 || hasAnswered) return;

    const answer = selectedWords.join(' ');
    const correct = exercise.correctTranslations.some(
      (translation) => translation.toLowerCase() === answer.toLowerCase()
    );

    setIsCorrect(correct);
    setHasAnswered(true);
    onAnswer(correct);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-sm text-gray-500 mb-2">{exercise.instruction}</p>
        <h2 className="text-2xl font-bold text-center mb-8">{exercise.sentence}</h2>

        {/* Answer area */}
        <div className="w-full max-w-lg min-h-[60px] p-3 border-b-2 border-gray-300 mb-8 flex flex-wrap gap-2">
          {selectedWords.length === 0 ? (
            <span className="text-gray-400 italic">Tap the words to form a sentence</span>
          ) : (
            selectedWords.map((word, index) => (
              <button
                key={index}
                onClick={() => handleRemoveWord(word, index)}
                disabled={hasAnswered || disabled}
                className={`px-4 py-2 rounded-xl border-2 font-medium transition-all flex items-center gap-2 ${
                  hasAnswered
                    ? isCorrect
                      ? 'border-[#58cc02] bg-[#d7ffb8]'
                      : 'border-[#ff4b4b] bg-[#ffdfe0]'
                    : 'border-gray-300 bg-white hover:bg-gray-50'
                }`}
              >
                {word}
                {!hasAnswered && <X className="w-4 h-4 text-gray-400" />}
              </button>
            ))
          )}
        </div>

        {/* Word bank */}
        <div className="w-full max-w-lg flex flex-wrap gap-2 justify-center">
          {availableWords.map((word, index) => (
            <button
              key={index}
              onClick={() => handleSelectWord(word, index)}
              disabled={hasAnswered || disabled}
              className="px-4 py-2 rounded-xl border-2 border-gray-200 bg-white font-medium hover:bg-gray-50 transition-all shadow-[0_2px_0_#e5e5e5] active:shadow-none active:translate-y-[2px]"
            >
              {word}
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
                  Correct answer: {exercise.correctTranslations[0]}
                </p>
              </div>
            )}
          </div>
        )}
        <Button
          onClick={handleCheck}
          disabled={selectedWords.length === 0 || disabled}
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
