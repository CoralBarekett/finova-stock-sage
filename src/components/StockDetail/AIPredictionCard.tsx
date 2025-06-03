import React from 'react';
import { Brain, Sparkles, ArrowRight, Award } from 'lucide-react';
import PredictionInfo from '@/components/stocks/PredictionInfo';
import { getPredictionFeatures } from '@/utils/stockDetailUtils';
import type { AIPredictionCardProps } from '@/types/stockDetail.types';

const AIPredictionCard: React.FC<AIPredictionCardProps> = ({
  stock,
  predictedData,
  predictionResponse,
  isDark,
  onNavigateToPrediction
}) => {
  const features = getPredictionFeatures();

  return (
    <div className={`rounded-3xl p-8 transition-all duration-300 hover:shadow-2xl ${
      isDark 
        ? 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border border-gray-700/50 hover:border-purple-500/50' 
        : 'bg-gradient-to-br from-white/90 to-gray-50/90 border border-gray-200/50 hover:border-purple-300'
    } backdrop-blur-lg shadow-2xl`}>
      
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="relative">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
        </div>
        <div>
          <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            AI Prediction
          </h2>
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Advanced market intelligence
          </p>
        </div>
      </div>

      {/* Content */}
      {predictedData && predictedData.length > 0 ? (
        /* Show prediction results for premium users */
        <div>
          <PredictionInfo 
            predictions={predictedData} 
            symbol={stock.symbol} 
            predictionDetails={predictionResponse}
          />
        </div>
      ) : (
        /* Show upgrade CTA for free users */
        <>
          {/* Description */}
          <p className={`mb-6 leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Unlock advanced AI-powered stock predictions for{' '}
            <span className="font-bold text-purple-500">{stock.symbol}</span>{' '}
            using cutting-edge sentiment analysis and market intelligence.
          </p>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className={`p-3 rounded-xl border ${
                isDark 
                  ? 'bg-gray-800/50 border-gray-700/50' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-lg bg-purple-500/20">
                    <feature.icon className="w-3 h-3 text-purple-500" />
                  </div>
                  <span className={`text-xs font-medium ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {feature.text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Premium Badge */}
          <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold mb-6 ${
            isDark 
              ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50 text-purple-300 border border-purple-500/50' 
              : 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-300'
          }`}>
            <Award className="w-4 h-4" />
            <span>Premium AI Feature</span>
          </div>

          {/* CTA Button */}
          <button
            onClick={onNavigateToPrediction}
            className="w-full flex items-center justify-center space-x-3 px-8 py-4 rounded-2xl font-bold text-lg text-white transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-xl hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <Brain className="w-5 h-5" />
            <span>Unlock AI Predictions</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Disclaimer */}
          <p className={`text-xs mt-4 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            * AI predictions are for informational purposes only and should not be considered as financial advice.
          </p>
        </>
      )}
    </div>
  );
};

export default AIPredictionCard;