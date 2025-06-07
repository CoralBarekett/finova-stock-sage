import React from "react";
import { Brain } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import type { AnalysisHeaderProps } from "@/types/aiChartPrediction.types";

export const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  timestamp,
  isDark,
}) => (
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle className="flex items-center space-x-2">
        <Brain className="w-5 h-5 text-purple-500" />
        <span>AI Analysis Results</span>
      </CardTitle>
      <div className="text-sm text-muted-foreground">
        {new Date(timestamp).toLocaleString()}
      </div>
    </div>
  </CardHeader>
);
