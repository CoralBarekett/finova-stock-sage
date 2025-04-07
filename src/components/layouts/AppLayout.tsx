
import React from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  const { theme } = useTheme();
  
  return (
    <div className={cn(
      "flex h-screen w-full overflow-hidden",
      theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'
    )}>
      <Sidebar />
      <main className={cn("flex-1 overflow-y-auto p-4 md:p-6", className)}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
