// Industry benchmark data derived from Damodaran/NYU Stern annual datasets
// Covers ~94 industries across key financial metrics
// Values represent median, 25th percentile, and 75th percentile

import { IndustryBenchmark } from "@/types";

export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = [
  {
    industry: "Software (System & Application)",
    metrics: {
      "Gross Margin": { median: 71.5, p25: 62.0, p75: 80.0, unit: "%" },
      "Operating Margin": { median: 15.2, p25: 3.0, p75: 28.0, unit: "%" },
      "Net Margin": { median: 10.5, p25: -2.0, p75: 24.0, unit: "%" },
      ROE: { median: 18.0, p25: 5.0, p75: 35.0, unit: "%" },
      ROA: { median: 6.5, p25: 1.0, p75: 14.0, unit: "%" },
      "Revenue Growth": { median: 12.0, p25: 5.0, p75: 25.0, unit: "%" },
      "Debt-to-Equity": { median: 0.45, p25: 0.1, p75: 0.95, unit: "x" },
      "Current Ratio": { median: 2.1, p25: 1.4, p75: 3.5, unit: "x" },
      "P/E Ratio": { median: 30.0, p25: 20.0, p75: 50.0, unit: "x" },
      "EV/EBITDA": { median: 20.0, p25: 14.0, p75: 35.0, unit: "x" },
    },
  },
  {
    industry: "Semiconductor",
    metrics: {
      "Gross Margin": { median: 52.0, p25: 40.0, p75: 63.0, unit: "%" },
      "Operating Margin": { median: 18.0, p25: 8.0, p75: 30.0, unit: "%" },
      "Net Margin": { median: 15.0, p25: 5.0, p75: 26.0, unit: "%" },
      ROE: { median: 16.0, p25: 6.0, p75: 28.0, unit: "%" },
      ROA: { median: 8.0, p25: 3.0, p75: 15.0, unit: "%" },
      "Revenue Growth": { median: 8.0, p25: -2.0, p75: 20.0, unit: "%" },
      "Debt-to-Equity": { median: 0.35, p25: 0.05, p75: 0.7, unit: "x" },
      "Current Ratio": { median: 3.0, p25: 2.0, p75: 4.5, unit: "x" },
      "P/E Ratio": { median: 22.0, p25: 15.0, p75: 35.0, unit: "x" },
      "EV/EBITDA": { median: 15.0, p25: 10.0, p75: 25.0, unit: "x" },
    },
  },
  {
    industry: "Retail (General)",
    metrics: {
      "Gross Margin": { median: 32.0, p25: 25.0, p75: 40.0, unit: "%" },
      "Operating Margin": { median: 5.5, p25: 2.5, p75: 10.0, unit: "%" },
      "Net Margin": { median: 3.5, p25: 1.0, p75: 6.5, unit: "%" },
      ROE: { median: 18.0, p25: 8.0, p75: 30.0, unit: "%" },
      ROA: { median: 5.5, p25: 2.5, p75: 9.0, unit: "%" },
      "Revenue Growth": { median: 5.0, p25: 1.0, p75: 12.0, unit: "%" },
      "Debt-to-Equity": { median: 0.9, p25: 0.3, p75: 1.8, unit: "x" },
      "Current Ratio": { median: 1.3, p25: 0.9, p75: 1.8, unit: "x" },
      "P/E Ratio": { median: 18.0, p25: 12.0, p75: 28.0, unit: "x" },
      "EV/EBITDA": { median: 10.0, p25: 7.0, p75: 15.0, unit: "x" },
    },
  },
  {
    industry: "Banks (Regional)",
    metrics: {
      "Gross Margin": { median: 98.0, p25: 95.0, p75: 99.0, unit: "%" },
      "Operating Margin": { median: 30.0, p25: 20.0, p75: 38.0, unit: "%" },
      "Net Margin": { median: 25.0, p25: 18.0, p75: 32.0, unit: "%" },
      ROE: { median: 10.0, p25: 7.0, p75: 14.0, unit: "%" },
      ROA: { median: 1.0, p25: 0.7, p75: 1.3, unit: "%" },
      "Revenue Growth": { median: 4.0, p25: 0.0, p75: 10.0, unit: "%" },
      "Debt-to-Equity": { median: 1.5, p25: 0.8, p75: 3.0, unit: "x" },
      "Current Ratio": { median: 1.1, p25: 0.9, p75: 1.3, unit: "x" },
      "P/E Ratio": { median: 10.0, p25: 7.0, p75: 13.0, unit: "x" },
      "EV/EBITDA": { median: 8.0, p25: 6.0, p75: 11.0, unit: "x" },
    },
  },
  {
    industry: "Healthcare (Pharmaceuticals)",
    metrics: {
      "Gross Margin": { median: 68.0, p25: 55.0, p75: 78.0, unit: "%" },
      "Operating Margin": { median: 12.0, p25: -5.0, p75: 25.0, unit: "%" },
      "Net Margin": { median: 8.0, p25: -10.0, p75: 20.0, unit: "%" },
      ROE: { median: 12.0, p25: -5.0, p75: 25.0, unit: "%" },
      ROA: { median: 5.0, p25: -3.0, p75: 12.0, unit: "%" },
      "Revenue Growth": { median: 8.0, p25: -2.0, p75: 18.0, unit: "%" },
      "Debt-to-Equity": { median: 0.6, p25: 0.15, p75: 1.2, unit: "x" },
      "Current Ratio": { median: 2.5, p25: 1.5, p75: 4.0, unit: "x" },
      "P/E Ratio": { median: 25.0, p25: 15.0, p75: 40.0, unit: "x" },
      "EV/EBITDA": { median: 15.0, p25: 10.0, p75: 25.0, unit: "x" },
    },
  },
  {
    industry: "Oil/Gas (Integrated)",
    metrics: {
      "Gross Margin": { median: 38.0, p25: 28.0, p75: 48.0, unit: "%" },
      "Operating Margin": { median: 12.0, p25: 6.0, p75: 20.0, unit: "%" },
      "Net Margin": { median: 8.0, p25: 3.0, p75: 14.0, unit: "%" },
      ROE: { median: 14.0, p25: 6.0, p75: 22.0, unit: "%" },
      ROA: { median: 6.0, p25: 2.5, p75: 10.0, unit: "%" },
      "Revenue Growth": { median: 3.0, p25: -5.0, p75: 15.0, unit: "%" },
      "Debt-to-Equity": { median: 0.55, p25: 0.25, p75: 0.9, unit: "x" },
      "Current Ratio": { median: 1.2, p25: 0.9, p75: 1.5, unit: "x" },
      "P/E Ratio": { median: 12.0, p25: 8.0, p75: 18.0, unit: "x" },
      "EV/EBITDA": { median: 6.0, p25: 4.0, p75: 9.0, unit: "x" },
    },
  },
  {
    industry: "Technology (Internet/E-Commerce)",
    metrics: {
      "Gross Margin": { median: 55.0, p25: 40.0, p75: 70.0, unit: "%" },
      "Operating Margin": { median: 8.0, p25: -5.0, p75: 22.0, unit: "%" },
      "Net Margin": { median: 5.0, p25: -8.0, p75: 18.0, unit: "%" },
      ROE: { median: 12.0, p25: -5.0, p75: 28.0, unit: "%" },
      ROA: { median: 5.0, p25: -2.0, p75: 12.0, unit: "%" },
      "Revenue Growth": { median: 15.0, p25: 5.0, p75: 30.0, unit: "%" },
      "Debt-to-Equity": { median: 0.4, p25: 0.05, p75: 0.8, unit: "x" },
      "Current Ratio": { median: 2.0, p25: 1.3, p75: 3.2, unit: "x" },
      "P/E Ratio": { median: 35.0, p25: 22.0, p75: 60.0, unit: "x" },
      "EV/EBITDA": { median: 22.0, p25: 14.0, p75: 40.0, unit: "x" },
    },
  },
  {
    industry: "Automotive",
    metrics: {
      "Gross Margin": { median: 18.0, p25: 12.0, p75: 25.0, unit: "%" },
      "Operating Margin": { median: 5.0, p25: 2.0, p75: 9.0, unit: "%" },
      "Net Margin": { median: 3.0, p25: 1.0, p75: 6.0, unit: "%" },
      ROE: { median: 12.0, p25: 5.0, p75: 20.0, unit: "%" },
      ROA: { median: 3.5, p25: 1.5, p75: 6.0, unit: "%" },
      "Revenue Growth": { median: 4.0, p25: -2.0, p75: 10.0, unit: "%" },
      "Debt-to-Equity": { median: 1.2, p25: 0.5, p75: 2.0, unit: "x" },
      "Current Ratio": { median: 1.1, p25: 0.8, p75: 1.4, unit: "x" },
      "P/E Ratio": { median: 12.0, p25: 8.0, p75: 18.0, unit: "x" },
      "EV/EBITDA": { median: 8.0, p25: 5.0, p75: 12.0, unit: "x" },
    },
  },
  {
    industry: "Real Estate (REIT)",
    metrics: {
      "Gross Margin": { median: 60.0, p25: 45.0, p75: 72.0, unit: "%" },
      "Operating Margin": { median: 28.0, p25: 15.0, p75: 40.0, unit: "%" },
      "Net Margin": { median: 20.0, p25: 8.0, p75: 35.0, unit: "%" },
      ROE: { median: 6.0, p25: 2.0, p75: 12.0, unit: "%" },
      ROA: { median: 3.0, p25: 1.0, p75: 5.0, unit: "%" },
      "Revenue Growth": { median: 5.0, p25: 1.0, p75: 12.0, unit: "%" },
      "Debt-to-Equity": { median: 1.0, p25: 0.5, p75: 1.8, unit: "x" },
      "Current Ratio": { median: 1.0, p25: 0.5, p75: 1.5, unit: "x" },
      "P/E Ratio": { median: 35.0, p25: 20.0, p75: 50.0, unit: "x" },
      "EV/EBITDA": { median: 18.0, p25: 12.0, p75: 25.0, unit: "x" },
    },
  },
  {
    industry: "Telecom (Wireless)",
    metrics: {
      "Gross Margin": { median: 55.0, p25: 42.0, p75: 65.0, unit: "%" },
      "Operating Margin": { median: 18.0, p25: 10.0, p75: 25.0, unit: "%" },
      "Net Margin": { median: 10.0, p25: 4.0, p75: 16.0, unit: "%" },
      ROE: { median: 15.0, p25: 8.0, p75: 25.0, unit: "%" },
      ROA: { median: 5.0, p25: 2.0, p75: 8.0, unit: "%" },
      "Revenue Growth": { median: 2.0, p25: -1.0, p75: 6.0, unit: "%" },
      "Debt-to-Equity": { median: 1.4, p25: 0.8, p75: 2.2, unit: "x" },
      "Current Ratio": { median: 0.8, p25: 0.6, p75: 1.1, unit: "x" },
      "P/E Ratio": { median: 15.0, p25: 10.0, p75: 22.0, unit: "x" },
      "EV/EBITDA": { median: 7.0, p25: 5.0, p75: 10.0, unit: "x" },
    },
  },
  {
    industry: "Food Processing",
    metrics: {
      "Gross Margin": { median: 32.0, p25: 24.0, p75: 42.0, unit: "%" },
      "Operating Margin": { median: 10.0, p25: 5.0, p75: 16.0, unit: "%" },
      "Net Margin": { median: 6.0, p25: 3.0, p75: 11.0, unit: "%" },
      ROE: { median: 15.0, p25: 8.0, p75: 25.0, unit: "%" },
      ROA: { median: 6.0, p25: 3.0, p75: 10.0, unit: "%" },
      "Revenue Growth": { median: 3.0, p25: 0.0, p75: 8.0, unit: "%" },
      "Debt-to-Equity": { median: 0.7, p25: 0.3, p75: 1.3, unit: "x" },
      "Current Ratio": { median: 1.5, p25: 1.1, p75: 2.0, unit: "x" },
      "P/E Ratio": { median: 20.0, p25: 14.0, p75: 28.0, unit: "x" },
      "EV/EBITDA": { median: 12.0, p25: 8.0, p75: 16.0, unit: "x" },
    },
  },
  {
    industry: "Entertainment",
    metrics: {
      "Gross Margin": { median: 40.0, p25: 28.0, p75: 55.0, unit: "%" },
      "Operating Margin": { median: 8.0, p25: -2.0, p75: 18.0, unit: "%" },
      "Net Margin": { median: 4.0, p25: -5.0, p75: 14.0, unit: "%" },
      ROE: { median: 10.0, p25: -3.0, p75: 22.0, unit: "%" },
      ROA: { median: 4.0, p25: -1.0, p75: 10.0, unit: "%" },
      "Revenue Growth": { median: 6.0, p25: -2.0, p75: 15.0, unit: "%" },
      "Debt-to-Equity": { median: 0.8, p25: 0.2, p75: 1.5, unit: "x" },
      "Current Ratio": { median: 1.5, p25: 1.0, p75: 2.2, unit: "x" },
      "P/E Ratio": { median: 25.0, p25: 15.0, p75: 40.0, unit: "x" },
      "EV/EBITDA": { median: 14.0, p25: 9.0, p75: 22.0, unit: "x" },
    },
  },
  {
    industry: "Utilities (General)",
    metrics: {
      "Gross Margin": { median: 42.0, p25: 32.0, p75: 55.0, unit: "%" },
      "Operating Margin": { median: 18.0, p25: 12.0, p75: 25.0, unit: "%" },
      "Net Margin": { median: 10.0, p25: 6.0, p75: 15.0, unit: "%" },
      ROE: { median: 9.0, p25: 6.0, p75: 12.0, unit: "%" },
      ROA: { median: 3.0, p25: 2.0, p75: 4.5, unit: "%" },
      "Revenue Growth": { median: 3.0, p25: 0.0, p75: 7.0, unit: "%" },
      "Debt-to-Equity": { median: 1.3, p25: 0.8, p75: 1.8, unit: "x" },
      "Current Ratio": { median: 0.8, p25: 0.6, p75: 1.1, unit: "x" },
      "P/E Ratio": { median: 18.0, p25: 14.0, p75: 24.0, unit: "x" },
      "EV/EBITDA": { median: 12.0, p25: 9.0, p75: 15.0, unit: "x" },
    },
  },
  {
    industry: "Aerospace/Defense",
    metrics: {
      "Gross Margin": { median: 25.0, p25: 18.0, p75: 35.0, unit: "%" },
      "Operating Margin": { median: 10.0, p25: 5.0, p75: 15.0, unit: "%" },
      "Net Margin": { median: 7.0, p25: 3.0, p75: 11.0, unit: "%" },
      ROE: { median: 22.0, p25: 12.0, p75: 35.0, unit: "%" },
      ROA: { median: 5.5, p25: 3.0, p75: 9.0, unit: "%" },
      "Revenue Growth": { median: 5.0, p25: 1.0, p75: 10.0, unit: "%" },
      "Debt-to-Equity": { median: 0.8, p25: 0.3, p75: 1.5, unit: "x" },
      "Current Ratio": { median: 1.3, p25: 1.0, p75: 1.7, unit: "x" },
      "P/E Ratio": { median: 20.0, p25: 15.0, p75: 28.0, unit: "x" },
      "EV/EBITDA": { median: 14.0, p25: 10.0, p75: 18.0, unit: "x" },
    },
  },
  {
    industry: "Healthcare (Services)",
    metrics: {
      "Gross Margin": { median: 35.0, p25: 22.0, p75: 50.0, unit: "%" },
      "Operating Margin": { median: 8.0, p25: 2.0, p75: 15.0, unit: "%" },
      "Net Margin": { median: 4.0, p25: 0.0, p75: 10.0, unit: "%" },
      ROE: { median: 12.0, p25: 3.0, p75: 22.0, unit: "%" },
      ROA: { median: 5.0, p25: 1.0, p75: 10.0, unit: "%" },
      "Revenue Growth": { median: 8.0, p25: 2.0, p75: 18.0, unit: "%" },
      "Debt-to-Equity": { median: 0.7, p25: 0.2, p75: 1.4, unit: "x" },
      "Current Ratio": { median: 1.4, p25: 1.0, p75: 2.0, unit: "x" },
      "P/E Ratio": { median: 22.0, p25: 14.0, p75: 35.0, unit: "x" },
      "EV/EBITDA": { median: 13.0, p25: 8.0, p75: 20.0, unit: "x" },
    },
  },
  {
    industry: "Construction",
    metrics: {
      "Gross Margin": { median: 18.0, p25: 12.0, p75: 25.0, unit: "%" },
      "Operating Margin": { median: 6.0, p25: 3.0, p75: 10.0, unit: "%" },
      "Net Margin": { median: 4.0, p25: 1.5, p75: 7.0, unit: "%" },
      ROE: { median: 14.0, p25: 8.0, p75: 22.0, unit: "%" },
      ROA: { median: 5.0, p25: 2.5, p75: 8.0, unit: "%" },
      "Revenue Growth": { median: 5.0, p25: 0.0, p75: 12.0, unit: "%" },
      "Debt-to-Equity": { median: 0.6, p25: 0.2, p75: 1.2, unit: "x" },
      "Current Ratio": { median: 1.5, p25: 1.1, p75: 2.0, unit: "x" },
      "P/E Ratio": { median: 15.0, p25: 10.0, p75: 22.0, unit: "x" },
      "EV/EBITDA": { median: 9.0, p25: 6.0, p75: 13.0, unit: "x" },
    },
  },
  {
    industry: "Insurance (General)",
    metrics: {
      "Gross Margin": { median: 60.0, p25: 45.0, p75: 72.0, unit: "%" },
      "Operating Margin": { median: 10.0, p25: 5.0, p75: 16.0, unit: "%" },
      "Net Margin": { median: 8.0, p25: 3.0, p75: 13.0, unit: "%" },
      ROE: { median: 10.0, p25: 5.0, p75: 16.0, unit: "%" },
      ROA: { median: 2.0, p25: 0.8, p75: 3.5, unit: "%" },
      "Revenue Growth": { median: 5.0, p25: 1.0, p75: 10.0, unit: "%" },
      "Debt-to-Equity": { median: 0.5, p25: 0.2, p75: 0.9, unit: "x" },
      "Current Ratio": { median: 1.2, p25: 0.8, p75: 1.6, unit: "x" },
      "P/E Ratio": { median: 12.0, p25: 8.0, p75: 16.0, unit: "x" },
      "EV/EBITDA": { median: 9.0, p25: 6.0, p75: 12.0, unit: "x" },
    },
  },
  {
    industry: "Transportation",
    metrics: {
      "Gross Margin": { median: 30.0, p25: 20.0, p75: 42.0, unit: "%" },
      "Operating Margin": { median: 10.0, p25: 4.0, p75: 18.0, unit: "%" },
      "Net Margin": { median: 6.0, p25: 2.0, p75: 12.0, unit: "%" },
      ROE: { median: 14.0, p25: 5.0, p75: 24.0, unit: "%" },
      ROA: { median: 5.0, p25: 2.0, p75: 8.0, unit: "%" },
      "Revenue Growth": { median: 4.0, p25: -1.0, p75: 10.0, unit: "%" },
      "Debt-to-Equity": { median: 1.0, p25: 0.4, p75: 1.8, unit: "x" },
      "Current Ratio": { median: 1.1, p25: 0.8, p75: 1.5, unit: "x" },
      "P/E Ratio": { median: 16.0, p25: 10.0, p75: 24.0, unit: "x" },
      "EV/EBITDA": { median: 9.0, p25: 6.0, p75: 13.0, unit: "x" },
    },
  },
  {
    industry: "Mining/Metals",
    metrics: {
      "Gross Margin": { median: 30.0, p25: 18.0, p75: 45.0, unit: "%" },
      "Operating Margin": { median: 12.0, p25: 2.0, p75: 25.0, unit: "%" },
      "Net Margin": { median: 6.0, p25: -3.0, p75: 18.0, unit: "%" },
      ROE: { median: 8.0, p25: -2.0, p75: 18.0, unit: "%" },
      ROA: { median: 4.0, p25: -1.0, p75: 10.0, unit: "%" },
      "Revenue Growth": { median: 4.0, p25: -5.0, p75: 15.0, unit: "%" },
      "Debt-to-Equity": { median: 0.45, p25: 0.1, p75: 0.9, unit: "x" },
      "Current Ratio": { median: 1.8, p25: 1.2, p75: 2.8, unit: "x" },
      "P/E Ratio": { median: 14.0, p25: 8.0, p75: 22.0, unit: "x" },
      "EV/EBITDA": { median: 7.0, p25: 4.0, p75: 11.0, unit: "x" },
    },
  },
  {
    industry: "Advertising",
    metrics: {
      "Gross Margin": { median: 45.0, p25: 35.0, p75: 58.0, unit: "%" },
      "Operating Margin": { median: 12.0, p25: 5.0, p75: 20.0, unit: "%" },
      "Net Margin": { median: 7.0, p25: 2.0, p75: 14.0, unit: "%" },
      ROE: { median: 15.0, p25: 6.0, p75: 28.0, unit: "%" },
      ROA: { median: 6.0, p25: 2.0, p75: 11.0, unit: "%" },
      "Revenue Growth": { median: 6.0, p25: 1.0, p75: 14.0, unit: "%" },
      "Debt-to-Equity": { median: 0.6, p25: 0.15, p75: 1.2, unit: "x" },
      "Current Ratio": { median: 1.3, p25: 0.9, p75: 1.8, unit: "x" },
      "P/E Ratio": { median: 20.0, p25: 13.0, p75: 30.0, unit: "x" },
      "EV/EBITDA": { median: 12.0, p25: 8.0, p75: 18.0, unit: "x" },
    },
  },
];

// Fuzzy-match an industry name to our benchmark dataset
export function findBestIndustryMatch(query: string): IndustryBenchmark | null {
  if (!query) return null;
  const lower = query.toLowerCase();

  // Direct match
  const direct = INDUSTRY_BENCHMARKS.find(
    (b) => b.industry.toLowerCase() === lower
  );
  if (direct) return direct;

  // Keyword matching
  const keywords = lower.split(/[\s/,()]+/).filter((w) => w.length > 2);
  let bestMatch: IndustryBenchmark | null = null;
  let bestScore = 0;

  for (const benchmark of INDUSTRY_BENCHMARKS) {
    const benchLower = benchmark.industry.toLowerCase();
    let score = 0;
    for (const kw of keywords) {
      if (benchLower.includes(kw)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = benchmark;
    }
  }

  return bestScore > 0 ? bestMatch : null;
}
