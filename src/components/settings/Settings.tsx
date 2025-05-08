import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Clock, Bell, User, LogIn, LogOut, X, Star } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import PaymentForm from "@/components/payment/PaymentForm";

const Settings: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [tab, setTab] = useState<"theme" | "notifications" | "account" | "pro">("theme");
  const { mode, setMode } = useTheme();
  const { user, logout, updateUserPlan, refreshUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Effect to refresh user data when settings dialog opens
  useEffect(() => {
    if (open) {
      refreshUser();
    }
  }, [open, refreshUser]);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('finovaNotifications');
    return saved ? JSON.parse(saved) : { news: true, alerts: true, updates: true };
  });

  const handleNotificationChange = (type: string, value: boolean) => {
    const newNotifications = { ...notifications, [type]: value };
    setNotifications(newNotifications);
    localStorage.setItem('finovaNotifications', JSON.stringify(newNotifications));
  };

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

  const handleProPlanChange = async (isPro: boolean) => {
    if (isPro) {
      setShowPaymentDialog(true);
      return;
    } else {
      // Handle downgrade - use the updateUserPlan function directly
      try {
        setIsProcessingPayment(true);
        await updateUserPlan(false); // Set pro field to false
        toast.success("Downgraded to Free Plan");
        setIsProcessingPayment(false);
      } catch (error) {
        toast.error("Failed to update plan. Please try again.");
        setIsProcessingPayment(false);
      }
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      setIsProcessingPayment(true);
      await updateUserPlan(true);
      toast.success("Upgraded to Pro Plan!");
      setIsProcessingPayment(false);
      setShowPaymentDialog(false);
    } catch (error) {
      toast.error("Failed to update your account. Please contact support.");
      setIsProcessingPayment(false);
    }
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

        <div className="p-6">
          {tab === "theme" && (
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
          )}
          {tab === "notifications" && (
            <div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Notification Settings</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Customize which notifications you want to receive
              </p>
              <div className="space-y-3">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-3 border border-border rounded-md">
                    <div className="flex items-center">
                      <Bell className="w-4 h-4 text-primary mr-3" />
                      <span className="capitalize text-foreground">{key}</span>
                    </div>
                    <button
                      className={`w-12 h-6 rounded-full relative transition-colors ${
                        value ? 'bg-primary' : 'bg-muted'
                      }`}
                      onClick={() => handleNotificationChange(key, !value)}
                    >
                      <span 
                        className={`block w-5 h-5 rounded-full bg-background absolute top-0.5 transition-transform ${
                          value ? 'translate-x-6' : 'translate-x-0.5'
                        }`} 
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "account" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground">Account</h3>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="py-6 flex justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : user ? (
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
                      onClick={handleClose}
                    >
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                    <Link
                      to="/auth?tab=register"
                      className="border border-border w-full flex items-center justify-center gap-2 py-2 rounded-md hover:bg-muted transition-colors text-foreground"
                      onClick={handleClose}
                    >
                      <User className="w-4 h-4" />
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
          {tab === "pro" && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                <Star className="text-yellow-500" /> Pro Plan
              </h3>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="py-6 flex justify-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                  </div>
                ) : user ? (
                  <>
                    <div className="p-4 border border-border rounded-md bg-background shadow-sm">
                      <div className="font-medium mb-2">Your current plan:</div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-lg ${user.pro ? "text-yellow-500 font-bold" : "text-muted-foreground"}`}>
                          {user.pro ? "Pro" : "Free"}
                        </span>
                        {user.pro && <Star className="text-yellow-500 h-4 w-4" />}
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className={`flex-1 p-4 border ${!user.pro ? "border-primary" : "border-border"} rounded-md`}>
                        <h4 className="font-medium mb-2">Free Plan</h4>
                        <ul className="text-sm space-y-1 mb-4 text-foreground/80">
                          <li>• Basic features</li>
                          <li>• Limited analysis</li>
                          <li>• Standard support</li>
                        </ul>
                        {user.pro ? (
                          <button 
                            onClick={() => handleProPlanChange(false)}
                            className="w-full py-2 border border-border rounded-md hover:bg-muted transition-colors text-foreground"
                            disabled={isProcessingPayment}
                          >
                            {isProcessingPayment ? "Processing..." : "Downgrade"}
                          </button>
                        ) : (
                          <button 
                            className="w-full py-2 bg-primary/20 text-primary rounded-md cursor-not-allowed"
                            disabled
                          >
                            Current Plan
                          </button>
                        )}
                      </div>
                      
                      <div className={`flex-1 p-4 border ${user.pro ? "border-primary" : "border-border"} rounded-md`}>
                        <h4 className="font-medium mb-2 flex items-center gap-1">
                          Pro <Star className="text-yellow-500 h-4 w-4" />
                        </h4>
                        <ul className="text-sm space-y-1 mb-4 text-foreground/80">
                          <li>• Advanced features</li>
                          <li>• Stock simulation</li>
                          <li>• Premium support</li>
                        </ul>
                        {user.pro ? (
                          <button 
                            className="w-full py-2 bg-primary/20 text-primary rounded-md cursor-not-allowed"
                            disabled
                          >
                            Current Plan
                          </button>
                        ) : (
                          <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                            <AlertDialogTrigger asChild>
                              <button 
                                onClick={() => handleProPlanChange(true)}
                                className="w-full py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                                disabled={isProcessingPayment}
                              >
                                {isProcessingPayment ? "Processing..." : "Upgrade to Pro Plan"}
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="sm:max-w-[425px]">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Complete Pro Plan Subscription</AlertDialogTitle>
                              </AlertDialogHeader>
                              <PaymentForm
                                onPaymentSubmit={handlePaymentSuccess}
                                onCancel={() => setShowPaymentDialog(false)}
                                isProcessing={isProcessingPayment}
                              />
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <p className="mb-4">Please sign in to manage your subscription</p>
                    <Link 
                      to="/auth"
                      className="finova-button py-2 px-4 rounded-md inline-block"
                      onClick={handleClose}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
