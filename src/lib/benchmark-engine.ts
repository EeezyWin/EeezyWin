import { ExtractedKPI, BenchmarkComparison, IndustryBenchmark } from "@/types";
import { KPI_TAXONOMY } from "@/data/kpi-taxonomy";

export function compareKPIToBenchmark(
  kpi: ExtractedKPI,
  benchmark: IndustryBenchmark
): BenchmarkComparison | null {
  const benchMetric = benchmark.metrics[kpi.standardizedName];
  if (!benchMetric) return null;

  const value = kpi.value;
  const { median, p25, p75 } = benchMetric;

  // Determine if higher is better for this metric
  const taxonomyEntry = KPI_TAXONOMY.find(
    (t) => t.standardizedName === kpi.standardizedName
  );
  const higherIsBetter = taxonomyEntry?.higherIsBetter ?? true;

  // Estimate percentile position
  let percentileEstimate: number;
  if (higherIsBetter) {
    if (value >= p75) percentileEstimate = 75 + 25 * Math.min((value - p75) / (p75 - median || 1), 1);
    else if (value >= median) percentileEstimate = 50 + 25 * ((value - median) / (p75 - median || 1));
    else if (value >= p25) percentileEstimate = 25 + 25 * ((value - p25) / (median - p25 || 1));
    else percentileEstimate = Math.max(0, 25 * ((value - (p25 - (median - p25))) / (median - p25 || 1)));
  } else {
    // For metrics where lower is better (D/E, P/E), invert
    if (value <= p25) percentileEstimate = 75 + 25 * Math.min((p25 - value) / (median - p25 || 1), 1);
    else if (value <= median) percentileEstimate = 50 + 25 * ((median - value) / (median - p25 || 1));
    else if (value <= p75) percentileEstimate = 25 + 25 * ((p75 - value) / (p75 - median || 1));
    else percentileEstimate = Math.max(0, 25 - 25 * ((value - p75) / (p75 - median || 1)));
  }

  percentileEstimate = Math.max(0, Math.min(100, percentileEstimate));

  let rating: "strong" | "typical" | "concerning";
  if (percentileEstimate >= 65) rating = "strong";
  else if (percentileEstimate >= 35) rating = "typical";
  else rating = "concerning";

  return {
    kpiName: kpi.standardizedName,
    value,
    industryMedian: median,
    industryP25: p25,
    industryP75: p75,
    percentileEstimate: Math.round(percentileEstimate),
    rating,
  };
}

export function generateBenchmarkSummary(
  comparisons: BenchmarkComparison[],
  industry: string
): string {
  const strong = comparisons.filter((c) => c.rating === "strong");
  const concerning = comparisons.filter((c) => c.rating === "concerning");

  let summary = `Compared against ${industry} industry benchmarks:\n`;
  if (strong.length > 0) {
    summary += `Strengths: ${strong.map((c) => c.kpiName).join(", ")}. `;
  }
  if (concerning.length > 0) {
    summary += `Areas to watch: ${concerning.map((c) => c.kpiName).join(", ")}. `;
  }
  if (strong.length === 0 && concerning.length === 0) {
    summary += "All metrics are within typical industry ranges.";
  }
  return summary;
}
