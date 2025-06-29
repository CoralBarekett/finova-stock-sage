import React, { useState, useMemo } from "react";
import { AlertCircle, TrendingUp, Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

import PredictionHeader from "@/components/StockPrediction/PredictionHeader";
import StatsPanel from "@/components/StockPrediction/StatsPanel";
import PredictionChart from "@/components/StockPrediction/PredictionChart";
import DateNavigation from "@/components/StockPrediction/DateNavigation";
import AnalysisSummary from "@/components/StockPrediction/AnalysisSummary";

import { useStockPrediction } from "@/hooks/useStockPrediction";
import {
  prepareChartData,
  calculateStats,
  validatePredictionData,
} from "@/utils/stockPredictionUtils";

const StockPredictionSimulator: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Chart display controls
  const [showPredictions, setShowPredictions] = useState(true);
  const [showActual, setShowActual] = useState(true);

  // Main hook for all stock prediction functionality
  const {
    availableStocks,
    selectedSymbol,
    timeframe,
    currentDate,
    isLoading,
    isLoadingCurrentStock,
    error,
    historicalData,
    predictionData,
    currentStock,
    setSelectedSymbol,
    setTimeframe,
    generatePrediction,
    navigateDate,
    refreshData,
  } = useStockPrediction();

  // Prepare chart data from historical and prediction data
  const chartData = useMemo(
    () => prepareChartData(historicalData, predictionData, timeframe),
    [historicalData, predictionData, timeframe]
  );

  // Calculate comprehensive statistics
  const stats = useMemo(
    () => calculateStats(historicalData, predictionData, currentStock?.price),
    [historicalData, predictionData, currentStock?.price]
  );

  const summary = predictionData?.prediction && {
    currentStatus: predictionData.prediction?.direction ?? "",
    recommendation:
      predictionData.prediction?.sentiment?.toUpperCase() ?? "NEUTRAL",
    confidence: Math.round((predictionData.prediction?.confidence ?? 0) * 100),
    shortExplanation: predictionData.prediction?.reasoning ?? "",
  };

  // Check if we have valid prediction data
  const hasPrediction = validatePredictionData(predictionData);

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-gray-50 via-white to-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Main Content Card */}
        <div
          className={`
          rounded-3xl shadow-2xl backdrop-blur-lg transition-all duration-300 overflow-hidden
          ${
            isDark
              ? "bg-gray-800/90 border border-gray-700/50"
              : "bg-white/90 border border-gray-200/50"
          }
        `}
        >
          {/* Header Section */}
          <div className="p-8 pb-6">
            <PredictionHeader
              isDark={isDark}
              availableStocks={availableStocks}
              selectedSymbol={selectedSymbol}
              timeframe={timeframe}
              isLoading={isLoading}
              onSymbolChange={setSelectedSymbol}
              onTimeframeChange={setTimeframe}
              onGeneratePrediction={generatePrediction}
              hasHistoricalData={historicalData.length > 0}
            />
          </div>

          {/* Error Display */}
          {error && (
            <div className="px-8 pb-6">
              <div
                className={`
                p-4 rounded-2xl border flex items-center space-x-3 transition-all duration-300
                ${
                  isDark
                    ? "bg-red-900/20 border-red-800/50 text-red-300"
                    : "bg-red-50 border-red-200 text-red-800"
                }
              `}
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{error}</span>
                <button
                  onClick={refreshData}
                  className={`ml-auto px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    isDark
                      ? "bg-red-800 hover:bg-red-700 text-red-200"
                      : "bg-red-100 hover:bg-red-200 text-red-800"
                  }`}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="px-8 py-12">
              <div className="text-center">
                <div className="relative mx-auto w-24 h-24 mb-6">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
                  <div className="absolute inset-4 rounded-full border-2 border-purple-300 dark:border-purple-800"></div>
                  <div
                    className="absolute inset-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin"
                    style={{
                      animationDirection: "reverse",
                      animationDuration: "1.5s",
                    }}
                  ></div>
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {predictionData
                    ? "Loading Market Data..."
                    : "Analyzing Market Sentiment..."}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Our AI is processing thousands of data points
                </p>
                <div className="flex items-center justify-center space-x-2 mt-4">
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  <span
                    className={`text-xs font-medium ${
                      isDark ? "text-gray-500" : "text-gray-500"
                    }`}
                  >
                    This may take a few moments
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Stats Panel */}
          {stats && !isLoading && (
            <div className="px-8 pb-6">
              <StatsPanel
                isDark={isDark}
                stats={stats}
                isLoadingCurrentStock={isLoadingCurrentStock}
              />
            </div>
          )}

          {/* AI Analysis Summary */}
          {summary && hasPrediction && !isLoading && (
            <div className="px-8 pb-6">
              <AnalysisSummary isDark={isDark} summary={summary} />
            </div>
          )}

          {/* Date Navigation */}
          <div className="px-8 pb-6">
            <DateNavigation
              isDark={isDark}
              currentDate={currentDate}
              isLoading={isLoading}
              onNavigate={navigateDate}
            />
          </div>

          {/* Chart Controls */}
          <div className="px-8 pb-6">
            <div className="flex flex-wrap items-center gap-6">
              <h3
                className={`text-lg font-semibold ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                Chart Display
              </h3>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showActual}
                  onChange={(e) => setShowActual(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                />
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-1 bg-blue-500 rounded group-hover:w-8 transition-all"></div>
                  <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                    Historical Data
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={showPredictions}
                  onChange={(e) => setShowPredictions(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-all"
                />
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-1 bg-purple-500 rounded group-hover:w-8 transition-all"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(to right, #8B5CF6 0, #8B5CF6 4px, transparent 4px, transparent 8px)",
                    }}
                  ></div>
                  <span className="text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                    AI Predictions
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Chart Section */}
          <div className="px-8 pb-8">
            {chartData.length > 0 && !isLoading ? (
              <div
                className={`
                rounded-2xl border p-6 transition-all duration-300 hover:shadow-lg
                ${
                  isDark
                    ? "bg-gray-800/30 border-gray-700/50 hover:border-gray-600"
                    : "bg-white/50 border-gray-200 hover:border-gray-300"
                }
              `}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-lg font-semibold ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Price Chart & AI Predictions
                  </h3>

                  {hasPrediction && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span
                        className={`text-sm font-medium ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        AI Active
                      </span>
                    </div>
                  )}
                </div>

                <PredictionChart
                  isDark={isDark}
                  chartData={chartData}
                  showActual={showActual}
                  showPredictions={showPredictions}
                  height={500}
                />
              </div>
            ) : !isLoading ? (
              /* No Data State */
              <div
                className={`
                h-96 flex items-center justify-center rounded-2xl border transition-all duration-300
                ${
                  isDark
                    ? "bg-gray-800/20 border-gray-700/50 hover:border-gray-600"
                    : "bg-gray-50/50 border-gray-200 hover:border-gray-300"
                }
              `}
              >
                <div className="text-center max-w-md">
                  <div
                    className={`
                    w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center
                    ${isDark ? "bg-gray-700/50" : "bg-gray-100"}
                  `}
                  >
                    <TrendingUp
                      className={`w-12 h-12 ${
                        isDark ? "text-gray-500" : "text-gray-400"
                      }`}
                    />
                  </div>

                  <h3
                    className={`text-xl font-bold mb-3 ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    No Market Data Available
                  </h3>

                  <p
                    className={`text-sm leading-relaxed mb-4 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Select a stock symbol and timeframe to begin AI-powered
                    market analysis. Our system will analyze social sentiment
                    and technical indicators.
                  </p>

                  <button
                    onClick={refreshData}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors"
                  >
                    Load Data
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Chart Legend */}
        <div className="flex items-center justify-center space-x-8 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-2 bg-blue-500 rounded-full"></div>
            <span
              className={`font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Historical Market Data
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div
              className="w-8 h-2 bg-purple-500 rounded-full opacity-75"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(to right, #8B5CF6 0, #8B5CF6 4px, transparent 4px, transparent 8px)",
              }}
            ></div>
            <span
              className={`font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              AI-Powered Predictions
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span
              className={`font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Real-time Analysis
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockPredictionSimulator;
