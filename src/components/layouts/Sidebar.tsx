
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  LineChart, 
  MessageSquare, 
  Search, 
  Settings,
  Home,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  return (
    <div className="w-16 md:w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border flex items-center justify-center md:justify-start">
        <span className="hidden md:block text-2xl font-bold finova-gradient-text">Finova</span>
        <span className="block md:hidden text-2xl font-bold finova-gradient-text">F</span>
      </div>
      
      <nav className="flex-1 py-6">
        <ul className="space-y-2">
          <SidebarItem 
            to="/dashboard" 
            icon={<Home className="w-5 h-5" />} 
            label="Dashboard" 
            active={location.pathname === '/dashboard'} 
          />
          <SidebarItem 
            to="/stocks" 
            icon={<BarChart3 className="w-5 h-5" />} 
            label="Stocks" 
            active={location.pathname === '/stocks' || location.pathname.startsWith('/stocks/')} 
          />
          <SidebarItem 
            to="/analysis" 
            icon={<LineChart className="w-5 h-5" />} 
            label="Analysis" 
            active={location.pathname === '/analysis'} 
          />
          <SidebarItem 
            to="/ai-assistant" 
            icon={<MessageSquare className="w-5 h-5" />} 
            label="AI Assistant" 
            active={location.pathname === '/ai-assistant'} 
          />
          <SidebarItem 
            to="/search" 
            icon={<Search className="w-5 h-5" />} 
            label="Search" 
            active={location.pathname === '/search'} 
          />
          {user?.pro && (
            <SidebarItem 
              to="/simulate" 
              icon={<Star className="w-5 h-5 text-yellow-500" />} 
              label="Simulation" 
              active={location.pathname === '/simulate'} 
              isPro
            />
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <SidebarItem 
          to="/settings" 
          icon={<Settings className="w-5 h-5" />} 
          label="Settings" 
          active={location.pathname === '/settings'} 
        />
      </div>
    </div>
  );
};

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  isPro?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active, isPro }) => {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center px-4 py-3 rounded-md transition-all
          ${active 
            ? 'bg-sidebar-accent text-sidebar-accent-foreground' 
            : 'text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent'
          }`
        }
      >
        <span className="mr-3">{icon}</span>
        <span className="hidden md:block">
          {label} 
          {isPro && <span className="ml-1 text-xs text-yellow-500">(Pro)</span>}
        </span>
      </Link>
    </li>
  );
};

export default Sidebar;
