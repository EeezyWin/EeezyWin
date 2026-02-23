import { KPICategory } from "@/types";

export interface KPIDefinition {
  standardizedName: string;
  aliases: string[];
  category: KPICategory;
  unit: "percentage" | "ratio" | "millions" | "billions" | "number";
  description: string;
  higherIsBetter: boolean;
}

export const KPI_TAXONOMY: KPIDefinition[] = [
  // Revenue
  {
    standardizedName: "Revenue",
    aliases: ["total revenue", "net revenue", "sales", "net sales", "total net revenue"],
    category: "revenue",
    unit: "millions",
    description: "Total income generated from normal business operations",
    higherIsBetter: true,
  },
  {
    standardizedName: "Cost of Revenue",
    aliases: ["cost of goods sold", "COGS", "cost of sales", "cost of revenue"],
    category: "revenue",
    unit: "millions",
    description: "Direct costs attributable to the production of goods or services sold",
    higherIsBetter: false,
  },
  // Profitability
  {
    standardizedName: "Gross Margin",
    aliases: ["gross profit margin", "gross margin %"],
    category: "profitability",
    unit: "percentage",
    description: "Percentage of revenue remaining after deducting cost of goods sold",
    higherIsBetter: true,
  },
  {
    standardizedName: "Operating Margin",
    aliases: ["operating profit margin", "EBIT margin", "operating income margin"],
    category: "profitability",
    unit: "percentage",
    description: "Percentage of revenue remaining after operating expenses",
    higherIsBetter: true,
  },
  {
    standardizedName: "Net Margin",
    aliases: ["net profit margin", "net income margin", "profit margin"],
    category: "profitability",
    unit: "percentage",
    description: "Percentage of revenue that becomes profit after all expenses",
    higherIsBetter: true,
  },
  {
    standardizedName: "EBITDA",
    aliases: ["earnings before interest taxes depreciation amortization"],
    category: "profitability",
    unit: "millions",
    description: "Earnings before interest, taxes, depreciation, and amortization",
    higherIsBetter: true,
  },
  {
    standardizedName: "Net Income",
    aliases: ["net profit", "net earnings", "bottom line", "profit"],
    category: "profitability",
    unit: "millions",
    description: "Total profit after all expenses, taxes, and costs have been deducted",
    higherIsBetter: true,
  },
  {
    standardizedName: "EPS",
    aliases: ["earnings per share", "diluted EPS", "basic EPS"],
    category: "profitability",
    unit: "number",
    description: "Portion of profit allocated to each outstanding share of common stock",
    higherIsBetter: true,
  },
  // Growth
  {
    standardizedName: "Revenue Growth",
    aliases: ["revenue growth rate", "YoY revenue growth", "top-line growth", "sales growth"],
    category: "growth",
    unit: "percentage",
    description: "Year-over-year percentage increase in revenue",
    higherIsBetter: true,
  },
  {
    standardizedName: "Earnings Growth",
    aliases: ["net income growth", "profit growth", "EPS growth"],
    category: "growth",
    unit: "percentage",
    description: "Year-over-year percentage increase in net income or EPS",
    higherIsBetter: true,
  },
  // Liquidity
  {
    standardizedName: "Current Ratio",
    aliases: ["working capital ratio"],
    category: "liquidity",
    unit: "ratio",
    description: "Ability to pay short-term obligations (current assets / current liabilities)",
    higherIsBetter: true,
  },
  {
    standardizedName: "Quick Ratio",
    aliases: ["acid test ratio"],
    category: "liquidity",
    unit: "ratio",
    description: "Ability to meet short-term obligations with most liquid assets",
    higherIsBetter: true,
  },
  // Leverage
  {
    standardizedName: "Debt-to-Equity",
    aliases: ["D/E ratio", "debt to equity ratio", "leverage ratio"],
    category: "leverage",
    unit: "ratio",
    description: "Total debt divided by shareholders equity — measures financial leverage",
    higherIsBetter: false,
  },
  {
    standardizedName: "Interest Coverage",
    aliases: ["times interest earned", "interest coverage ratio"],
    category: "leverage",
    unit: "ratio",
    description: "Ability to pay interest expenses on outstanding debt (EBIT / interest expense)",
    higherIsBetter: true,
  },
  // Efficiency
  {
    standardizedName: "ROE",
    aliases: ["return on equity"],
    category: "efficiency",
    unit: "percentage",
    description: "Net income as a percentage of shareholders equity — measures profitability relative to equity",
    higherIsBetter: true,
  },
  {
    standardizedName: "ROA",
    aliases: ["return on assets"],
    category: "efficiency",
    unit: "percentage",
    description: "Net income as a percentage of total assets — measures asset utilization efficiency",
    higherIsBetter: true,
  },
  // Cash Flow
  {
    standardizedName: "Operating Cash Flow",
    aliases: ["cash from operations", "CFO", "operating cash"],
    category: "cash_flow",
    unit: "millions",
    description: "Cash generated from core business operations",
    higherIsBetter: true,
  },
  {
    standardizedName: "Free Cash Flow",
    aliases: ["FCF", "free cash"],
    category: "cash_flow",
    unit: "millions",
    description: "Cash available after capital expenditures for dividends, debt repayment, or reinvestment",
    higherIsBetter: true,
  },
  // Valuation
  {
    standardizedName: "P/E Ratio",
    aliases: ["price to earnings", "PE ratio", "price-earnings ratio", "trailing P/E"],
    category: "valuation",
    unit: "ratio",
    description: "Stock price divided by earnings per share — measures how much investors pay per dollar of earnings",
    higherIsBetter: false,
  },
  {
    standardizedName: "EV/EBITDA",
    aliases: ["enterprise value to EBITDA"],
    category: "valuation",
    unit: "ratio",
    description: "Enterprise value divided by EBITDA — a valuation multiple normalized for capital structure",
    higherIsBetter: false,
  },
];

export const CATEGORY_LABELS: Record<KPICategory, string> = {
  revenue: "Revenue",
  profitability: "Profitability",
  liquidity: "Liquidity",
  leverage: "Leverage",
  growth: "Growth",
  efficiency: "Efficiency",
  valuation: "Valuation",
  cash_flow: "Cash Flow",
};

export const CATEGORY_COLORS: Record<KPICategory, string> = {
  revenue: "#3b82f6",
  profitability: "#10b981",
  liquidity: "#6366f1",
  leverage: "#f59e0b",
  growth: "#8b5cf6",
  efficiency: "#ec4899",
  valuation: "#14b8a6",
  cash_flow: "#f97316",
};
