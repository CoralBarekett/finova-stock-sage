
import React, { useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import SettingsTabs from "./components/SettingsTabs";

const Settings: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [tab, setTab] = useState<"theme" | "notifications" | "account" | "pro">("theme");
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleClose = () => {
    if (window.location.pathname === '/settings') {
      navigate(-1);
    } else {
      onClose();
    }
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/auth', { replace: true });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-background w-full max-w-md rounded-xl shadow-xl relative">
        <button 
          onClick={handleClose}
          className="absolute right-4 top-4 p-2 rounded-full transition-colors hover:text-primary focus:outline-none"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="flex border-b border-border">
          <button
            className={`flex-1 p-3 font-medium ${
              tab === "theme" ? "border-b-2 border-primary text-primary" : "text-foreground/70"
            }`}
            onClick={() => setTab("theme")}
          >
            Theme
          </button>
          <button
            className={`flex-1 p-3 font-medium ${
              tab === "notifications" ? "border-b-2 border-primary text-primary" : "text-foreground/70"
            }`}
            onClick={() => setTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`flex-1 p-3 font-medium ${
              tab === "account" ? "border-b-2 border-primary text-primary" : "text-foreground/70"
            }`}
            onClick={() => setTab("account")}
          >
            Account
          </button>
          <button
            className={`flex-1 p-3 font-medium ${
              tab === "pro" ? "border-b-2 border-primary text-primary" : "text-foreground/70"
            }`}
            onClick={() => setTab("pro")}
          >
            Pro
          </button>
        </div>

        <SettingsTabs tab={tab} onClose={handleClose} handleLogout={handleLogout} />
      </div>
    </div>
  );
};

export default Settings;
