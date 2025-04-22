
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { queryGemini } from '@/services/geminiService';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isLoading?: boolean;
}

const EXAMPLES = [
  "What's the current price of Tesla stock?",
  "Should I invest in Apple right now?",
  "Can you predict Amazon's stock for next week?",
  "How is the market performing today?",
  "What are the best tech stocks to invest in?"
];

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

    // Add a loading message
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
      const response = await queryGemini(actualInput);
      setMessages((prev) =>
        prev.filter(msg => !msg.isLoading).concat({
          id: (Date.now() + 2).toString(),
          text: response.text,
          sender: 'bot',
          timestamp: new Date(),
        })
      );
      if (response.error) {
        toast.error("There was an issue with the AI service. Using fallback response.");
        console.error("Gemini API error:", response.error);
      }
    } catch (error) {
      console.error('Error getting response:', error);
      toast.error("Failed to get a response. Please try again.");
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
    <div className="finova-card flex flex-col h-[calc(100vh-180px)]">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-bold">FinovaBot</h2>
        <p className="text-muted-foreground text-sm">Your AI Financial Assistant</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-accent text-accent-foreground'
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <p>{message.text}</p>
              )}
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex flex-col gap-3">
          <div className="flex items-center">
            <textarea
              className="finova-input flex-1 resize-none rounded-lg"
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
              className={`ml-2 p-2 rounded-full ${
                input.trim() && !isProcessing ? 'bg-primary hover:bg-primary/80' : 'bg-muted'
              } transition-colors`}
              aria-label="Send message"
            >
              <Send className="h-5 w-5 text-primary-foreground" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {EXAMPLES.map((ex) => (
              <button
                type="button"
                className="px-3 py-1 rounded-full bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-accent-foreground text-xs font-medium shadow transition"
                key={ex}
                onClick={() => handleExampleClick(ex)}
                disabled={isProcessing}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinovaBot;
