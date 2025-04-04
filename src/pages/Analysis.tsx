import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import StockSearchBar from '@/components/stocks/StockSearchBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStockHistoricalData, getStockDetails, getPrediction } from '@/services/stockService';
import { useNavigate } from 'react-router-dom';
import StockChart from '@/components/charts/StockChart';
import { LineChart, TrendingUp, TrendingDown, BarChart3, BarChart } from 'lucide-react';

const Analysis: React.FC = () => {
  const [symbol, setSymbol] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisType, setAnalysisType] = useState<string>('technical');
  const [timeRange, setTimeRange] = useState<'1w' | '1m' | '3m' | '1y'>('1m');
  const [chartData, setChartData] = useState<any[]>([]);
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    setSymbol(query);
    setLoading(true);

    try {
      // Get stock details
      const stockDetails = await getStockDetails(query);
      if (!stockDetails) {
        throw new Error('Stock not found');
      }
      setStockInfo(stockDetails);

      // Get historical data based on time range
      const days = timeRange === '1w' ? 7 : timeRange === '1m' ? 30 : timeRange === '3m' ? 90 : 365;
      const historical = await getStockHistoricalData(query, days);
      setChartData(historical);

      // Get prediction
      const predictionData = await getPrediction(query);
      setPrediction(predictionData);
    } catch (error) {
      console.error('Error fetching analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTimeRangeChange = async (range: '1w' | '1m' | '3m' | '1y') => {
    if (!symbol) return;
    
    setTimeRange(range);
    setLoading(true);
    
    try {
      const days = range === '1w' ? 7 : range === '1m' ? 30 : range === '3m' ? 90 : 365;
      const historical = await getStockHistoricalData(symbol, days);
      setChartData(historical);
    } catch (error) {
      console.error('Error updating chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Stock Analysis</h1>
        <p className="text-white/70">Analyze and predict stock performance</p>
      </div>

      <div className="mb-6">
        <StockSearchBar onSearch={handleSearch} />
      </div>

      {loading ? (
        <div className="finova-card p-8 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
          <p className="mt-4 text-white/80">Analyzing stock data...</p>
        </div>
      ) : !symbol ? (
        <div className="finova-card p-8 text-center">
          <LineChart className="w-12 h-12 mx-auto text-finova-primary/70" />
          <p className="mt-4 text-white text-lg">Enter a stock symbol to analyze</p>
          <p className="mt-2 text-white/60">
            Get technical analysis, predictions, and insights
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="finova-card p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{symbol}</h2>
                  <p className="text-white/70">{stockInfo?.name}</p>
                </div>
                <div className="flex space-x-2">
                  <TimeRangeButton range="1w" current={timeRange} onClick={() => handleTimeRangeChange('1w')} />
                  <TimeRangeButton range="1m" current={timeRange} onClick={() => handleTimeRangeChange('1m')} />
                  <TimeRangeButton range="3m" current={timeRange} onClick={() => handleTimeRangeChange('3m')} />
                  <TimeRangeButton range="1y" current={timeRange} onClick={() => handleTimeRangeChange('1y')} />
                </div>
              </div>
              
              {chartData.length > 0 ? (
                <StockChart 
                  data={chartData} 
                  color={stockInfo?.change >= 0 ? '#4ADE80' : '#F87171'} 
                />
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <p className="text-white/70">No chart data available</p>
                </div>
              )}
            </div>

            <div className="finova-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Stock Info</h2>
              {stockInfo ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">Price</span>
                    <span className="text-white font-medium">${stockInfo.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Change</span>
                    <span className={`font-medium ${stockInfo.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stockInfo.change >= 0 ? '+' : ''}{stockInfo.change.toFixed(2)} 
                      ({stockInfo.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Volume</span>
                    <span className="text-white font-medium">
                      {(stockInfo.volume / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Market Cap</span>
                    <span className="text-white font-medium">
                      ${(stockInfo.marketCap / 1000000000).toFixed(2)}B
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-white/70">No stock information available</p>
              )}

              {prediction && (
                <>
                  <h2 className="text-xl font-bold text-white mt-6 mb-4">AI Prediction</h2>
                  <div className="flex items-center mb-3">
                    <div 
                      className={`p-2 rounded-full ${
                        prediction.bullish ? 'bg-green-500/20' : 'bg-red-500/20'
                      }`}
                    >
                      {prediction.bullish ? 
                        <TrendingUp className="w-5 h-5 text-green-400" /> : 
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      }
                    </div>
                    <span className="ml-2 text-white">{prediction.bullish ? 'Bullish' : 'Bearish'}</span>
                    <span className="ml-auto text-white/70">{prediction.confidence}% confidence</span>
                  </div>
                  <p className="text-white/80 text-sm">{prediction.prediction}</p>
                </>
              )}
            </div>
          </div>

          <div className="mb-6">
            <Tabs defaultValue={analysisType} onValueChange={setAnalysisType} className="w-full">
              <TabsList className="bg-white/10 w-full justify-start">
                <TabsTrigger 
                  value="technical" 
                  className="text-white data-[state=active]:bg-white/20 flex items-center"
                >
                  <LineChart className="w-4 h-4 mr-2" />
                  Technical Analysis
                </TabsTrigger>
                <TabsTrigger 
                  value="fundamental" 
                  className="text-white data-[state=active]:bg-white/20 flex items-center"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Fundamental Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="technical" className="mt-4">
                <Card className="border-white/10 bg-white/5 text-white">
                  <CardHeader>
                    <CardTitle>Technical Indicators</CardTitle>
                    <CardDescription className="text-white/70">
                      Based on recent price movements and trading patterns
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <TechnicalIndicator 
                          name="Moving Average" 
                          value={stockInfo?.change >= 0 ? "Bullish" : "Bearish"} 
                          bullish={stockInfo?.change >= 0}
                        />
                        <TechnicalIndicator 
                          name="RSI (14)" 
                          value={Math.floor(40 + Math.random() * 30).toString()} 
                          bullish={Math.random() > 0.4}
                        />
                        <TechnicalIndicator 
                          name="MACD" 
                          value={stockInfo?.change >= 0 ? "Buy" : "Sell"} 
                          bullish={stockInfo?.change >= 0}
                        />
                        <TechnicalIndicator 
                          name="Bollinger Bands" 
                          value={Math.random() > 0.6 ? "Upper Band" : "Middle Band"} 
                          bullish={Math.random() > 0.4}
                        />
                      </div>
                      
                      <div className="finova-card p-4 bg-white/10">
                        <p className="text-white/80 text-sm">
                          Technical analysis suggests that {symbol} is currently showing 
                          {stockInfo?.change >= 0 
                            ? " bullish momentum with potential for further upside. The stock is trading above key moving averages with positive momentum indicators."
                            : " bearish signals with potential for further decline. The stock is trading below key moving averages with negative momentum indicators."
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="fundamental" className="mt-4">
                <Card className="border-white/10 bg-white/5 text-white">
                  <CardHeader>
                    <CardTitle>Fundamental Analysis</CardTitle>
                    <CardDescription className="text-white/70">
                      Based on financial performance and company metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FundamentalMetric 
                          name="P/E Ratio" 
                          value={(15 + Math.random() * 25).toFixed(2)} 
                        />
                        <FundamentalMetric 
                          name="EPS (TTM)" 
                          value={`$${(1 + Math.random() * 10).toFixed(2)}`} 
                        />
                        <FundamentalMetric 
                          name="Revenue Growth" 
                          value={`${(5 + Math.random() * 20).toFixed(1)}%`} 
                        />
                        <FundamentalMetric 
                          name="Profit Margin" 
                          value={`${(8 + Math.random() * 25).toFixed(1)}%`} 
                        />
                      </div>
                      
                      <div className="finova-card p-4 bg-white/10">
                        <p className="text-white/80 text-sm">
                          From a fundamental perspective, {symbol} demonstrates 
                          {Math.random() > 0.5 
                            ? " strong financial performance with consistent revenue growth and healthy profit margins. The company's fundamentals support a positive long-term outlook."
                            : " mixed financial indicators with moderate growth and average profitability compared to sector peers. Monitor upcoming earnings reports for potential shifts."
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </AppLayout>
  );
};

interface TimeRangeButtonProps {
  range: '1w' | '1m' | '3m' | '1y';
  current: string;
  onClick: () => void;
}

const TimeRangeButton: React.FC<TimeRangeButtonProps> = ({ range, current, onClick }) => {
  const isActive = current === range;
  
  return (
    <button
      className={`px-3 py-1 rounded-md text-sm ${
        isActive 
          ? 'bg-finova-primary text-white' 
          : 'bg-white/10 text-white/70 hover:bg-white/20'
      }`}
      onClick={onClick}
    >
      {range}
    </button>
  );
};

interface TechnicalIndicatorProps {
  name: string;
  value: string;
  bullish: boolean;
}

const TechnicalIndicator: React.FC<TechnicalIndicatorProps> = ({ name, value, bullish }) => {
  return (
    <div className="finova-card p-3">
      <span className="text-white/70 text-sm">{name}</span>
      <div className="flex items-center mt-1">
        <span className={`font-medium ${bullish ? 'text-green-400' : 'text-red-400'}`}>
          {value}
        </span>
        {bullish ? 
          <TrendingUp className="w-4 h-4 ml-auto text-green-400" /> : 
          <TrendingDown className="w-4 h-4 ml-auto text-red-400" />
        }
      </div>
    </div>
  );
};

interface FundamentalMetricProps {
  name: string;
  value: string;
}

const FundamentalMetric: React.FC<FundamentalMetricProps> = ({ name, value }) => {
  return (
    <div className="finova-card p-3">
      <span className="text-white/70 text-sm">{name}</span>
      <div className="font-medium text-white mt-1">{value}</div>
    </div>
  );
};

export default Analysis;
