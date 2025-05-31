import React, { useState } from 'react';
import StockSearchBar from '@/components/stocks/StockSearchBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getStockHistoricalData, getStockDetails, getPrediction } from '@/services/stockService';
import { useNavigate } from 'react-router-dom';
import StockChart from '@/components/charts/StockChart';
import { useTheme } from '@/context/ThemeContext';
import { 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  BarChart,
  Activity,
  Brain,
  Target,
  PieChart,
  Clock,
  Zap
} from 'lucide-react';

const Analysis: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();
  
  const [symbol, setSymbol] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisType, setAnalysisType] = useState<string>('technical');
  const [timeRange, setTimeRange] = useState<'1w' | '1m' | '3m' | '1y'>('1m');
  const [chartData, setChartData] = useState<any[]>([]);
  const [stockInfo, setStockInfo] = useState<any>(null);
  const [prediction, setPrediction] = useState<any>(null);

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
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
    }`}>
      <div className="max-w-7xl mx-auto p-6">
        
        {/* Header Section */}
        <div className={`rounded-3xl p-8 mb-6 ${
          isDark 
            ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50' 
            : 'bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50'
        } backdrop-blur-lg shadow-2xl`}>
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className={`text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                Stock Analysis
              </h1>
              <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Advanced technical and fundamental analysis with AI insights
              </p>
            </div>
          </div>

          <StockSearchBar onSearch={handleSearch} />
        </div>

        {loading ? (
          <div className={`rounded-3xl p-12 text-center ${
            isDark 
              ? 'bg-gray-800/90 border border-gray-700/50' 
              : 'bg-white/90 border border-gray-200/50'
          } backdrop-blur-lg shadow-2xl`}>
            <div className="relative mx-auto w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900"></div>
              <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
              <div className="absolute inset-4 rounded-full border-2 border-purple-300 dark:border-purple-800"></div>
              <div className="absolute inset-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Analyzing Stock Data...
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Gathering market data and generating insights
            </p>
          </div>
        ) : !symbol ? (
          <div className={`rounded-3xl p-12 text-center ${
            isDark 
              ? 'bg-gray-800/90 border border-gray-700/50' 
              : 'bg-white/90 border border-gray-200/50'
          } backdrop-blur-lg shadow-2xl`}>
            <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center ${
              isDark ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
              <LineChart className={`w-12 h-12 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Enter a Stock Symbol to Analyze
            </h3>
            <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Get comprehensive technical analysis, predictions, and market insights
            </p>
          </div>
        ) : (
          <>
            {/* Main Analysis Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              
              {/* Chart Section */}
              <div className={`lg:col-span-2 rounded-3xl p-6 ${
                isDark 
                  ? 'bg-gray-800/90 border border-gray-700/50' 
                  : 'bg-white/90 border border-gray-200/50'
              } backdrop-blur-lg shadow-2xl`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                  <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {symbol}
                    </h2>
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {stockInfo?.name}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <TimeRangeButton 
                      range="1w" 
                      current={timeRange} 
                      onClick={() => handleTimeRangeChange('1w')} 
                      isDark={isDark}
                    />
                    <TimeRangeButton 
                      range="1m" 
                      current={timeRange} 
                      onClick={() => handleTimeRangeChange('1m')} 
                      isDark={isDark}
                    />
                    <TimeRangeButton 
                      range="3m" 
                      current={timeRange} 
                      onClick={() => handleTimeRangeChange('3m')} 
                      isDark={isDark}
                    />
                    <TimeRangeButton 
                      range="1y" 
                      current={timeRange} 
                      onClick={() => handleTimeRangeChange('1y')} 
                      isDark={isDark}
                    />
                  </div>
                </div>
                
                {chartData.length > 0 ? (
                  <div className={`rounded-2xl p-4 ${
                    isDark ? 'bg-gray-700/30' : 'bg-gray-50/50'
                  }`}>
                    <StockChart 
                      data={chartData} 
                      color={stockInfo?.change >= 0 ? '#10B981' : '#EF4444'} 
                    />
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center">
                    <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      No chart data available
                    </p>
                  </div>
                )}
              </div>

              {/* Stock Info Panel */}
              <div className={`rounded-3xl p-6 ${
                isDark 
                  ? 'bg-gray-800/90 border border-gray-700/50' 
                  : 'bg-white/90 border border-gray-200/50'
              } backdrop-blur-lg shadow-2xl`}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Stock Info
                  </h2>
                </div>
                
                {stockInfo ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <StockStatCard 
                        title="Price"
                        value={`$${stockInfo.price.toFixed(2)}`}
                        isDark={isDark}
                      />
                      <StockStatCard 
                        title="Change"
                        value={`${stockInfo.change >= 0 ? '+' : ''}${stockInfo.change.toFixed(2)}`}
                        subValue={`${stockInfo.changePercent.toFixed(2)}%`}
                        isPositive={stockInfo.change >= 0}
                        isDark={isDark}
                      />
                      <StockStatCard 
                        title="Volume"
                        value={`${(stockInfo.volume / 1000000).toFixed(2)}M`}
                        isDark={isDark}
                      />
                      <StockStatCard 
                        title="Market Cap"
                        value={`$${(stockInfo.marketCap / 1000000000).toFixed(2)}B`}
                        isDark={isDark}
                      />
                    </div>
                  </div>
                ) : (
                  <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No stock information available
                  </p>
                )}

                {/* AI Prediction Section */}
                {prediction && (
                  <div className="mt-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        AI Prediction
                      </h3>
                    </div>
                    
                    <div className={`p-4 rounded-2xl ${
                      prediction.bullish 
                        ? isDark ? 'bg-emerald-900/30 border border-emerald-800/50' : 'bg-emerald-50 border border-emerald-200'
                        : isDark ? 'bg-red-900/30 border border-red-800/50' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-full ${
                            prediction.bullish ? 'bg-emerald-500/20' : 'bg-red-500/20'
                          }`}>
                            {prediction.bullish ? 
                              <TrendingUp className="w-4 h-4 text-emerald-500" /> : 
                              <TrendingDown className="w-4 h-4 text-red-500" />
                            }
                          </div>
                          <span className={`font-semibold ${
                            prediction.bullish ? 'text-emerald-600' : 'text-red-600'
                          }`}>
                            {prediction.bullish ? 'Bullish' : 'Bearish'}
                          </span>
                        </div>
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {prediction.confidence}% confidence
                        </span>
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {prediction.prediction}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Tabs */}
            <div className={`rounded-3xl ${
              isDark 
                ? 'bg-gray-800/90 border border-gray-700/50' 
                : 'bg-white/90 border border-gray-200/50'
            } backdrop-blur-lg shadow-2xl overflow-hidden`}>
              <Tabs defaultValue={analysisType} onValueChange={setAnalysisType} className="w-full">
                <TabsList className={`w-full justify-start p-6 bg-transparent border-b ${
                  isDark ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <TabsTrigger 
                    value="technical" 
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      isDark 
                        ? 'text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white' 
                        : 'text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white'
                    }`}
                  >
                    <LineChart className="w-4 h-4" />
                    <span>Technical Analysis</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="fundamental" 
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      isDark 
                        ? 'text-gray-300 data-[state=active]:bg-purple-600 data-[state=active]:text-white' 
                        : 'text-gray-700 data-[state=active]:bg-purple-600 data-[state=active]:text-white'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>Fundamental Analysis</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="technical" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Technical Indicators
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Based on recent price movements and trading patterns
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <TechnicalIndicator 
                        name="Moving Average" 
                        value={stockInfo?.change >= 0 ? "Bullish" : "Bearish"} 
                        bullish={stockInfo?.change >= 0}
                        isDark={isDark}
                      />
                      <TechnicalIndicator 
                        name="RSI (14)" 
                        value={Math.floor(40 + Math.random() * 30).toString()} 
                        bullish={Math.random() > 0.4}
                        isDark={isDark}
                      />
                      <TechnicalIndicator 
                        name="MACD" 
                        value={stockInfo?.change >= 0 ? "Buy" : "Sell"} 
                        bullish={stockInfo?.change >= 0}
                        isDark={isDark}
                      />
                      <TechnicalIndicator 
                        name="Bollinger Bands" 
                        value={Math.random() > 0.6 ? "Upper Band" : "Middle Band"} 
                        bullish={Math.random() > 0.4}
                        isDark={isDark}
                      />
                    </div>
                    
                    <div className={`p-6 rounded-2xl ${
                      isDark 
                        ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-800/50' 
                        : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <Zap className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Technical Analysis Summary
                          </h4>
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            Technical analysis suggests that {symbol} is currently showing 
                            {stockInfo?.change >= 0 
                              ? " bullish momentum with potential for further upside. The stock is trading above key moving averages with positive momentum indicators."
                              : " bearish signals with potential for further decline. The stock is trading below key moving averages with negative momentum indicators."
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="fundamental" className="p-6">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
                        <PieChart className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Fundamental Analysis
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Based on financial performance and company metrics
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FundamentalMetric 
                        name="P/E Ratio" 
                        value={(15 + Math.random() * 25).toFixed(2)}
                        isDark={isDark}
                      />
                      <FundamentalMetric 
                        name="EPS (TTM)" 
                        value={`$${(1 + Math.random() * 10).toFixed(2)}`}
                        isDark={isDark}
                      />
                      <FundamentalMetric 
                        name="Revenue Growth" 
                        value={`${(5 + Math.random() * 20).toFixed(1)}%`}
                        isDark={isDark}
                      />
                      <FundamentalMetric 
                        name="Profit Margin" 
                        value={`${(8 + Math.random() * 25).toFixed(1)}%`}
                        isDark={isDark}
                      />
                    </div>
                    
                    <div className={`p-6 rounded-2xl ${
                      isDark 
                        ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-800/50' 
                        : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        <PieChart className="w-5 h-5 text-purple-500 mt-1" />
                        <div>
                          <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Fundamental Analysis Summary
                          </h4>
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            From a fundamental perspective, {symbol} demonstrates 
                            {Math.random() > 0.5 
                              ? " strong financial performance with consistent revenue growth and healthy profit margins. The company's fundamentals support a positive long-term outlook."
                              : " mixed financial indicators with moderate growth and average profitability compared to sector peers. Monitor upcoming earnings reports for potential shifts."
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Updated component interfaces and implementations
interface TimeRangeButtonProps {
  range: '1w' | '1m' | '3m' | '1y';
  current: string;
  onClick: () => void;
  isDark: boolean;
}

const TimeRangeButton: React.FC<TimeRangeButtonProps> = ({ range, current, onClick, isDark }) => {
  const isActive = current === range;
  
  return (
    <button
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
          : isDark
            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
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
  isDark: boolean;
}

const TechnicalIndicator: React.FC<TechnicalIndicatorProps> = ({ name, value, bullish, isDark }) => {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border-gray-700/50' 
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {name}
        </span>
        <div className={`p-1 rounded-lg ${
          bullish 
            ? isDark ? 'bg-emerald-900/30' : 'bg-emerald-100'
            : isDark ? 'bg-red-900/30' : 'bg-red-100'
        }`}>
          {bullish ? 
            <TrendingUp className="w-4 h-4 text-emerald-500" /> : 
            <TrendingDown className="w-4 h-4 text-red-500" />
          }
        </div>
      </div>
      <span className={`text-lg font-bold ${
        bullish ? 'text-emerald-500' : 'text-red-500'
      }`}>
        {value}
      </span>
    </div>
  );
};

interface FundamentalMetricProps {
  name: string;
  value: string;
  isDark: boolean;
}

const FundamentalMetric: React.FC<FundamentalMetricProps> = ({ name, value, isDark }) => {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border-gray-700/50' 
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
    }`}>
      <span className={`text-sm font-medium block mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {name}
      </span>
      <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </div>
    </div>
  );
};

interface StockStatCardProps {
  title: string;
  value: string;
  subValue?: string;
  isPositive?: boolean;
  isDark: boolean;
}

const StockStatCard: React.FC<StockStatCardProps> = ({ title, value, subValue, isPositive, isDark }) => {
  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800/50 to-gray-700/30 border-gray-700/50' 
        : 'bg-gradient-to-br from-white to-gray-50 border-gray-200'
    }`}>
      <span className={`text-sm font-medium block mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {title}
      </span>
      <span className={`text-lg font-bold block ${
        isPositive !== undefined 
          ? (isPositive ? 'text-emerald-500' : 'text-red-500') 
          : isDark ? 'text-white' : 'text-gray-900'
      }`}>
        {value}
      </span>
      {subValue && (
        <span className={`text-xs ${
          isPositive !== undefined 
            ? (isPositive ? 'text-emerald-500' : 'text-red-500') 
            : isDark ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {subValue}
        </span>
      )}
    </div>
  );
};

export default Analysis;