"use client";

import { BenchmarkComparison } from "@/types";

interface BenchmarkBarProps {
  comparison: BenchmarkComparison;
}

export function BenchmarkBar({ comparison }: BenchmarkBarProps) {
  const { value, industryMedian, industryP25, industryP75, percentileEstimate, rating } =
    comparison;

  // Determine the display range
  const rangeMin = Math.min(value, industryP25) * 0.8;
  const rangeMax = Math.max(value, industryP75) * 1.2;
  const range = rangeMax - rangeMin || 1;

  const p25Pos = ((industryP25 - rangeMin) / range) * 100;
  const p75Pos = ((industryP75 - rangeMin) / range) * 100;
  const medianPos = ((industryMedian - rangeMin) / range) * 100;
  const valuePos = Math.max(2, Math.min(98, ((value - rangeMin) / range) * 100));

  const ratingColors = {
    strong: "bg-emerald-500",
    typical: "bg-amber-400",
    concerning: "bg-red-500",
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>vs. Industry</span>
        <span>Percentile: {percentileEstimate}th</span>
      </div>
      <div className="relative h-3 bg-gray-100 rounded-full overflow-visible">
        {/* IQR band */}
        <div
          className="absolute top-0 h-full bg-gray-200 rounded-full"
          style={{
            left: `${Math.max(0, p25Pos)}%`,
            width: `${Math.max(1, p75Pos - p25Pos)}%`,
          }}
        />

        {/* Median line */}
        <div
          className="absolute top-0 w-0.5 h-full bg-gray-400"
          style={{ left: `${Math.max(0, Math.min(100, medianPos))}%` }}
        />

        {/* Value marker */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full ${ratingColors[rating]} ring-2 ring-white shadow-sm`}
          style={{ left: `${valuePos}%`, transform: "translate(-50%, -50%)" }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>P25: {industryP25}</span>
        <span>Median: {industryMedian}</span>
        <span>P75: {industryP75}</span>
      </div>
    </div>
  );
}
