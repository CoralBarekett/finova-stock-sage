import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

interface ChatHistory {
  userMessage: string;
  botResponse: string;
  timestamp: Date;
}

const EXAMPLES = [
  "What's the current price of Tesla stock?",
  "Should I invest in Apple right now?",
  "Can you predict Amazon's stock for next week?",
  "How is the market performing today?",
  "What are the best tech stocks to invest in?"
];

// Mock function to simulate OpenAI API
// const queryOpenAI = async (message: string, isPro: boolean = false) => {
//   await new Promise(resolve => setTimeout(resolve, 1500));
  
//   const proResponse = isPro 
//     ? " As a Pro member, I can provide advanced analysis: This recommendation includes detailed risk assessment, sector comparison, and personalized portfolio optimization suggestions."
//     : "";
    
//   return {
//     text: `Based on your question about "${message}", here's some financial insights: Market conditions are constantly changing, and it's important to consider multiple factors before making investment decisions. Always do your own research and consider consulting with a financial advisor.${proResponse}`,
//     error: null
//   };
// };

const queryOpenAI = async (message: string, isPro: boolean = false) => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  try {
    interface OpenAIResponse {
      choices: {
        message: {
          content: string;
        };
      }[];
    }

    const response = await axios.post<OpenAIResponse>(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: isPro 
              ? "You're FinovaBot, a professional financial assistant. Provide in-depth, strategic, and data-informed responses." 
              : "You're FinovaBot, a friendly financial assistant. Provide general and helpful responses about market trends and stocks."
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content.trim();
    return {
      text: aiMessage,
      error: null
    };
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return {
      text: 'Sorry, something went wrong while contacting the AI service.',
      error: error.message || 'Unknown error'
    };
  }
};

const FinovaBot: React.FC = () => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello! I'm FinovaBot, your AI financial assistant. ${user?.pro ? 'Welcome Pro member! I can provide advanced analysis and personalized recommendations.' : 'I can help you with basic market insights and stock information.'}`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveChatToHistory = (userMessage: string, botResponse: string) => {
    if (typeof window !== 'undefined') {
      const chatHistory: ChatHistory[] = JSON.parse(localStorage.getItem('userChatHistory') || '[]');
      chatHistory.push({
        userMessage,
        botResponse,
        timestamp: new Date()
      });
      localStorage.setItem('userChatHistory', JSON.stringify(chatHistory));
    }
  };

  const handleSend = async (customInput?: string) => {
    const actualInput = typeof customInput === "string" ? customInput : input;
    if (!actualInput.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: actualInput,
      sender: 'user',
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: "Analyzing your request...",
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await queryOpenAI(actualInput, user?.pro || false);
      saveChatToHistory(actualInput, response.text);

      setMessages((prev) =>
        prev.filter(msg => !msg.isLoading).concat({
          id: (Date.now() + 2).toString(),
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
        })
      );
    } catch (error) {
      console.error('Error getting response:', error);
      setMessages((prev) => prev.filter(msg => !msg.isLoading));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleExampleClick = (example: string) => {
    setInput(example);
    setTimeout(() => handleSend(example), 150);
  };

  return (
    <div className={`rounded-2xl backdrop-blur-xl transition-all duration-300 flex flex-col h-[calc(100vh-160px)] ${
      isDark 
        ? 'bg-gray-800/80 border border-gray-700/50 shadow-xl' 
        : 'bg-white/80 border border-gray-200/50 shadow-xl'
    }`}>
      {/* Chat Header */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDark 
                ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25' 
                : 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25'
            }`}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                FinovaBot
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {isProcessing ? 'Analyzing...' : 'Online'}
              </p>
            </div>
          </div>
          
          {user?.pro && (
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isDark 
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
            }`}>
              Pro Mode
            </div>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${
              message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.sender === 'user'
                  ? isDark
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600'
                    : 'bg-gradient-to-br from-purple-500 to-pink-500'
                  : isDark
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-600'
                    : 'bg-gradient-to-br from-blue-500 to-cyan-500'
              }`}>
                {message.sender === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3 rounded-2xl transition-all duration-300 ${
                  message.sender === 'user'
                    ? isDark
                      ? 'bg-gradient-to-r from-purple-600/90 to-pink-600/90 text-white shadow-lg'
                      : 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 text-white shadow-lg'
                    : isDark
                      ? 'bg-gray-700/70 text-gray-100 border border-gray-600'
                      : 'bg-gray-50 text-gray-900 border border-gray-200'
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Sparkles className={`w-4 h-4 animate-spin ${
                      isDark ? 'text-blue-400' : 'text-blue-500'
                    }`} />
                    <span className="text-sm">Thinking...</span>
                    <div className="flex space-x-1">
                      <div className={`w-1 h-1 rounded-full animate-bounce ${
                        isDark ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{ animationDelay: '0ms' }}></div>
                      <div className={`w-1 h-1 rounded-full animate-bounce ${
                        isDark ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{ animationDelay: '150ms' }}></div>
                      <div className={`w-1 h-1 rounded-full animate-bounce ${
                        isDark ? 'bg-gray-400' : 'bg-gray-500'
                      }`} style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <p className={`text-xs mt-2 opacity-70 ${
                      message.sender === 'user' 
                        ? 'text-white/70' 
                        : isDark ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="space-y-3">
          {/* Example Questions */}
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                  isDark
                    ? 'bg-gray-700/50 hover:bg-gray-600 text-gray-300 border border-gray-600 hover:border-blue-500/50'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleExampleClick(example)}
                disabled={isProcessing}
              >
                {example}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                className={`w-full resize-none rounded-xl px-3 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 min-h-[40px] max-h-24 ${
                  isDark
                    ? 'bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                }`}
                placeholder="Ask FinovaBot about stocks, market trends, or investment advice..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                disabled={isProcessing}
              />
            </div>
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isProcessing}
              className={`p-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                input.trim() && !isProcessing
                  ? isDark
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-blue-500/25'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-blue-500/25'
                  : isDark
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
              }`}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          {/* Pro Tip */}
          {!user?.pro && (
            <div className={`text-xs text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Upgrade to Pro for advanced AI analysis and personalized recommendations
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FinovaBot;