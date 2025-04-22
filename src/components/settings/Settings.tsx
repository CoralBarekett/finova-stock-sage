import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Clock, LogIn, User, Key, Eye } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const Settings: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [tab, setTab] = useState<"theme" | "profile">("theme");
  const { mode, setMode } = useTheme();

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
      <div className="bg-background w-full max-w-md rounded-xl shadow-xl">
        {/* Tabs */}
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
              tab === "profile" ? "border-b-2 border-primary text-primary" : "text-foreground/70"
            }`}
            onClick={() => setTab("profile")}
          >
            Profile
          </button>
          <button 
            className="p-2 text-xl absolute top-2 right-4 hover:text-primary/70" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {tab === "theme" && (
            <div>
              <h3 className="text-xl font-bold mb-2">Theme Preferences</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Choose your preferred theme mode. Auto mode switches based on time of day (6 AM - 7 PM).
              </p>
              <ToggleGroup 
                type="single" 
                value={mode}
                onValueChange={(value) => value && setMode(value as "light" | "dark" | "auto")}
                className="flex justify-center gap-2"
              >
                <ToggleGroupItem value="light" aria-label="Light Mode">
                  <Sun className="w-4 h-4 mr-1" />
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" aria-label="Dark Mode">
                  <Moon className="w-4 h-4 mr-1" />
                  Dark
                </ToggleGroupItem>
                <ToggleGroupItem value="auto" aria-label="Auto Mode">
                  <Clock className="w-4 h-4 mr-1" />
                  Auto
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="mt-4 text-xs text-muted-foreground text-center">
                Current time-based recommendation: {new Date().getHours() >= 6 && new Date().getHours() < 19 ? "Light" : "Dark"}
              </p>
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
