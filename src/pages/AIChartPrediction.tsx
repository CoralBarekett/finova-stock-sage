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
import { Camera, Activity, Loader2 } from "lucide-react";
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

const AIChartPrediction: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

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

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6">
            <div className="text-red-500 text-center">{error}</div>
          </CardContent>
        </Card>
      )}

      {analysisResult && (
        <Card>
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
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
                        <div key={index} className="text-muted-foreground">
                          <ReactMarkdown>{level}</ReactMarkdown>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Resistance Levels</h4>
                  <div className="space-y-1">
                    {analysisResult.summary.supportResistance.resistance.map(
                      (level, index) => (
                        <div key={index} className="text-muted-foreground">
                          <ReactMarkdown>{level}</ReactMarkdown>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Technical Indicators</h4>
                <div className="space-y-2">
                  <div className="text-muted-foreground">
                    <ReactMarkdown>
                      {analysisResult.summary.indicators.rsi}
                    </ReactMarkdown>
                  </div>
                  <div className="text-muted-foreground">
                    <ReactMarkdown>
                      {analysisResult.summary.indicators.macd}
                    </ReactMarkdown>
                  </div>
                  <div className="text-muted-foreground">
                    <ReactMarkdown>
                      {analysisResult.summary.indicators.bollingerBands}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Recommendations</h4>
                <div className="space-y-2">
                  {analysisResult.summary.recommendations.map((rec, index) => (
                    <div key={index} className="text-muted-foreground">
                      <ReactMarkdown>{rec}</ReactMarkdown>
                    </div>
                  ))}
                </div>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIChartPrediction;
