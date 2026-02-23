"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { KPICard } from "@/components/KPICard";
import { Button } from "@/components/ui/Button";
import { findBestIndustryMatch } from "@/data/benchmarks";
import { compareKPIToBenchmark, generateBenchmarkSummary } from "@/lib/benchmark-engine";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "@/data/kpi-taxonomy";
import { BenchmarkComparison, ExtractedKPI, KPICategory } from "@/types";
import {
  ArrowLeft,
  Building2,
  Calendar,
  FileText,
  TrendingUp,
  Share2,
} from "lucide-react";
import { Suspense } from "react";

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { getScanById } = useStore();

  const scanId = searchParams.get("id");
  const scan = scanId ? getScanById(scanId) : null;

  if (!scan) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900">
            Scan not found
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            This scan may have been removed from history.
          </p>
          <Button
            variant="primary"
            className="mt-4"
            onClick={() => router.push("/scan")}
          >
            New Scan
          </Button>
        </div>
      </div>
    );
  }

  // Find industry benchmarks
  const industryBenchmark = findBestIndustryMatch(scan.industry || scan.sector || "");

  // Compute benchmark comparisons for each KPI
  const benchmarkMap = new Map<string, BenchmarkComparison>();
  if (industryBenchmark) {
    for (const kpi of scan.kpis) {
      const comp = compareKPIToBenchmark(kpi, industryBenchmark);
      if (comp) {
        benchmarkMap.set(kpi.standardizedName, comp);
      }
    }
  }

  const benchmarkSummary =
    industryBenchmark && benchmarkMap.size > 0
      ? generateBenchmarkSummary(
          Array.from(benchmarkMap.values()),
          industryBenchmark.industry
        )
      : null;

  // Group KPIs by category
  const grouped = scan.kpis.reduce<Record<string, ExtractedKPI[]>>(
    (acc, kpi) => {
      const cat = kpi.category || "other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(kpi);
      return acc;
    },
    {}
  );

  const categoryOrder: KPICategory[] = [
    "revenue",
    "profitability",
    "growth",
    "efficiency",
    "cash_flow",
    "liquidity",
    "leverage",
    "valuation",
  ];

  const sortedCategories = Object.keys(grouped).sort(
    (a, b) =>
      categoryOrder.indexOf(a as KPICategory) -
      categoryOrder.indexOf(b as KPICategory)
  );

  const handleShare = async () => {
    const text = `${scan.companyName || "Company"} KPI Analysis (${scan.period || "N/A"})\n\n${scan.kpis
      .map((k) => `${k.standardizedName}: ${k.formattedValue}`)
      .join("\n")}`;

    if (navigator.share) {
      await navigator.share({ title: "KPI Analysis", text });
    } else {
      await navigator.clipboard.writeText(text);
      alert("Results copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
          >
            <Share2 size={16} />
            Share
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Company header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            {scan.companyName && (
              <h1 className="text-xl font-bold text-gray-900">
                {scan.companyName}
                {scan.ticker && (
                  <span className="text-gray-400 font-normal ml-2 text-base">
                    ({scan.ticker})
                  </span>
                )}
              </h1>
            )}
          </div>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            {scan.industry && (
              <span className="flex items-center gap-1">
                <Building2 size={12} />
                {scan.industry}
              </span>
            )}
            {scan.documentType && (
              <span className="flex items-center gap-1">
                <FileText size={12} />
                {scan.documentType}
              </span>
            )}
            {scan.period && (
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {scan.period}
              </span>
            )}
          </div>
        </div>

        {/* Summary banner */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-blue-900">
              Analysis Summary
            </h2>
          </div>
          <p className="text-sm text-blue-800">
            Extracted <strong>{scan.kpis.length}</strong> financial metrics
            {scan.companyName ? ` from ${scan.companyName}` : ""}.
            {benchmarkSummary && ` ${benchmarkSummary}`}
          </p>
        </div>

        {/* Category quick-nav */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {sortedCategories.map((cat) => (
            <a
              key={cat}
              href={`#cat-${cat}`}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium text-white"
              style={{
                backgroundColor:
                  CATEGORY_COLORS[cat as KPICategory] || "#6b7280",
              }}
            >
              {CATEGORY_LABELS[cat as KPICategory] || cat} ({grouped[cat].length})
            </a>
          ))}
        </div>

        {/* KPI cards grouped by category */}
        {sortedCategories.map((cat) => (
          <div key={cat} id={`cat-${cat}`} className="mb-6">
            <h3
              className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2"
              style={{
                color: CATEGORY_COLORS[cat as KPICategory] || "#6b7280",
              }}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor:
                    CATEGORY_COLORS[cat as KPICategory] || "#6b7280",
                }}
              />
              {CATEGORY_LABELS[cat as KPICategory] || cat}
            </h3>
            <div className="space-y-3">
              {grouped[cat].map((kpi, i) => (
                <KPICard
                  key={`${kpi.standardizedName}-${i}`}
                  kpi={kpi}
                  benchmark={benchmarkMap.get(kpi.standardizedName) || null}
                  index={i}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Actions */}
        <div className="mt-8 flex gap-3">
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onClick={() => router.push("/scan")}
          >
            Scan Another Document
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="loading-spinner w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
