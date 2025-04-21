
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { LogIn, User, Key, Eye } from "lucide-react";

/**
 * Simple settings modal with tabs for Theme switching and Profile info.
 * (Mock Profile: hardcoded values.)
 */
const Settings: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [tab, setTab] = useState<"theme" | "profile">("theme");
  const { theme, setTheme } = useTheme();

  // Mock profile state
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane@finova.com",
    accountType: "Pro",
    newPassword: "",
    showPw: false,
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-finova-card-dark rounded-xl shadow-xl max-w-md w-full p-0">
        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 p-3 font-semibold ${tab === "theme" ? "border-b-2 border-finova-primary text-finova-primary" : "text-gray-700"} dark:text-white`}
            onClick={() => setTab("theme")}
          >
            Theme
          </button>
          <button
            className={`flex-1 p-3 font-semibold ${tab === "profile" ? "border-b-2 border-finova-primary text-finova-primary" : "text-gray-700"} dark:text-white`}
            onClick={() => setTab("profile")}
          >
            Profile
          </button>
          <button className="p-2 text-xl absolute top-2 right-4" onClick={onClose} aria-label="Close">×</button>
        </div>
        {/* Content */}
        <div className="p-6">
          {tab === "theme" && (
            <div>
              <h3 className="text-xl font-bold mb-2">Theme</h3>
              <p className="mb-4 text-sm text-gray-600 dark:text-white/70">
                Choose your preferred theme. By default, the site adapts to the time of day.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setTheme("light")}
                  className={`px-4 py-2 rounded-lg border transition ${theme === "light" ? "bg-finova-primary text-white border-finova-primary" : "bg-gray-100 border-gray-200 dark:bg-white/10 dark:border-white/20"}`}
                >Light</button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`px-4 py-2 rounded-lg border transition ${theme === "dark" ? "bg-finova-primary text-white border-finova-primary" : "bg-gray-100 border-gray-200 dark:bg-white/10 dark:border-white/20"}`}
                >Dark</button>
              </div>
              <div className="mt-4 text-xs text-gray-400 dark:text-white/40">
                (After manual selection, time-based switching is paused.)
              </div>
            </div>
          )}
          {tab === "profile" && (
            <div>
              <h3 className="text-xl font-bold mb-2">Profile</h3>
              <p className="text-gray-600 dark:text-white/70 mb-3">Review or update your details.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Name</label>
                  <input
                    className="finova-input rounded-md w-full"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Email</label>
                  <input
                    className="finova-input rounded-md w-full"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Account</label>
                  <input
                    className="finova-input rounded-md w-full"
                    value={profile.accountType}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Change Password</label>
                  <div className="flex items-center">
                    <input
                      className="finova-input rounded-md flex-1"
                      type={profile.showPw ? "text" : "password"}
                      value={profile.newPassword}
                      onChange={e => setProfile({ ...profile, newPassword: e.target.value })}
                    />
                    <button type="button" className="ml-2 text-xs text-gray-500 hover:underline" onClick={() => setProfile(p => ({ ...p, showPw: !p.showPw }))}>
                      {profile.showPw ? <Eye className="w-4 h-4" /> : "Show"}
                    </button>
                  </div>
                </div>
                <div className="pt-2">
                  <button className="finova-button py-2 w-full rounded-md" onClick={() => alert('Profile saved (mock)!')}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
