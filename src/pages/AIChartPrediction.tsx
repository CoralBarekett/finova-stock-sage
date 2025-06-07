import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Camera,
  Activity,
  Loader2,
  Brain,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Target,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

// Add TradingView type declaration
declare global {
  interface Window {
    TradingView: any;
  }
}

// Get backend API URL from environment variables
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

// Add ChartDateRange enum
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

const getTradingViewInterval = (dateRange: ChartDateRange): string => {
  switch (dateRange) {
    case ChartDateRange.ONE_DAY:
      return "15"; // 15-minute intervals
    case ChartDateRange.FIVE_DAYS:
      return "15"; // 15-minute intervals
    case ChartDateRange.TEN_DAYS:
      return "30"; // 30-minute intervals
    case ChartDateRange.ONE_MONTH:
      return "60"; // 1-hour intervals
    case ChartDateRange.SIX_MONTHS:
      return "D"; // Daily intervals
    case ChartDateRange.ONE_YEAR:
      return "W"; // Weekly intervals
    case ChartDateRange.FIVE_YEARS:
      return "M"; // Monthly intervals
    case ChartDateRange.ALL_TIME:
      return "M"; // Monthly intervals
    default:
      return "D"; // Default to daily
  }
};

interface Gap {
  type: "UP" | "DOWN";
  startPrice: string;
  endPrice: string;
  size: string;
  date: string;
  isFilled: boolean;
}

interface GapAnalysis {
  hasGaps: boolean;
  gaps: Gap[];
  analysis: string;
}

interface AIAnalysisResult {
  url: string;
  summary: {
    currentStatus: string;
    recommendation: string;
    confidence: number;
    shortExplanation: string;
    priceTargets: {
      supportPrice: number;
      resistancePrice: number;
      stopLossPrice: number;
      takeProfitPrice: number;
    };
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

const TradingViewWidget: React.FC<{
  symbol: string;
  dateRange: ChartDateRange;
}> = ({ symbol, dateRange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (!symbol || !containerRef.current) return;

    // Clean up previous widget if it exists
    if (widgetRef.current) {
      widgetRef.current.remove();
      widgetRef.current = null;
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== "undefined") {
        const widget = new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: symbol,
          interval: getTradingViewInterval(dateRange),
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: false,
          height: "700",
          width: "100%",
          studies: [
            "RSI@tv-basicstudies",
            "MACD@tv-basicstudies",
            "BB@tv-basicstudies",
            "MASimple@tv-basicstudies",
          ],
          range: dateRange,
          autosize: true,
          time_frames: [
            { text: "1D", resolution: "15", description: "1 Day" },
            { text: "5D", resolution: "15", description: "5 Days" },
            { text: "10D", resolution: "30", description: "10 Days" },
            { text: "1M", resolution: "60", description: "1 Month" },
            { text: "6M", resolution: "D", description: "6 Months" },
            { text: "1Y", resolution: "W", description: "1 Year" },
            { text: "5Y", resolution: "M", description: "5 Years" },
            { text: "ALL", resolution: "M", description: "All" },
          ],
          overrides: {
            "mainSeriesProperties.candleStyle.upColor": "#26a69a",
            "mainSeriesProperties.candleStyle.downColor": "#ef5350",
            "mainSeriesProperties.candleStyle.wickUpColor": "#26a69a",
            "mainSeriesProperties.candleStyle.wickDownColor": "#ef5350",
          },
        });

        widgetRef.current = widget;
      }
    };
    document.head.appendChild(script);

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
      document.head.removeChild(script);
    };
  }, [symbol, dateRange]);

  return (
    <div
      ref={containerRef}
      id={`tradingview_${symbol}`}
      className="w-full h-[700px]"
    />
  );
};

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

        {/* Brain icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Brain
            className={`w-16 h-16 ${
              isDark ? "text-purple-400" : "text-purple-600"
            } animate-bounce`}
          />
        </div>

        {/* Sparkles effect */}
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

const PriceTargetDisplay: React.FC<{
  label: string;
  value: number | null;
  icon: React.ReactNode;
  color: string;
}> = ({ label, value, icon, color }) => (
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

const AnalysisHeader: React.FC<{
  timestamp: string;
  isDark: boolean;
}> = ({ timestamp, isDark }) => (
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

const RecommendationDisplay: React.FC<{
  recommendation: string;
  confidence: number;
}> = ({ recommendation, confidence }) => (
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

const DetailedAnalysis: React.FC<{
  analysis: AIAnalysisResult["detailedAnalysis"];
}> = ({ analysis }) => (
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

const GapDisplay: React.FC<{
  gap: Gap;
  isDark: boolean;
}> = ({ gap, isDark }) => (
  <div className={`p-3 rounded-lg ${isDark ? "bg-gray-800/50" : "bg-gray-50"}`}>
    <div className="flex items-center justify-between mb-2">
      <span
        className={`text-sm font-medium ${
          gap.type === "UP" ? "text-emerald-600" : "text-red-600"
        }`}
      >
        {gap.type === "UP" ? "Upward Gap" : "Downward Gap"}
      </span>
      <span
        className={`text-xs px-2 py-1 rounded-full ${
          gap.isFilled
            ? "bg-gray-200 text-gray-700"
            : gap.type === "UP"
            ? "bg-emerald-100 text-emerald-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {gap.isFilled ? "Filled" : "Open"}
      </span>
    </div>
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Range:</span>
        <span className="font-medium">
          ${gap.startPrice} - ${gap.endPrice}
        </span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Size:</span>
        <span className="font-medium">${gap.size}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Date:</span>
        <span className="font-medium">{gap.date}</span>
      </div>
    </div>
  </div>
);

const AIChartPrediction: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showDetails, setShowDetails] = useState(false);
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [selectedDateRange, setSelectedDateRange] = useState<ChartDateRange>(
    ChartDateRange.ONE_MONTH
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Popular stocks for the dropdown
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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Stock Chart</CardTitle>
            <div className="flex items-center space-x-4">
              <Select
                value={selectedDateRange}
                onValueChange={(value) =>
                  setSelectedDateRange(value as ChartDateRange)
                }
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ChartDateRange).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStock} onValueChange={setSelectedStock}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a stock" />
                </SelectTrigger>
                <SelectContent>
                  {popularStocks.map((stock) => (
                    <SelectItem key={stock} value={stock}>
                      {stock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="h-[700px] flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-8 h-8 animate-spin mx-auto mb-2" />
                <p className="text-muted-foreground">Loading chart data...</p>
              </div>
            </div>
          ) : selectedStock ? (
            <TradingViewWidget
              symbol={selectedStock}
              dateRange={selectedDateRange}
            />
          ) : (
            <div className="h-[700px] flex items-center justify-center">
              <p className="text-muted-foreground">
                Select a stock to view its chart
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIChartPrediction;
