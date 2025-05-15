
import React from 'react';
import FinovaBot from '@/components/ai/FinovaBot';
import { MessageSquare, BookOpen, Lightbulb } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const AIAssistant: React.FC = () => {
  const { theme } = useTheme();
  
  return (
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">FinovaBot</h1>
          <p className="text-muted-foreground mt-1">Your AI-powered financial assistant</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FinovaBot />
          </div>
          
          <div className="lg:col-span-1">
            <div className="finova-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">How to use FinovaBot</h2>
              
              <div className="space-y-4">
                <AssistantTip
                  icon={<MessageSquare className="w-5 h-5 text-primary" />}
                  title="Ask Questions"
                  description="Ask about stock prices, market trends, or investment advice."
                />
                <AssistantTip
                  icon={<BookOpen className="w-5 h-5 text-primary" />}
                  title="Learn Market Terms"
                  description="Ask for explanations of financial concepts and investment strategies."
                />
                <AssistantTip
                  icon={<Lightbulb className="w-5 h-5 text-primary" />}
                  title="Get Insights"
                  description="Request predictions and analysis based on historical data."
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
}

const AssistantTip: React.FC<AssistantTipProps> = ({ icon, title, description }) => {
  return (
    <div className="flex">
      <div className="mt-1">{icon}</div>
      <div className="ml-3">
        <h3 className="text-foreground font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default AIAssistant;
