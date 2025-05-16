
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Clock } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const ThemeSettings: React.FC = () => {
  const { mode, setMode } = useTheme();

  return (
    <div>
      <h3 className="text-xl font-bold mb-2 text-foreground">Theme Preferences</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        Choose your preferred theme mode
      </p>
      <ToggleGroup 
        type="single" 
        value={mode}
        onValueChange={(value) => value && setMode(value as "light" | "dark" | "auto")}
        className="flex justify-center gap-2"
      >
        <ToggleGroupItem value="light" aria-label="Light Mode" className="flex items-center gap-2">
          <Sun className="w-4 h-4" />
          Light
        </ToggleGroupItem>
        <ToggleGroupItem value="dark" aria-label="Dark Mode" className="flex items-center gap-2">
          <Moon className="w-4 h-4" />
          Dark
        </ToggleGroupItem>
        <ToggleGroupItem value="auto" aria-label="Auto Mode" className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Auto
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ThemeSettings;
