'use client';

import { Unit } from '@/types';

interface UnitHeaderProps {
  unit: Unit;
  index: number;
}

export function UnitHeader({ unit, index }: UnitHeaderProps) {
  const colors = [
    'bg-[#58cc02]',
    'bg-[#ce82ff]',
    'bg-[#1cb0f6]',
    'bg-[#ff9600]',
    'bg-[#ff4b4b]',
  ];

  return (
    <div className={`${colors[index % colors.length]} rounded-2xl p-4 text-white mb-4`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide opacity-80">
            Unit {index + 1}
          </h3>
          <h2 className="text-xl font-bold">{unit.title}</h2>
          <p className="text-sm opacity-80">{unit.description}</p>
        </div>
        <div className="bg-white/20 rounded-xl px-3 py-2">
          <span className="text-sm font-bold">{unit.lessons.length} lessons</span>
        </div>
      </div>
    </div>
  );
}
