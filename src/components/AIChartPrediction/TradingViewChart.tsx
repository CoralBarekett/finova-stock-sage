import React from "react";
import { Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartDateRange } from "@/types/aiChartPrediction.types";

// Add TradingView type declaration
declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  selectedStock: string;
  setSelectedStock: (stock: string) => void;
  selectedDateRange: ChartDateRange;
  setSelectedDateRange: (range: ChartDateRange) => void;
  loading: boolean;
  popularStocks: string[];
}

const TradingViewWidget: React.FC<{
  symbol: string;
  dateRange: ChartDateRange;
}> = ({ symbol, dateRange }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const widgetRef = React.useRef<any>(null);

  React.useEffect(() => {
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
        try {
          // Only remove if the container still exists in the DOM
          const container = containerRef.current;
          if (container && container.parentNode) {
            widgetRef.current.remove();
          }
        } catch (e) {
          // Silently catch any errors to prevent app crash
          // Optionally, log the error if needed
          // console.error('Error removing TradingView widget:', e);
        }
        widgetRef.current = null;
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
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

export const TradingViewChart: React.FC<TradingViewChartProps> = ({
  selectedStock,
  setSelectedStock,
  selectedDateRange,
  setSelectedDateRange,
  loading,
  popularStocks,
}) => {
  return (
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
  );
};
