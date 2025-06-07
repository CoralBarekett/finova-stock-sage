export enum ChartDateRange {
  ONE_DAY = "1D",
  FIVE_DAYS = "5D",
  TEN_DAYS = "10D",
  ONE_MONTH = "1M",
  SIX_MONTHS = "6M",
  ONE_YEAR = "1Y",
  FIVE_YEARS = "5Y",
  ALL_TIME = "ALL",
}

export interface GapAnalysis {
  analysis: string;
  gaps: Array<{
    date: string;
    type: "up" | "down";
    size: number;
  }>;
}

export interface PriceTargets {
  supportPrice: number;
  resistancePrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
}

export interface AIAnalysisResult {
  url: string;
  summary: {
    currentStatus: string;
    recommendation: string;
    confidence: number;
    shortExplanation: string;
    priceTargets: PriceTargets;
  };
  detailedAnalysis: {
    trendAnalysis: string;
    supportResistance: string;
    technicalIndicators: string;
    patterns: string;
    riskAssessment: string;
    currentTechnicalPosition: string;
    gapAnalysis: GapAnalysis;
  };
  timestamp: string;
  model: string;
}

export interface PriceTargetDisplayProps {
  label: string;
  value: number | null;
  icon: React.ReactNode;
  color: string;
}

export interface AnalysisHeaderProps {
  timestamp: string;
  isDark: boolean;
}

export interface RecommendationDisplayProps {
  recommendation: string;
  confidence: number;
}

export interface DetailedAnalysisProps {
  analysis: AIAnalysisResult["detailedAnalysis"];
}
