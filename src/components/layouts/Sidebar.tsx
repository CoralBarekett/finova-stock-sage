
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  LineChart, 
  MessageSquare, 
  Search, 
  Settings,
  Home
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="w-16 md:w-64 h-screen bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10 flex items-center justify-center md:justify-start">
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
        </ul>
      </nav>
      
      <div className="p-4 border-t border-white/10">
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
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, active }) => {
  return (
    <li>
      <Link
        to={to}
        className={`flex items-center px-4 py-3 rounded-md transition-all
          ${active 
            ? 'bg-white/10 text-white' 
            : 'text-white/80 hover:text-white hover:bg-white/10'
          }`
        }
      >
        <span className="mr-3">{icon}</span>
        <span className="hidden md:block">{label}</span>
      </Link>
    </li>
  );
};

export default Sidebar;
