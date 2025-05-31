import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { MessageSquare, Bot, User, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatHistorySectionProps {
  onStartChat: () => void;
}

const ChatHistorySection: React.FC<ChatHistorySectionProps> = ({ onStartChat }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Get chat history from localStorage
  const savedChatsJson = typeof window !== 'undefined' ? localStorage.getItem('userChatHistory') : null;
  const chatHistory = savedChatsJson ? JSON.parse(savedChatsJson) : [];

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Chat History with FinovaBot
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onStartChat}
          className={`transition-all duration-300 ${isDark 
            ? 'border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-blue-500/50' 
            : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-300'
          }`}
        >
          Start New Chat
        </Button>
      </div>
      
      {chatHistory.length === 0 ? (
        <div className={`rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDark ? 'border-gray-600 bg-gray-700/20' : 'border-gray-300 bg-gray-50/50'
        }`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isDark ? 'bg-blue-500/20' : 'bg-blue-100'
          }`}>
            <MessageSquare className={`w-8 h-8 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
          </div>
          <h4 className={`text-lg font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your chat history will appear here
          </h4>
          <p className={`mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Ask FinovaBot about market trends, stock analysis, and investment advice
          </p>
          <Button 
            size="sm" 
            onClick={onStartChat}
            className={`
              px-6 py-3 rounded-xl font-semibold text-white
              transition-all duration-300 transform hover:scale-[1.02]
              ${isDark
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-blue-500/25'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-blue-500/25'
              }
            `}
          >
            Chat with FinovaBot
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded-xl mb-4 ${
            isDark ? 'bg-gray-700/30 border border-gray-600' : 'bg-gray-50 border border-gray-200'
          }`}>
            <div className="flex items-center justify-between text-sm">
              <span className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {chatHistory.length} {chatHistory.length === 1 ? 'conversation' : 'conversations'}
              </span>
              <div className="flex items-center gap-2">
                <Bot className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-500'}`} />
                <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  FinovaBot Assistant
                </span>
              </div>
            </div>
          </div>
          
          {chatHistory.map((chat, index) => (
            <div key={index} className={`
              group p-5 rounded-xl transition-all duration-300 hover:scale-[1.01]
              ${isDark 
                ? 'border border-gray-600 bg-gray-700/30 hover:bg-gray-700/50 hover:border-blue-500/50' 
                : 'border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-blue-300'
              }
            `}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatDate(chat.timestamp)}
                  </h4>
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {formatTime(chat.timestamp)}
                </p>
              </div>
              
              <div className="space-y-3">
                {/* User Message */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      You asked:
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} break-words`}>
                      {chat.userMessage}
                    </p>
                  </div>
                </div>
                
                {/* Bot Response */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      FinovaBot replied:
                    </p>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} break-words line-clamp-2`}>
                      {chat.botResponse}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Continue Chat Button */}
              <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                <button
                  onClick={onStartChat}
                  className={`
                    w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium
                    transition-all duration-300 opacity-0 group-hover:opacity-100
                    ${isDark
                      ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }
                  `}
                >
                  <span>Continue this conversation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          <div className="text-center pt-4">
            <Button 
              size="sm" 
              onClick={onStartChat}
              className={`
                px-6 py-3 rounded-xl font-semibold text-white
                transition-all duration-300 transform hover:scale-[1.02]
                ${isDark
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg hover:shadow-blue-500/25'
                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-lg hover:shadow-blue-500/25'
                }
              `}
            >
              Start New Conversation
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatHistorySection;