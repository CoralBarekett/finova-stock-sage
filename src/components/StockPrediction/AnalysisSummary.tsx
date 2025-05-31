import React from 'react';
import { Brain, MessageSquare, Users, TrendingUp, BarChart3, Activity } from 'lucide-react';
import type { PredictionStats } from '@/types/stockPrediction.types';

interface AnalysisSummaryProps {
  isDark: boolean;
  stats: PredictionStats;
}

const AnalysisSummary: React.FC<AnalysisSummaryProps> = ({ isDark, stats }) => {
  const analysisItems = [
    {
      title: 'Social Media Posts',
      value: stats.postsAnalyzed.toLocaleString(),
      icon: MessageSquare,
      description: 'Total posts analyzed',
      color: 'blue'
    },
    {
      title: 'Influencer Posts',
      value: stats.influencerPosts.toLocaleString(),
      icon: Users,
      description: 'High-impact content',
      color: 'purple'
    },
    {
      title: 'Technical Trend',
      value: stats.technicalTrend,
      icon: BarChart3,
      description: 'Market momentum',
      color: 'emerald'
    },
    {
      title: 'Recent Price Change',
      value: `${stats.priceChangePercent >= 0 ? '+' : ''}${stats.priceChangePercent.toFixed(2)}%`,
      icon: stats.priceChangePercent >= 0 ? TrendingUp : Activity,
      description: 'Last 24h movement',
      color: stats.priceChangePercent >= 0 ? 'emerald' : 'red'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: {
        bg: isDark ? 'from-blue-900/20 to-blue-800/10' : 'from-blue-50 to-blue-100/50',
        icon: 'bg-blue-500',
        text: 'text-blue-600'
      },
      purple: {
        bg: isDark ? 'from-purple-900/20 to-purple-800/10' : 'from-purple-50 to-purple-100/50',
        icon: 'bg-purple-500',
        text: 'text-purple-600'
      },
      emerald: {
        bg: isDark ? 'from-emerald-900/20 to-emerald-800/10' : 'from-emerald-50 to-emerald-100/50',
        icon: 'bg-emerald-500',
        text: 'text-emerald-600'
      },
      red: {
        bg: isDark ? 'from-red-900/20 to-red-800/10' : 'from-red-50 to-red-100/50',
        icon: 'bg-red-500',
        text: 'text-red-600'
      }
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`
      p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg
      ${isDark 
        ? 'bg-gradient-to-br from-gray-800/60 to-gray-700/40 border-gray-700/50 hover:border-gray-600' 
        : 'bg-gradient-to-br from-gray-50/60 to-white/80 border-gray-200 hover:border-gray-300'
      }
    `}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="relative">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
        
        <div>
          <h3 className={`text-lg font-bold ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            AI Analysis Summary
          </h3>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Real-time market sentiment and technical indicators
          </p>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {analysisItems.map((item, index) => {
          const colorClasses = getColorClasses(item.color);
          
          return (
            <div
              key={item.title}
              className={`
                relative p-4 rounded-xl transition-all duration-300 hover:scale-105
                bg-gradient-to-br ${colorClasses.bg}
                ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-white/50'}
              `}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-16 h-16 opacity-5">
                <item.icon className="w-full h-full" />
              </div>
              
              <div className="relative">
                {/* Icon */}
                <div className={`
                  inline-flex p-2 rounded-lg ${colorClasses.icon} mb-3
                  transform transition-all duration-300 hover:scale-110 hover:rotate-6
                `}>
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                
                {/* Content */}
                <div>
                  <p className={`text-sm font-medium mb-1 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {item.title}
                  </p>
                  
                  <p className={`text-xl font-bold mb-1 ${colorClasses.text} capitalize`}>
                    {item.value}
                  </p>
                  
                  <p className={`text-xs ${
                    isDark ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className={`
        mt-6 p-4 rounded-xl border-l-4 border-purple-500
        ${isDark ? 'bg-gray-800/30' : 'bg-purple-50/50'}
      `}>
        <div className="flex items-start space-x-3">
          <div className="p-1 rounded bg-purple-500">
            <Brain className="w-3 h-3 text-white" />
          </div>
          
          <div className="flex-1">
            <h4 className={`text-sm font-semibold mb-1 ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              AI Market Insight
            </h4>
            
            <p className={`text-sm leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Based on <span className="font-semibold text-purple-600">{stats.postsAnalyzed}</span> social media posts 
              and technical analysis, the market sentiment is currently{' '}
              <span className={`font-semibold capitalize ${
                stats.sentiment === 'positive' ? 'text-emerald-600' :
                stats.sentiment === 'negative' ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {stats.sentiment}
              </span>
              {' '}with a{' '}
              <span className={`font-semibold capitalize ${
                stats.direction === 'up' ? 'text-emerald-600' :
                stats.direction === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stats.direction === 'up' ? 'bullish' : stats.direction === 'down' ? 'bearish' : 'neutral'}
              </span>
              {' '}bias.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisSummary;