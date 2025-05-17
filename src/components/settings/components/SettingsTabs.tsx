import React from "react";
import ThemeSettings from "./ThemeSettings";
import NotificationSettings from "./NotificationSettings";
import AccountSettings from "./AccountSettings";
import ProPlanSettings from "./ProPlanSettings";

interface SettingsTabsProps {
  tab: "theme" | "notifications" | "account" | "pro";
  onClose: () => void;
  handleLogout: () => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({ tab, onClose, handleLogout }) => {
  return (
    <div className="p-6">
      {tab === "theme" && <ThemeSettings />}
      {tab === "notifications" && <NotificationSettings />}
      {tab === "account" && <AccountSettings onClose={onClose} handleLogout={handleLogout} />}
      {tab === "pro" && <ProPlanSettings onClose={onClose} />}
    </div>
  );
};

export default SettingsTabs;