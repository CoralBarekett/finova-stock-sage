import React, { useState } from "react";
import { Bell } from "lucide-react";

const NotificationSettings: React.FC = () => {
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('finovaNotifications');
    return saved ? JSON.parse(saved) : { news: true, alerts: true, updates: true };
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    const newNotifications = { ...notifications, [type]: value };
    setNotifications(newNotifications);
    localStorage.setItem('finovaNotifications', JSON.stringify(newNotifications));
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-2 text-foreground">Notification Settings</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Customize which notifications you want to receive
      </p>
      <div className="space-y-3">
        {Object.entries(notifications).map(([key, value]) => (
          <div key={key} className="flex items-center justify-between p-3 border border-border rounded-md">
            <div className="flex items-center">
              <Bell className="w-4 h-4 text-primary mr-3" />
              <span className="capitalize text-foreground">{key}</span>
            </div>
            <button
              className={`w-12 h-6 rounded-full relative transition-colors ${
                value ? 'bg-primary' : 'bg-muted'
              }`}
              onClick={() => handleNotificationChange(key, !value)}
            >
              <span 
                className={`block w-5 h-5 rounded-full bg-background absolute top-0.5 transition-transform ${
                  value ? 'translate-x-6' : 'translate-x-0.5'
                }`} 
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSettings;