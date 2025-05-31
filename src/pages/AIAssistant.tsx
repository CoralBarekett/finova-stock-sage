import React from 'react';
import FinovaBot from '@/components/ai/FinovaBot';
import { MessageSquare, BookOpen, Lightbulb, ChevronRight, Bot, Sparkles, TrendingUp, Crown, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

const AIAssistant: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === 'dark';
    
  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto p-4">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className={`p-3 rounded-xl ${
                isDark 
                  ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25' 
                  : 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25'
              }`}>
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  FinovaBot Assistant
                </h1>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mt-1`}>
                  Your AI-powered financial advisor and market analyst
                </p>
              </div>
            </div>

            {/* Upgrade Button for Free Users */}
            {user && !user.pro && (
              <Link
                to="/settings?tab=pro"
                className={`
                  inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium
                  transition-all duration-300 transform hover:scale-[1.02]
                  ${isDark
                    ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 text-yellow-300 hover:bg-yellow-600/30'
                    : 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 text-yellow-700 hover:bg-yellow-200'
                  }
                `}
              >
                <Zap className="w-4 h-4" />
                <span>Upgrade for Advanced AI Features</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Chat Area */}
          <div className="xl:col-span-3">
            <FinovaBot />
          </div>
           
          {/* Enhanced Tips Sidebar */}
          <div className="xl:col-span-1">
            <div className={`rounded-2xl p-4 backdrop-blur-xl transition-all duration-300 sticky top-4 ${
              isDark 
                ? 'bg-gray-800/80 border border-gray-700/50 shadow-xl' 
                : 'bg-white/80 border border-gray-200/50 shadow-xl'
            }`}>
              <div className="flex items-center space-x-3 mb-4">
                <div className={`p-2 rounded-lg ${
                  isDark 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  AI Guide
                </h2>
              </div>
               
              <div className="space-y-4">
                <AssistantTip
                  icon={<MessageSquare className="w-4 h-4" />}
                  title="Ask Questions"
                  description="Get real-time market data, stock analysis, and investment insights."
                  isDark={isDark}
                  color="blue"
                />
                <AssistantTip
                  icon={<BookOpen className="w-4 h-4" />}
                  title="Learn Finance"
                  description="Understand complex financial concepts explained in simple terms."
                  isDark={isDark}
                  color="green"
                />
                <AssistantTip
                  icon={<TrendingUp className="w-4 h-4" />}
                  title="Market Analysis"
                  description="Deep dive into market trends and sector performance."
                  isDark={isDark}
                  color="purple"
                />
              </div>
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
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const AssistantTip: React.FC<AssistantTipProps> = ({ icon, title, description, isDark, color }) => {
  const colorClasses = {
    blue: isDark ? 'text-blue-400' : 'text-blue-600',
    green: isDark ? 'text-green-400' : 'text-green-600',
    yellow: isDark ? 'text-yellow-400' : 'text-yellow-600',
    purple: isDark ? 'text-purple-400' : 'text-purple-600',
  };

  const bgClasses = {
    blue: isDark ? 'bg-blue-500/20' : 'bg-blue-100',
    green: isDark ? 'bg-green-500/20' : 'bg-green-100',
    yellow: isDark ? 'bg-yellow-500/20' : 'bg-yellow-100',
    purple: isDark ? 'bg-purple-500/20' : 'bg-purple-100',
  };

  return (
    <div className={`flex items-start space-x-3 p-2 rounded-lg transition-colors hover:scale-105 duration-200 ${
      isDark ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'
    }`}>
      <div className={`p-1.5 rounded-lg ${bgClasses[color]}`}>
        <div className={colorClasses[color]}>
          {icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
        <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default AIAssistant;