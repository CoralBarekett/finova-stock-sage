import React from "react";
import type { DetailedAnalysisProps } from "@/types/aiChartPrediction.types";

export const DetailedAnalysis: React.FC<DetailedAnalysisProps> = ({
  analysis,
}) => (
  <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
    <h4 className="font-medium">Detailed Analysis</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h5 className="font-medium mb-2">Trend Analysis</h5>
          <p className="text-muted-foreground">{analysis.trendAnalysis}</p>
        </div>
        <div>
          <h5 className="font-medium mb-2">Support & Resistance</h5>
          <p className="text-muted-foreground">{analysis.supportResistance}</p>
        </div>
        <div>
          <h5 className="font-medium mb-2">Technical Indicators</h5>
          <p className="text-muted-foreground">
            {analysis.technicalIndicators}
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <h5 className="font-medium mb-2">Patterns</h5>
          <p className="text-muted-foreground">{analysis.patterns}</p>
        </div>
        <div>
          <h5 className="font-medium mb-2">Risk Assessment</h5>
          <p className="text-muted-foreground">{analysis.riskAssessment}</p>
        </div>
        <div>
          <h5 className="font-medium mb-2">Current Technical Position</h5>
          <p className="text-muted-foreground">
            {analysis.currentTechnicalPosition}
          </p>
        </div>
      </div>
    </div>
  </div>
);
