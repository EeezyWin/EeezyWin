'use client';

import { Exercise } from '@/types';
import { MultipleChoice } from './MultipleChoice';
import { Translation } from './Translation';
import { FillBlank } from './FillBlank';
import { Matching } from './Matching';

interface ExerciseRendererProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean) => void;
  disabled?: boolean;
}

export function ExerciseRenderer({ exercise, onAnswer, disabled }: ExerciseRendererProps) {
  switch (exercise.type) {
    case 'multiple-choice':
      return <MultipleChoice exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    case 'translation':
      return <Translation exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    case 'fill-blank':
      return <FillBlank exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    case 'matching':
      return <Matching exercise={exercise} onAnswer={onAnswer} disabled={disabled} />;
    default:
      return <div className="p-4 text-center">Unknown exercise type</div>;
  }
}

export { MultipleChoice, Translation, FillBlank, Matching };
