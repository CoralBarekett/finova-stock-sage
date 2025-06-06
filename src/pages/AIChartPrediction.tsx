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
import { Camera, Activity } from "lucide-react";

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
          disabled={!selectedStock || loading}
        >
          <Camera className="w-4 h-4" />
          <span>Analyze with AI</span>
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
    </div>
  );
};

export default AIChartPrediction;
