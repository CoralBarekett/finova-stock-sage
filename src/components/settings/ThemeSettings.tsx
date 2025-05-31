import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Clock, Palette } from "lucide-react";

const ThemeSettings: React.FC = () => {
  const { mode, setMode, theme } = useTheme();
  const isDark = theme === 'dark';

  const themeOptions = [
    {
      value: 'light',
      label: 'Light',
      description: 'Clean and bright interface',
      icon: Sun,
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Easy on the eyes',
      icon: Moon,
      gradient: 'from-slate-600 to-slate-800'
    },
    {
      value: 'auto',
      label: 'Auto',
      description: 'Follows system preference',
      icon: Clock,
      gradient: 'from-blue-500 to-purple-600'
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
              ? 'bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/25' 
              : 'bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/25'
          }`}>
            <Palette className="w-6 h-6 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Theme Preferences
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose your preferred appearance
          </p>
        </div>

        <div className="space-y-3">
          {themeOptions.map(({ value, label, description, icon: Icon, gradient }) => {
            const isSelected = mode === value;
            return (
              <button
                key={value}
                onClick={() => setMode(value as "light" | "dark" | "auto")}
                className={`
                  w-full rounded-xl p-4 transition-all duration-300 text-left
                  ${isSelected 
                    ? isDark 
                      ? 'bg-indigo-500/20 border-2 border-indigo-500/50 shadow-lg shadow-indigo-500/25' 
                      : 'bg-indigo-100 border-2 border-indigo-300 shadow-lg shadow-indigo-500/25'
                    : isDark 
                      ? 'bg-gray-700/30 border border-gray-600 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/25' 
                      : 'bg-gray-50/50 border border-gray-200 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/25'
                  }
                  hover:scale-[1.02] transform
                `}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient} text-white shadow-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {label}
                    </div>
                    <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {description}
                    </div>
                  </div>
                  
                  {/* Selection Indicator */}
                  <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                    isSelected 
                      ? isDark
                        ? 'border-indigo-400 bg-indigo-400'
                        : 'border-indigo-500 bg-indigo-500'
                      : isDark
                        ? 'border-gray-500'
                        : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <div className="w-full h-full rounded-full bg-white scale-50 transition-transform duration-200"></div>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Theme Preview */}
        <div className={`mt-6 p-4 rounded-xl ${
          isDark 
            ? 'bg-indigo-500/10 border border-indigo-500/20' 
            : 'bg-indigo-50 border border-indigo-200'
        }`}>
          <div className="flex items-start space-x-3">
            <Palette className={`w-5 h-5 mt-0.5 ${
              isDark ? 'text-indigo-400' : 'text-indigo-600'
            }`} />
            <div>
              <h4 className={`font-semibold text-sm ${
                isDark ? 'text-indigo-300' : 'text-indigo-700'
              }`}>
                Current Theme: {themeOptions.find(opt => opt.value === mode)?.label}
              </h4>
              <p className={`text-xs mt-1 ${
                isDark ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                {mode === 'auto' 
                  ? 'Theme will automatically switch based on your system settings'
                  : `You're using the ${mode} theme across the entire application`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSettings;