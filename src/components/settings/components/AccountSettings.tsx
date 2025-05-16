
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
            <div className="p-4 border border-border rounded-md">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <button
                  onClick={navigateToUserProfile}
                  className="text-sm text-primary hover:underline transition-colors flex items-center gap-1"
                >
                  <User className="w-4 h-4" />
                  Manage Account Information
                </button>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="finova-button-destructive w-full flex items-center justify-center gap-2 py-2 rounded-md"
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
