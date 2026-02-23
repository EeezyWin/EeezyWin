"use client";

import { ExtractedKPI, BenchmarkComparison } from "@/types";
import { CATEGORY_COLORS, CATEGORY_LABELS } from "@/data/kpi-taxonomy";
import { HealthIndicator } from "@/components/HealthIndicator";
import { BenchmarkBar } from "@/components/BenchmarkBar";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { useState } from "react";

interface KPICardProps {
  kpi: ExtractedKPI;
  benchmark?: BenchmarkComparison | null;
  index: number;
}

export function KPICard({ kpi, benchmark, index }: KPICardProps) {
  const [expanded, setExpanded] = useState(false);
  const categoryColor = CATEGORY_COLORS[kpi.category] || "#6b7280";
  const categoryLabel = CATEGORY_LABELS[kpi.category] || kpi.category;

  const rating = benchmark?.rating ?? kpi.healthIndicator;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-4 transition-all duration-200 hover:shadow-md animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide text-white"
              style={{ backgroundColor: categoryColor }}
            >
              {categoryLabel}
            </span>
            {!kpi.gaap && (
              <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700">
                Non-GAAP
              </span>
            )}
            {kpi.confidence !== "high" && (
              <span
                className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  kpi.confidence === "medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {kpi.confidence} confidence
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">
            {kpi.standardizedName}
          </h3>
          {kpi.name !== kpi.standardizedName && (
            <p className="text-xs text-gray-400 mt-0.5">
              As labeled: &ldquo;{kpi.name}&rdquo;
            </p>
          )}
        </div>

        <div className="text-right flex-shrink-0">
          <div className="flex items-center gap-2">
            <HealthIndicator rating={rating} />
            <span className="text-lg font-bold text-gray-900">
              {kpi.formattedValue}
            </span>
          </div>
          {kpi.yoyChangePct !== undefined && kpi.yoyChangePct !== null && (
            <span
              className={`text-xs font-medium ${
                kpi.yoyChangePct >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {kpi.yoyChangePct >= 0 ? "+" : ""}
              {kpi.yoyChangePct.toFixed(1)}% YoY
            </span>
          )}
          {kpi.period && (
            <p className="text-[10px] text-gray-400 mt-0.5">{kpi.period}</p>
          )}
        </div>
      </div>

      {/* Benchmark bar */}
      {benchmark && (
        <div className="mt-3">
          <BenchmarkBar comparison={benchmark} />
        </div>
      )}

      {/* Expandable explanation */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-gray-700 transition-colors w-full text-left"
      >
        <Info size={12} />
        <span>{expanded ? "Hide" : "What does this mean?"}</span>
        {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {expanded && (
        <p className="mt-2 text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-3">
          {kpi.explanation}
        </p>
      )}
    </div>
  );
}
