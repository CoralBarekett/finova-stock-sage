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
  };
  timestamp: string;
  model: string;
}

const TradingViewWidget: React.FC<{ symbol: string }> = ({ symbol }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!symbol || !containerRef.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (typeof window.TradingView !== "undefined") {
        new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: symbol,
          interval: "D",
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
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      id={`tradingview_${symbol}`}
      className="w-full h-[700px]"
    />
  );
};

const LoadingOverlay: React.FC<{ isDark: boolean }> = ({ isDark }) => {
  return (
    <div
      className={`
      fixed inset-0 z-50 flex items-center justify-center
      ${isDark ? "bg-gray-900/80" : "bg-white/80"}
      backdrop-blur-sm transition-all duration-300
    `}
    >
      <div className="text-center space-y-6">
        <div className="relative flex items-center justify-center">
          <div
            className={`
            w-24 h-24 rounded-full
            ${isDark ? "bg-purple-500/20" : "bg-purple-500/10"}
            animate-pulse
            flex items-center justify-center
          `}
          >
            <Brain className="w-12 h-12 text-purple-500 animate-bounce" />
          </div>
        </div>

        <div className="space-y-2">
          <h3
            className={`text-xl font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Analyzing Chart
          </h3>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Our AI is processing technical indicators and market data
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2">
          <div
            className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  );
};

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

const AIChartPrediction: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showDetails, setShowDetails] = useState(false);

  // State management
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

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
        `${BACKEND_API_URL}/charts/${selectedStock}`,
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-500" />
                <span>AI Analysis Results</span>
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                {new Date(analysisResult.timestamp).toLocaleString()}
              </div>
            </div>
          </CardHeader>
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
                  <div className="space-y-1">
                    <p
                      className={`text-2xl font-bold ${
                        analysisResult.summary.recommendation === "BUY"
                          ? "text-emerald-600"
                          : analysisResult.summary.recommendation === "SELL"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {analysisResult.summary.recommendation}
                    </p>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`
                        w-2 h-2 rounded-full
                        ${
                          analysisResult.summary.confidence >= 70
                            ? "bg-emerald-500"
                            : analysisResult.summary.confidence >= 40
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }
                      `}
                      ></div>
                      <p className="text-muted-foreground">
                        Confidence: {analysisResult.summary.confidence}%
                      </p>
                    </div>
                  </div>
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

                {analysisResult.url && (
                  <div className="mt-4">
                    <img
                      src={analysisResult.url}
                      alt="Technical Analysis Chart"
                      className="w-full rounded-lg shadow-lg"
                    />
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
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="font-medium">Detailed Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Trend Analysis</h5>
                      <p className="text-muted-foreground">
                        {analysisResult.detailedAnalysis.trendAnalysis}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Support & Resistance</h5>
                      <p className="text-muted-foreground">
                        {analysisResult.detailedAnalysis.supportResistance}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Technical Indicators</h5>
                      <p className="text-muted-foreground">
                        {analysisResult.detailedAnalysis.technicalIndicators}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium mb-2">Patterns</h5>
                      <p className="text-muted-foreground">
                        {analysisResult.detailedAnalysis.patterns}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Risk Assessment</h5>
                      <p className="text-muted-foreground">
                        {analysisResult.detailedAnalysis.riskAssessment}
                      </p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">
                        Current Technical Position
                      </h5>
                      <p className="text-muted-foreground">
                        {
                          analysisResult.detailedAnalysis
                            .currentTechnicalPosition
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Stock Chart</CardTitle>
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
            <TradingViewWidget symbol={selectedStock} />
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
