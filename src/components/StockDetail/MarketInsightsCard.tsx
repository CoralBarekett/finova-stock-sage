import React from 'react';
import { Activity } from 'lucide-react';
import { generateMarketInsights, getInsightStatusStyle } from '@/utils/stockDetailUtils';
import type { MarketInsightsCardProps } from '@/types/stockDetail.types';

const MarketInsightsCard: React.FC<MarketInsightsCardProps> = ({
  stock,
  isDark
}) => {
  const insights = generateMarketInsights(stock);

  return (
    <div className={`rounded-3xl p-8 ${
      isDark 
        ? 'bg-gray-800/90 border border-gray-700/50' 
        : 'bg-white/90 border border-gray-200/50'
    } backdrop-blur-lg shadow-2xl`}>
      
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500">
          <Activity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Market Insights
          </h3>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Real-time analysis
          </p>
        </div>
      </div>
      
      {/* Insights List */}
      <div className="space-y-4">
        {insights.map((insight, index) => {
          const statusStyle = getInsightStatusStyle(insight.status, isDark);
          
          return (
            <div
              key={insight.title}
              className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${statusStyle.bg}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-xl ${statusStyle.icon.replace('text-', 'bg-')}/20`}>
                    <insight.icon className={`w-4 h-4 ${statusStyle.icon}`} />
                  </div>
                  <span className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {insight.title}
                  </span>
                </div>
                
                {/* Status Badge */}
                {insight.badge && (
                  <div className={`px-2 py-1 rounded-lg text-xs font-medium ${statusStyle.badge}`}>
                    {insight.badge}
                  </div>
                )}
              </div>

              {/* Description */}
              <p className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {insight.description}
              </p>

              {/* Details */}
              {insight.details && (
                <p className={`text-xs font-medium ${statusStyle.icon}`}>
                  {insight.details}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className={`mt-6 p-4 rounded-2xl border ${
        isDark 
          ? 'bg-gray-800/30 border-gray-700/50' 
          : 'bg-gray-50/50 border-gray-200'
      }`}>
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-lg bg-blue-500/20">
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h4 className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Market Summary
            </h4>
            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Based on current metrics, {stock.symbol} shows{' '}
              {stock.change >= 0 ? 'positive momentum' : 'mixed signals'} with{' '}
              {stock.volume > 50000000 ? 'strong' : 'moderate'} trading activity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketInsightsCard;