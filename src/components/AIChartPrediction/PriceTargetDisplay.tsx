import React from "react";
import type { PriceTargetDisplayProps } from "@/types/aiChartPrediction.types";

export const PriceTargetDisplay: React.FC<PriceTargetDisplayProps> = ({
  label,
  value,
  icon,
  color,
}) => (
  <div className="space-y-1">
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <p className={`text-lg font-semibold ${color}`}>
      {value !== null ? `$${value.toFixed(2)}` : "N/A"}
    </p>
  </div>
);
