import React, { useState } from "react";
import { Bell, BellRing, TrendingUp, Newspaper } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

const NotificationSettings: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [notifications, setNotifications] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('finovaNotifications');
      return saved ? JSON.parse(saved) : { news: true, alerts: true, updates: true };
    }
    return { news: true, alerts: true, updates: true };
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    const newNotifications = { ...notifications, [type]: value };
    setNotifications(newNotifications);
    if (typeof window !== 'undefined') {
      localStorage.setItem('finovaNotifications', JSON.stringify(newNotifications));
    }
  };

  const notificationTypes = [
    {
      key: 'news',
      label: 'Market News',
      description: 'Breaking news and market updates',
      icon: Newspaper
    },
    {
      key: 'alerts',
      label: 'Price Alerts',
      description: 'Stock price movements and alerts',
      icon: TrendingUp
    },
    {
      key: 'updates',
      label: 'App Updates',
      description: 'New features and improvements',
      icon: BellRing
    }
  ];

  return (
    <div className="max-h-[85vh] overflow-y-auto">
      <div className={`rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 ${
        isDark 
          ? 'bg-gray-800/80 border border-gray-700/50 shadow-xl' 
          : 'bg-white/80 border border-gray-200/50 shadow-xl'
      }`}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
            isDark 
              ? 'bg-gradient-to-br from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/25' 
              : 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/25'
          }`}>
            <Bell className="w-6 h-6 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Notifications
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Customize your notification preferences
          </p>
        </div>

        <div className="space-y-4">
          {notificationTypes.map(({ key, label, description, icon: Icon }) => {
            const isEnabled = notifications[key];
            return (
              <div 
                key={key} 
                className={`
                  rounded-xl p-4 transition-all duration-300
                  ${isDark 
                    ? 'bg-gray-700/30 border border-gray-600' 
                    : 'bg-gray-50/50 border border-gray-200'
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${
                      isEnabled 
                        ? isDark 
                          ? 'bg-blue-500/20 text-blue-400' 
                          : 'bg-blue-100 text-blue-600'
                        : isDark 
                          ? 'bg-gray-600 text-gray-400' 
                          : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {label}
                      </div>
                      <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {description}
                      </div>
                    </div>
                  </div>
                  
                  {/* Custom Toggle Switch */}
                  <button
                    className={`
                      relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center
                      ${isEnabled 
                        ? isDark
                          ? 'bg-blue-500 focus:ring-blue-500'
                          : 'bg-blue-500 focus:ring-blue-500'
                        : isDark
                          ? 'bg-gray-600 focus:ring-gray-500'
                          : 'bg-gray-300 focus:ring-gray-300'
                      }
                      ${isDark ? 'focus:ring-offset-gray-800' : 'focus:ring-offset-white'}
                    `}
                    onClick={() => handleNotificationChange(key, !isEnabled)}
                  >
                    <span 
                      className={`
                        inline-block w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ease-in-out
                        ${isEnabled ? 'translate-x-5' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className={`mt-6 p-4 rounded-xl ${
          isDark 
            ? 'bg-blue-500/10 border border-blue-500/20' 
            : 'bg-blue-50 border border-blue-200'
        }`}>
          <div className="flex items-start space-x-3">
            <Bell className={`w-5 h-5 mt-0.5 ${
              isDark ? 'text-blue-400' : 'text-blue-600'
            }`} />
            <div>
              <h4 className={`font-semibold text-sm ${
                isDark ? 'text-blue-300' : 'text-blue-700'
              }`}>
                Stay Informed
              </h4>
              <p className={`text-xs mt-1 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                Enable notifications to stay updated with market movements and important alerts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;