import React from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Brain,
  Activity,
} from "lucide-react";
import { formatCurrency, formatPercentage } from "@/utils/stockPredictionUtils";
import type { PredictionStats } from "@/types/stockPrediction.types";

interface StatsPanelProps {
  isDark: boolean;
  stats: PredictionStats;
  isLoadingCurrentStock?: boolean;
}

const StatsPanel: React.FC<StatsPanelProps> = ({
  isDark,
  stats,
  isLoadingCurrentStock = false,
}) => {
  const isPositiveChange = stats.changePercent >= 0;
  const confidenceLevel = stats.confidence * 100;

  // Check if current price is available
  const isCurrentPriceAvailable = stats.currentPrice > 0;

  // Only show loading if we don't have current price data yet
  const shouldShowLoading = isLoadingCurrentStock && !isCurrentPriceAvailable;

  // Determine confidence color based on level
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-emerald-500";
    if (confidence >= 60) return "text-yellow-500";
    return "text-orange-500";
  };

  const statCards = [
    {
      title: "Current Price",
      value: shouldShowLoading
        ? "Loading..."
        : isCurrentPriceAvailable
        ? formatCurrency(stats.currentPrice)
        : "Data Unavailable",
      icon: DollarSign,
      bgColor: isDark
        ? "from-blue-900/30 to-blue-800/20"
        : "from-blue-50 to-blue-100",
      iconBg: "bg-blue-500",
      textColor: shouldShowLoading
        ? "text-gray-400"
        : isCurrentPriceAvailable
        ? "text-blue-600"
        : "text-gray-500",
      subtitle: shouldShowLoading
        ? "Fetching real-time data..."
        : isCurrentPriceAvailable
        ? undefined
        : "Real-time data not available",
    },
    {
      title: "AI Prediction",
      value: formatCurrency(stats.predictedPrice),
      icon: Brain,
      bgColor: isDark
        ? "from-purple-900/30 to-purple-800/20"
        : "from-purple-50 to-purple-100",
      iconBg: "bg-purple-500",
      textColor: "text-purple-600",
    },
    {
      title: "Predicted Change",
      value: isCurrentPriceAvailable
        ? formatPercentage(stats.changePercent)
        : "N/A",
      icon: isPositiveChange ? TrendingUp : TrendingDown,
      bgColor: isPositiveChange
        ? isDark
          ? "from-emerald-900/30 to-emerald-800/20"
          : "from-emerald-50 to-emerald-100"
        : isDark
        ? "from-red-900/30 to-red-800/20"
        : "from-red-50 to-red-100",
      iconBg: isPositiveChange ? "bg-emerald-500" : "bg-red-500",
      textColor: isCurrentPriceAvailable
        ? isPositiveChange
          ? "text-emerald-600"
          : "text-red-600"
        : "text-gray-500",
    },
    {
      title: "AI Confidence",
      value: `${Math.round(confidenceLevel)}%`,
      icon: Activity,
      bgColor: isDark
        ? "from-orange-900/30 to-orange-800/20"
        : "from-orange-50 to-orange-100",
      iconBg: "bg-orange-500",
      textColor: getConfidenceColor(confidenceLevel),
      subtitle: `${stats.direction} • ${stats.sentiment}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, index) => (
        <div
          key={card.title}
          className={`
            relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
            bg-gradient-to-br ${card.bgColor}
            ${
              isDark
                ? "border-gray-700/50 hover:border-gray-600"
                : "border-gray-200/50 hover:border-gray-300"
            }
          `}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-20 h-20 opacity-5">
            <div className={`w-full h-full rounded-full ${card.iconBg}`}></div>
          </div>

          <div className="relative flex items-start justify-between">
            <div className="flex-1">
              <p
                className={`text-sm font-medium mb-1 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {card.title}
              </p>

              <p className={`text-2xl font-bold mb-1 ${card.textColor}`}>
                {card.value}
              </p>

              {card.subtitle && (
                <p
                  className={`text-xs font-medium capitalize ${
                    isDark ? "text-gray-500" : "text-gray-500"
                  }`}
                >
                  {card.subtitle}
                </p>
              )}
            </div>

            {/* Icon container */}
            <div
              className={`
              p-3 rounded-xl ${card.iconBg} shadow-lg
              transform transition-all duration-300 hover:scale-110 hover:rotate-3
            `}
            >
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Progress indicator for confidence */}
          {card.title === "AI Confidence" && (
            <div className="mt-4">
              <div
                className={`w-full h-2 rounded-full ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    confidenceLevel >= 80
                      ? "bg-emerald-500"
                      : confidenceLevel >= 60
                      ? "bg-yellow-500"
                      : "bg-orange-500"
                  }`}
                  style={{ width: `${confidenceLevel}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;
