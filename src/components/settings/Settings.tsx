import React from 'react';
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ open, onClose }) => {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Settings</h2>
          {/* Add your settings content here */}
          <p className="text-sm text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Settings;
