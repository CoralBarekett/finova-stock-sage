import React from "react";
import { User, LogOut, UserCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

interface AccountSettingsProps {
  onClose: () => void;
  handleLogout: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onClose, handleLogout }) => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  const navigateToUserProfile = () => {
    navigate('/account/profile');
    onClose();
  };

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
              ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25' 
              : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25'
          }`}>
            <UserCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Account Settings
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your profile and preferences
          </p>
        </div>

        <div className="space-y-4">
          {user ? (
            <>
              {/* User Profile Card */}
              <div
                onClick={navigateToUserProfile}
                className={`
                  rounded-xl p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02]
                  ${isDark 
                    ? 'bg-gray-700/50 border border-gray-600 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/25' 
                    : 'bg-gray-50/50 border border-gray-200 hover:border-purple-300 hover:shadow-lg hover:shadow-purple-500/25'
                  }
                `}
              >
                <div className="flex items-center space-x-4">
                  {/* Enhanced Avatar */}
                  <div className={`relative w-14 h-14 rounded-full flex items-center justify-center text-white ${
                    isDark 
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25' 
                      : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25'
                  }`}>
                    <User className="w-7 h-7" />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                      isDark ? 'bg-green-500 border-gray-800' : 'bg-green-500 border-white'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-base truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {user.name}
                    </div>
                    <div className={`text-sm truncate ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.email}
                    </div>
                    {user.pro && (
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        isDark 
                          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        Pro Member
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    View Profile →
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`
                  w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all duration-300
                  ${isDark
                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50'
                    : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300'
                  }
                `}
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </>
          ) : (
            <div className="space-y-3">
              {/* Sign In Button */}
              <Link
                to="/auth"
                className={`
                  w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-semibold text-white
                  transition-all duration-300 transform hover:scale-[1.02]
                  ${isDark
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
                  }
                `}
                onClick={onClose}
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              
              {/* Register Button */}
              <Link
                to="/auth?tab=register"
                className={`
                  w-full flex items-center justify-center space-x-2 py-3 rounded-xl font-medium transition-all duration-300
                  ${isDark
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500'
                    : 'bg-gray-50 hover:bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
                onClick={onClose}
              >
                <User className="w-4 h-4" />
                <span>Create Account</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;