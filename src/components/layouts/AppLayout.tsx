
import React from 'react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import ThemeToggle from '../theme/ThemeToggle';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className={cn("flex-1 overflow-y-auto p-4 md:p-6", className)}>
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
