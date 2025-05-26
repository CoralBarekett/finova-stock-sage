import React from 'react';
import FinovaBot from '@/components/ai/FinovaBot';
import { MessageSquare, BookOpen, Lightbulb, ChevronRight, Bot, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const AIAssistant: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
    
  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 rounded-lg ${
            isDark 
              ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30' 
              : 'bg-gradient-to-br from-purple-100 to-pink-100 border border-purple-200'
          }`}>
            <Bot className={`w-5 h-5 ${
              isDark ? 'text-purple-400' : 'text-purple-600'
            }`} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              FinovaBot
            </h1>
            <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
              Your AI-powered financial assistant
            </p>
          </div>
        </div>
         
        {/* Upgrade button (only visible for free plan users) */}
        {user && !user.pro && (
          <div className="flex justify-start">
            <Link
              to="/settings?tab=pro"
              className={`
                inline-flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                transition-all duration-300 hover:scale-105
                ${isDark
                  ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 text-purple-300 hover:bg-purple-600/30'
                  : 'bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 text-purple-700 hover:bg-purple-200'
                }
              `}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Free Plan - Upgrade to Pro</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Chat Area */}
        <div className="xl:col-span-3">
          <FinovaBot />
        </div>
         
        {/* Tips Sidebar */}
        <div className="xl:col-span-1">
          <div className={`rounded-xl p-6 sticky top-6 ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
              : 'bg-gradient-to-br from-white to-gray-50 shadow-sm border border-gray-200'
          }`}>
            <div className="flex items-center space-x-3 mb-6">
              <div className={`p-2 rounded-lg ${
                isDark 
                  ? 'bg-purple-500/20 text-purple-400' 
                  : 'bg-purple-100 text-purple-600'
              }`}>
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                How to use FinovaBot
              </h2>
            </div>
             
            <div className="space-y-4">
              <AssistantTip
                icon={<MessageSquare className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />}
                title="Ask Questions"
                description="Ask about stock prices, market trends, or investment advice."
                isDark={isDark}
              />
              <AssistantTip
                icon={<BookOpen className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />}
                title="Learn Market Terms"
                description="Ask for explanations of financial concepts and investment strategies."
                isDark={isDark}
              />
              <AssistantTip
                icon={<Lightbulb className={`w-4 h-4 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`} />}
                title="Get Insights"
                description="Request predictions and analysis based on historical data."
                isDark={isDark}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AssistantTipProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isDark: boolean;
}

const AssistantTip: React.FC<AssistantTipProps> = ({ icon, title, description, isDark }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className={`p-1.5 rounded-lg ${
        isDark ? 'bg-gray-700/50' : 'bg-gray-100'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;