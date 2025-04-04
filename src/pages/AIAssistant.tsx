
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import FinovaBot from '@/components/ai/FinovaBot';
import { MessageSquare, BookOpen, Lightbulb } from 'lucide-react';

const AIAssistant: React.FC = () => {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white">FinovaBot</h1>
          <p className="text-white/70 mt-1">Your AI-powered financial assistant</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FinovaBot />
          </div>
          
          <div className="lg:col-span-1">
            <div className="finova-card p-6 mb-6">
              <h2 className="text-xl font-bold text-white mb-4">How to use FinovaBot</h2>
              
              <div className="space-y-4">
                <AssistantTip
                  icon={<MessageSquare className="w-5 h-5 text-finova-primary" />}
                  title="Ask Questions"
                  description="Ask about stock prices, market trends, or investment advice."
                />
                <AssistantTip
                  icon={<BookOpen className="w-5 h-5 text-finova-primary" />}
                  title="Learn Market Terms"
                  description="Ask for explanations of financial concepts and investment strategies."
                />
                <AssistantTip
                  icon={<Lightbulb className="w-5 h-5 text-finova-primary" />}
                  title="Get Insights"
                  description="Request predictions and analysis based on historical data."
                />
              </div>
            </div>
            
            <div className="finova-card p-6">
              <h2 className="text-xl font-bold text-white mb-4">Example Questions</h2>
              
              <div className="space-y-3">
                <ExampleQuestion question="What's the current price of Tesla stock?" />
                <ExampleQuestion question="Should I invest in Apple right now?" />
                <ExampleQuestion question="Can you predict Amazon's stock for next week?" />
                <ExampleQuestion question="How is the market performing today?" />
                <ExampleQuestion question="What are the best tech stocks to invest in?" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
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
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-white/70 text-sm">{description}</p>
      </div>
    </div>
  );
};

interface ExampleQuestionProps {
  question: string;
}

const ExampleQuestion: React.FC<ExampleQuestionProps> = ({ question }) => {
  return (
    <div 
      className="p-3 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition-colors"
    >
      <p className="text-white/90">{question}</p>
    </div>
  );
};

export default AIAssistant;
