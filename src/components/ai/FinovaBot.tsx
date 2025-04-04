
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const getBotResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('tesla') || lowerQuery.includes('tsla')) {
      return "Tesla (TSLA) is currently trading at $267.49, down 1.23% today. The company has been showing strong resilience despite market volatility.";
    } 
    else if (lowerQuery.includes('apple') || lowerQuery.includes('aapl')) {
      return "Apple (AAPL) is trading at $182.63, up 0.87% today. Analysts are bullish on the stock following their latest product announcements.";
    }
    else if (lowerQuery.includes('amazon') || lowerQuery.includes('amzn')) {
      return "Amazon (AMZN) is currently at $178.15, up 1.42% today. The e-commerce giant continues to show strong performance in both retail and cloud services.";
    }
    else if (lowerQuery.includes('invest') || lowerQuery.includes('buy')) {
      return "Based on current market analysis, technology and renewable energy sectors are showing promising growth potential. However, I recommend diversifying your portfolio and considering your risk tolerance before making investment decisions.";
    }
    else if (lowerQuery.includes('predict') || lowerQuery.includes('forecast')) {
      return "My prediction models indicate a potential upward trend in tech stocks over the next quarter, with an estimated 3-5% growth. However, market conditions can change rapidly, so regular portfolio assessment is advised.";
    }
    else {
      return "I'm still learning about specific financial insights. In the future, I'll be able to provide more detailed analysis on various stocks and market trends. Is there anything else I can help you with?";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="finova-card flex flex-col h-[calc(100vh-180px)]">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white">FinovaBot</h2>
        <p className="text-white/70 text-sm">Your AI Financial Assistant</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-finova-primary text-white'
                  : 'bg-white/10 text-white'
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center">
          <textarea
            className="finova-input flex-1 resize-none rounded-lg"
            placeholder="Ask FinovaBot about stocks, market trends, or investment advice..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className={`ml-2 p-2 rounded-full ${
              input.trim() ? 'bg-finova-primary hover:bg-finova-accent' : 'bg-white/10'
            } transition-colors`}
          >
            <Send className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinovaBot;
