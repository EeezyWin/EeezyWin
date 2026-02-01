'use client';

interface ProgressBarProps {
  progress: number;
  color?: 'green' | 'blue' | 'red' | 'yellow';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

export function ProgressBar({
  progress,
  color = 'green',
  size = 'md',
  showLabel = false,
  animated = true,
}: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const colors = {
    green: 'bg-[#58cc02]',
    blue: 'bg-[#1cb0f6]',
    red: 'bg-[#ff4b4b]',
    yellow: 'bg-[#ffc800]',
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${colors[color]} ${sizes[size]} rounded-full ${animated ? 'transition-all duration-500' : ''}`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
      {showLabel && (
        <div className="text-center text-sm text-gray-600 mt-1">
          {Math.round(clampedProgress)}%
        </div>
      )}
    </div>
  );
}
