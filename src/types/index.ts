export interface ExtractedKPI {
  name: string;
  standardizedName: string;
  value: number;
  formattedValue: string;
  unit: "millions" | "billions" | "thousands" | "percentage" | "ratio" | "number";
  currency?: string;
  gaap: boolean;
  yoyChangePct?: number;
  category: KPICategory;
  explanation: string;
  healthIndicator: "strong" | "typical" | "concerning";
  confidence: "high" | "medium" | "low";
  period?: string;
}

export type KPICategory =
  | "revenue"
  | "profitability"
  | "liquidity"
  | "leverage"
  | "growth"
  | "efficiency"
  | "valuation"
  | "cash_flow";

export interface ScanResult {
  id: string;
  timestamp: number;
  companyName: string | null;
  ticker: string | null;
  sector: string | null;
  industry: string | null;
  documentType: string | null;
  period: string | null;
  kpis: ExtractedKPI[];
  imageDataUrl?: string;
  thumbnailUrl?: string;
}

export interface IndustryBenchmark {
  industry: string;
  metrics: Record<
    string,
    {
      median: number;
      p25: number;
      p75: number;
      unit: string;
    }
  >;
}

export interface ExtractionResponse {
  success: boolean;
  data?: {
    companyName: string | null;
    ticker: string | null;
    sector: string | null;
    industry: string | null;
    documentType: string | null;
    period: string | null;
    kpis: ExtractedKPI[];
  };
  error?: string;
}

export interface BenchmarkComparison {
  kpiName: string;
  value: number;
  industryMedian: number;
  industryP25: number;
  industryP75: number;
  percentileEstimate: number;
  rating: "strong" | "typical" | "concerning";
}
