import { useState } from "react";
import type {
  ChartDateRange,
  AIAnalysisResult,
} from "@/types/aiChartPrediction.types";
import { ChartDateRange as ChartDateRangeEnum } from "@/types/aiChartPrediction.types";

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

export const useAIChartPrediction = () => {
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [selectedDateRange, setSelectedDateRange] = useState<ChartDateRange>(
    ChartDateRangeEnum.ONE_MONTH
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const popularStocks = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "META",
    "TSLA",
    "NVDA",
    "AMD",
  ];

  const handleAnalyze = async () => {
    if (!selectedStock) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch(
        `${BACKEND_API_URL}/charts/${selectedStock}?dateRange=${selectedDateRange}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to analyze chart: ${response.statusText}`);
      }

      const result = await response.json();
      setAnalysisResult(result);
    } catch (err) {
      console.error("Error analyzing chart:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred while analyzing the chart"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    selectedStock,
    setSelectedStock,
    selectedDateRange,
    setSelectedDateRange,
    loading,
    setLoading,
    isAnalyzing,
    analysisResult,
    error,
    popularStocks,
    handleAnalyze,
  };
};
