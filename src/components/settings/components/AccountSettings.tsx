import React from "react";
import { User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface AccountSettingsProps {
  onClose: () => void;
  handleLogout: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ onClose, handleLogout }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const navigateToUserProfile = () => {
    onClose();
    navigate('/account/profile');
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-foreground">Account</h3>
      <div className="space-y-4">
        {user ? (
          <>
            {/* Make the entire user info box clickable */}
            <div 
              onClick={navigateToUserProfile}
              className="p-4 border border-border rounded-md cursor-pointer hover:bg-muted transition-colors"
            >
              <div className="flex items-center space-x-3">
                {/* Purple user avatar circle */}
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
            </div>
            
            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 py-2 text-foreground border border-border rounded-md hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/auth"
              className="finova-button w-full flex items-center justify-center gap-2 py-2"
              onClick={onClose}
            >
              <User className="w-4 h-4" />
              Login
            </Link>
            <Link
              to="/auth?tab=register"
              className="border border-border w-full flex items-center justify-center gap-2 py-2 rounded-md hover:bg-muted transition-colors text-foreground"
              onClick={onClose}
            >
              <User className="w-4 h-4" />
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountSettings;