import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Camera,
  Loader2,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { ChartDateRange } from "@/types/aiChartPrediction.types";
import { useAIChartPrediction } from "@/hooks/useAIChartPrediction";
import { PriceTargetDisplay } from "@/components/AIChartPrediction/PriceTargetDisplay";
import { AnalysisHeader } from "@/components/AIChartPrediction/AnalysisHeader";
import { RecommendationDisplay } from "@/components/AIChartPrediction/RecommendationDisplay";
import { DetailedAnalysis } from "@/components/AIChartPrediction/DetailedAnalysis";
import { TradingViewChart } from "@/components/AIChartPrediction/TradingViewChart";

// Add TradingView type declaration
declare global {
  interface Window {
    TradingView: any;
  }
}

const LoadingOverlay: React.FC<{ isDark: boolean }> = ({ isDark }) => (
  <div
    className={`fixed inset-0 z-50 flex items-center justify-center ${
      isDark ? "bg-gray-900/80" : "bg-white/80"
    } backdrop-blur-sm transition-all duration-300`}
  >
    <div className="flex flex-col items-center space-y-8">
      {/* Animation container */}
      <div className="relative">
        {/* Pulsing circle background */}
        <div className="relative">
          <div
            className={`w-32 h-32 rounded-full ${
              isDark ? "bg-purple-500/20" : "bg-purple-500/10"
            } animate-pulse`}
          />
          <div
            className={`absolute inset-0 rounded-full ${
              isDark ? "bg-purple-500/10" : "bg-purple-500/5"
            } animate-ping`}
          />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <Brain
            className={`w-16 h-16 ${
              isDark ? "text-purple-400" : "text-purple-600"
            } animate-bounce`}
          />
        </div>

        <div className="absolute -top-4 -right-4">
          <Sparkles
            className={`w-6 h-6 ${
              isDark ? "text-purple-400" : "text-purple-600"
            } animate-pulse`}
          />
        </div>
        <div className="absolute -bottom-4 -left-4">
          <Sparkles
            className={`w-6 h-6 ${
              isDark ? "text-purple-400" : "text-purple-600"
            } animate-pulse`}
            style={{ animationDelay: "150ms" }}
          />
        </div>
      </div>

      {/* Loading text and dots */}
      <div
        className={`text-center space-y-2 ${
          isDark ? "text-gray-300" : "text-gray-700"
        }`}
      >
        <h3 className="text-lg font-semibold">Analyzing Chart</h3>
        <p className="text-sm opacity-75">
          Processing technical indicators and market data
        </p>
        <div className="flex items-center justify-center space-x-1 mt-2">
          <div
            className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  </div>
);

const AIChartPrediction: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showDetails, setShowDetails] = useState(false);

  const {
    selectedStock,
    setSelectedStock,
    selectedDateRange,
    setSelectedDateRange,
    loading,
    isAnalyzing,
    analysisResult,
    error,
    popularStocks,
    handleAnalyze,
  } = useAIChartPrediction();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {isAnalyzing && <LoadingOverlay isDark={isDark} />}

      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">AI Chart Prediction</h1>
          <p className="text-muted-foreground">
            Analyze stock charts with AI-powered insights
          </p>
        </div>
        <Button
          className="flex items-center space-x-2"
          disabled={!selectedStock || loading || isAnalyzing}
          onClick={handleAnalyze}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Camera className="w-4 h-4" />
              <span>Analyze with AI</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <div className="text-red-500 text-center">{error}</div>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card
          className={`
          transition-all duration-300 hover:shadow-lg
          ${
            isDark
              ? "bg-gray-800/30 border-gray-700/50"
              : "bg-white/50 border-gray-200"
          }
        `}
        >
          <AnalysisHeader
            timestamp={analysisResult.timestamp}
            isDark={isDark}
          />
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Current Status</h4>
                  <p className="text-muted-foreground">
                    {analysisResult.summary.currentStatus}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Recommendation</h4>
                  <RecommendationDisplay
                    recommendation={analysisResult.summary.recommendation}
                    confidence={analysisResult.summary.confidence}
                  />
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Price Targets</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <PriceTargetDisplay
                      label="Support"
                      value={
                        analysisResult.summary.priceTargets?.supportPrice ??
                        null
                      }
                      icon={<Target className="w-4 h-4 text-emerald-500" />}
                      color="text-emerald-600"
                    />
                    <PriceTargetDisplay
                      label="Resistance"
                      value={
                        analysisResult.summary.priceTargets?.resistancePrice ??
                        null
                      }
                      icon={<Target className="w-4 h-4 text-red-500" />}
                      color="text-red-600"
                    />
                    <PriceTargetDisplay
                      label="Stop Loss"
                      value={
                        analysisResult.summary.priceTargets?.stopLossPrice ??
                        null
                      }
                      icon={<AlertCircle className="w-4 h-4 text-red-500" />}
                      color="text-red-600"
                    />
                    <PriceTargetDisplay
                      label="Take Profit"
                      value={
                        analysisResult.summary.priceTargets?.takeProfitPrice ??
                        null
                      }
                      icon={<TrendingUp className="w-4 h-4 text-emerald-500" />}
                      color="text-emerald-600"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Key Insight</h4>
                  <p className="text-muted-foreground">
                    {analysisResult.summary.shortExplanation}
                  </p>
                </div>
                {analysisResult.detailedAnalysis.gapAnalysis && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#FFB800]" />
                      <span className="text-sm font-medium text-[#FFB800]">
                        Gap Analysis
                      </span>
                    </div>
                    <div className="rounded-lg border border-[#FFB800] bg-[#FFB800]/5 p-3">
                      <p className="text-sm text-[#FFB800]">
                        {analysisResult.detailedAnalysis.gapAnalysis.analysis}
                      </p>
                      {analysisResult.detailedAnalysis.gapAnalysis.gaps
                        .length === 0 && (
                        <p className="mt-2 text-sm text-[#FFB800]">
                          No significant gaps detected in the chart pattern.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              className="w-full flex items-center justify-center space-x-2 py-2"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Show Less</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Show Detailed Analysis</span>
                </>
              )}
            </Button>

            {showDetails && (
              <DetailedAnalysis analysis={analysisResult.detailedAnalysis} />
            )}
          </CardContent>
        </Card>
      )}

      <TradingViewChart
        selectedStock={selectedStock}
        setSelectedStock={setSelectedStock}
        selectedDateRange={selectedDateRange}
        setSelectedDateRange={setSelectedDateRange}
        loading={loading}
        popularStocks={popularStocks}
      />
    </div>
  );
};

export default AIChartPrediction;
