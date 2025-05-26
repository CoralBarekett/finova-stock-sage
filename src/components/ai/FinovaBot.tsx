import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot } from 'lucide-react';

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
const queryOpenAI = async (message: string) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  return {
    text: `Based on your question about "${message}", here's some financial insights: Market conditions are constantly changing, and it's important to consider multiple factors before making investment decisions. Always do your own research and consider consulting with a financial advisor.`,
    error: null
  };
};

const FinovaBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm FinovaBot, your AI financial assistant. How can I help you with stocks today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isDark] = useState(true); // Simulating dark theme

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveChatToHistory = (userMessage: string, botResponse: string) => {
    const chatHistory: ChatHistory[] = JSON.parse(localStorage.getItem('userChatHistory') || '[]');
    chatHistory.push({
      userMessage,
      botResponse,
      timestamp: new Date()
    });
    localStorage.setItem('userChatHistory', JSON.stringify(chatHistory));
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
      text: "Thinking...",
      sender: 'bot',
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsProcessing(true);

    try {
      const response = await queryOpenAI(actualInput);
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
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto p-6">


        <div className="flex flex-col h-[calc(100vh-180px)]">
            <div className={`rounded-xl transition-all duration-300 hover:shadow-lg flex flex-col h-full ${
              isDark 
                ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50' 
                : 'bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md'
            }`}>
              {/* Chat Header */}
              <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex items-center space-x-3">
                  <div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-xl transition-all duration-300 hover:shadow-lg ${
                        message.sender === 'user'
                          ? isDark
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                          : isDark
                            ? 'bg-gray-700/70 text-gray-100 border border-gray-600'
                            : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                      }`}
                    >
                      {message.isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            isDark ? 'bg-gray-400' : 'bg-gray-500'
                          }`} style={{ animationDelay: '0ms' }}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            isDark ? 'bg-gray-400' : 'bg-gray-500'
                          }`} style={{ animationDelay: '150ms' }}></div>
                          <div className={`w-2 h-2 rounded-full animate-bounce ${
                            isDark ? 'bg-gray-400' : 'bg-gray-500'
                          }`} style={{ animationDelay: '300ms' }}></div>
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      )}
                      <p className={`text-xs mt-2 opacity-70 ${
                        message.sender === 'user' ? 'text-white/70' : isDark ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className={`p-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-end space-x-3">
                    <textarea
                      className={`flex-1 resize-none rounded-xl px-4 py-3 text-sm transition-all duration-200 focus:outline-none focus:ring-2 ${
                        isDark
                          ? 'bg-gray-700/50 border border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                          : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500'
                      }`}
                      placeholder="Ask FinovaBot about stocks, market trends, or investment advice..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      rows={1}
                      disabled={isProcessing}
                    />
                    <button
                      onClick={() => handleSend()}
                      disabled={!input.trim() || isProcessing}
                      className={`p-3 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                        input.trim() && !isProcessing
                          ? isDark
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-purple-500/25'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                          : isDark
                            ? 'bg-gray-700 text-gray-400'
                            : 'bg-gray-200 text-gray-500'
                      }`}
                      aria-label="Send message"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Example Questions */}
                  <div className="flex flex-wrap gap-2">
                    {EXAMPLES.map((example) => (
                      <button
                        key={example}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                          isDark
                            ? 'bg-gray-700/50 hover:bg-gray-600 text-gray-300 border border-gray-600'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200'
                        }`}
                        onClick={() => handleExampleClick(example)}
                        disabled={isProcessing}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FinovaBot;