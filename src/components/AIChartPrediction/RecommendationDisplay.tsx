import React from "react";
import type { RecommendationDisplayProps } from "@/types/aiChartPrediction.types";

export const RecommendationDisplay: React.FC<RecommendationDisplayProps> = ({
  recommendation,
  confidence,
}) => (
  <div className="space-y-1">
    <p
      className={`text-2xl font-bold ${
        recommendation === "BUY"
          ? "text-emerald-600"
          : recommendation === "SELL"
          ? "text-red-600"
          : "text-yellow-600"
      }`}
    >
      {recommendation}
    </p>
    <div className="flex items-center space-x-2">
      <div
        className={`w-2 h-2 rounded-full ${
          confidence >= 70
            ? "bg-emerald-500"
            : confidence >= 40
            ? "bg-yellow-500"
            : "bg-red-500"
        }`}
      ></div>
      <p className="text-muted-foreground">Confidence: {confidence}%</p>
    </div>
  </div>
);
