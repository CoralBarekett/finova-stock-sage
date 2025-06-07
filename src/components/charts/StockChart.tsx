import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface StockChartProps {
  data: Array<{
    date: string;
    price: number;
  }>;
  color?: string;
  predictedData?: Array<{
    date: string;
    price: number;
  }>;
  symbol: string;
}

interface AIAnalysisResult {
  url: string;
  summary: {
    trend: string;
    supportResistance: {
      support: string[];
      resistance: string[];
    };
    indicators: {
      rsi: string;
      macd: string;
      bollingerBands: string;
    };
    recommendations: string[];
  };
  detailedAnalysis: string;
  timestamp: string;
  model: string;
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  color = "#8E9196", // Changed to neutral gray as default
  predictedData,
  symbol,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Chart style variables for better contrast
  const gridColor = isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.15)";
  const axisColor = isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.7)";
  const axisTickColor = isDark
    ? "rgba(255, 255, 255, 0.6)"
    : "rgba(0, 0, 0, 0.7)";
  const tooltipBg = isDark
    ? "rgba(26, 31, 44, 0.95)"
    : "rgba(255, 255, 255, 0.95)";
  const tooltipBorderColor = isDark
    ? "rgba(255, 255, 255, 0.2)"
    : "rgba(0, 0, 0, 0.2)";
  const tooltipTextColor = isDark ? "#fff" : "#333333";

  // Check if we have valid data
  const hasValidData = data && data.length > 0;

  // Create a processed data array that includes both historical and prediction data
  const processedData = hasValidData ? [...data] : [];

  // Create a separate array just for predictions
  let processedPredictions: any[] = [];

  // Determine if prediction is bullish or bearish
  let isPredictionBullish = false;

  if (predictedData && predictedData.length > 0 && hasValidData) {
    const lastHistoricalPrice = data[data.length - 1].price;
    const predictedPrice = predictedData[predictedData.length - 1].price;

    isPredictionBullish = predictedPrice >= lastHistoricalPrice;

    // Create prediction data points
    processedPredictions = predictedData.map((item) => ({
      date: item.date,
      predictedPrice: item.price,
      formattedDate: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));

    // Add the last historical data point to connect the lines
    if (data.length > 0) {
      const lastDataPoint = data[data.length - 1];
      processedPredictions.unshift({
        date: lastDataPoint.date,
        predictedPrice: lastDataPoint.price,
        formattedDate: new Date(lastDataPoint.date).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
          }
        ),
      });
    }
  }

  // Format dates for better display for historical data
  const formattedData = processedData.map((item) => {
    // Ensure date is properly formatted for display
    const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return {
      ...item,
      formattedDate,
    };
  });

  // Combine all data for the chart
  const combinedData = [...formattedData, ...processedPredictions.slice(1)];

  // Calculate domain for y-axis to properly fit the data
  const calculateYDomain = () => {
    if (!hasValidData) return ["auto", "auto"];

    const allPrices = [...formattedData.map((d) => d.price)];
    if (processedPredictions.length > 0) {
      allPrices.push(...processedPredictions.map((d) => d.predictedPrice));
    }

    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);

    // Add 5% padding to the top and bottom
    const padding = (maxPrice - minPrice) * 0.05;
    return [Math.max(0, minPrice - padding), maxPrice + padding];
  };

  // Define prediction line color based on trend
  const predictionColor = isPredictionBullish ? "#4ADE80" : "#ea384c"; // Green for up, red for down

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const response = await fetch(`/PredictStocks/charts/${symbol}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

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

  return (
    <div className="space-y-4">
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={combinedData}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="formattedDate"
              stroke={axisColor}
              tick={{ fill: axisTickColor }}
              tickLine={{ stroke: axisColor }}
              axisLine={{ stroke: axisColor }}
              tickMargin={8}
              minTickGap={10}
            />
            <YAxis
              stroke={axisColor}
              tick={{ fill: axisTickColor }}
              tickLine={{ stroke: axisColor }}
              axisLine={{ stroke: axisColor }}
              domain={calculateYDomain()}
              tickFormatter={(value) => `$${Number(value).toFixed(2)}`}
              width={60}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorderColor,
                color: tooltipTextColor,
                borderRadius: "4px",
                padding: "8px",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
              }}
              formatter={(value: any, name: string) => {
                const formattedValue = `$${Number(value).toFixed(2)}`;
                const displayName =
                  name === "predictedPrice"
                    ? "Predicted Price"
                    : "Current Price";
                return [formattedValue, displayName];
              }}
              labelFormatter={(label) => `Date: ${label}`}
            />
            {/* Historical data line */}
            <Line
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              dot={(props) => {
                // Only show dots for specific intervals to avoid overcrowding
                const index = props.index || 0;
                return index % 5 === 0 ||
                  index === 0 ||
                  index === formattedData.length - 1 ? (
                  <circle
                    key={`dot-${index}`}
                    cx={props.cx}
                    cy={props.cy}
                    r={3}
                    fill={color}
                    stroke={isDark ? "white" : "#333333"}
                    strokeWidth={1}
                  />
                ) : null;
              }}
              activeDot={{
                r: 6,
                fill: color,
                stroke: isDark ? "white" : "#333333",
                strokeWidth: 2,
              }}
              isAnimationActive={true}
              animationDuration={1000}
              connectNulls={true}
              name="Current Price"
            />
            {/* Predicted data line */}
            {predictedData && predictedData.length > 0 && (
              <Line
                type="monotone"
                dataKey="predictedPrice"
                stroke={predictionColor}
                strokeWidth={2.5}
                strokeDasharray="5 5" // Dashed line for predictions
                dot={false}
                activeDot={{
                  r: 6,
                  fill: predictionColor,
                  stroke: isDark ? "white" : "#333333",
                  strokeWidth: 2,
                }}
                isAnimationActive={true}
                animationDuration={1000}
                connectNulls={true}
                name="Predicted Price"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className="flex items-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze with AI"
          )}
        </Button>
      </div>

      {error && <div className="text-red-500 text-center p-4">{error}</div>}

      {analysisResult && (
        <div className="space-y-6 p-4 rounded-lg border border-border">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Analysis Summary</h3>

            <div className="space-y-2">
              <h4 className="font-medium">Trend Analysis</h4>
              <p className="text-muted-foreground">
                {analysisResult.summary.trend}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">Support Levels</h4>
                <div className="space-y-1">
                  {analysisResult.summary.supportResistance.support.map(
                    (level, index) => (
                      <ReactMarkdown
                        key={index}
                        className="text-muted-foreground"
                      >
                        {level}
                      </ReactMarkdown>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Resistance Levels</h4>
                <div className="space-y-1">
                  {analysisResult.summary.supportResistance.resistance.map(
                    (level, index) => (
                      <ReactMarkdown
                        key={index}
                        className="text-muted-foreground"
                      >
                        {level}
                      </ReactMarkdown>
                    )
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Technical Indicators</h4>
              <div className="space-y-2">
                <ReactMarkdown className="text-muted-foreground">
                  {analysisResult.summary.indicators.rsi}
                </ReactMarkdown>
                <ReactMarkdown className="text-muted-foreground">
                  {analysisResult.summary.indicators.macd}
                </ReactMarkdown>
                <ReactMarkdown className="text-muted-foreground">
                  {analysisResult.summary.indicators.bollingerBands}
                </ReactMarkdown>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Recommendations</h4>
              <div className="space-y-2">
                {analysisResult.summary.recommendations.map((rec, index) => (
                  <ReactMarkdown key={index} className="text-muted-foreground">
                    {rec}
                  </ReactMarkdown>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default StockChart;