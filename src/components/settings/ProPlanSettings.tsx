import React, { useState } from "react";
import { Star, AlertTriangle, User, Crown, Zap, Shield, Target, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import PaymentForm from "@/components/payment/PaymentForm";

interface ProPlanSettingsProps {
  onClose: () => void;
}

const ProPlanSettings: React.FC<ProPlanSettingsProps> = ({ onClose }) => {
  const { user, updateUserPlan } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);

  const isDark = theme === 'dark';

  const navigateToUserProfile = () => {
    onClose();
    navigate('/account/profile');
  };

  const handleProPlanChange = async (isPro: boolean) => {
    if (isPro) {
      setShowPaymentDialog(true);
      return;
    } else {
      setShowDowngradeDialog(true);
    }
  };

  const confirmDowngrade = async () => {
    try {
      setIsProcessingPayment(true);
      await updateUserPlan(false);
      toast.success("Downgraded to Free Plan");
      setIsProcessingPayment(false);
      setShowDowngradeDialog(false);
    } catch (error) {
      toast.error("Failed to update plan. Please try again.");
      setIsProcessingPayment(false);
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
              ? 'bg-gradient-to-br from-yellow-600 to-orange-600 shadow-lg shadow-yellow-500/25' 
              : 'bg-gradient-to-br from-yellow-500 to-orange-500 shadow-lg shadow-yellow-500/25'
          }`}>
            <Crown className="w-6 h-6 text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Plan Management
          </h3>
          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your subscription
          </p>
        </div>

        <div className="space-y-5">
          {user ? (
            <>
              {/* Current Plan Status */}
              <div className={`rounded-lg p-4 ${
                user.pro 
                  ? isDark 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                    : 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200'
                  : isDark 
                    ? 'bg-gray-700/50 border border-gray-600' 
                    : 'bg-gray-50/50 border border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      Current plan:
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${
                        user.pro 
                          ? 'text-yellow-500' 
                          : isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {user.pro ? "Pro" : "Free"}
                      </span>
                      {user.pro && <Star className="text-yellow-500 h-4 w-4" />}
                    </div>
                  </div>
                  {user.pro && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDark 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      Active
                    </div>
                  )}
                </div>
              </div>
              
              {/* Plan Comparison */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Free Plan */}
                <div className={`rounded-lg p-4 transition-all duration-300 ${
                  !user.pro 
                    ? isDark 
                      ? 'bg-purple-500/20 border-2 border-purple-500/50 shadow-lg shadow-purple-500/25' 
                      : 'bg-purple-100 border-2 border-purple-300 shadow-lg shadow-purple-500/25'
                    : isDark 
                      ? 'bg-gray-700/30 border border-gray-600' 
                      : 'bg-gray-50/50 border border-gray-200'
                }`}>
                  <div className="text-center mb-3">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      <User className={`w-5 h-5 ${isDark ? 'text-gray-300' : 'text-gray-600'}`} />
                    </div>
                    <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Free Plan
                    </h4>
                    <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      $0<span className="text-sm font-normal">/month</span>
                    </div>
                  </div>
                  
                  <ul className={`space-y-2 mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-sm">Basic portfolio</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-sm">Limited data</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span className="text-sm">Standard support</span>
                    </li>
                  </ul>
                  
                  {user.pro ? (
                    <div className={`text-center py-2 rounded-lg ${
                      isDark ? 'bg-gray-600/50 text-gray-400' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <span className="text-sm">Available</span>
                    </div>
                  ) : (
                    <div className={`text-center py-2 rounded-lg ${
                      isDark 
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                        : 'bg-purple-100 text-purple-700 border border-purple-200'
                    }`}>
                      <span className="text-sm font-medium">Current</span>
                    </div>
                  )}
                </div>
                
                {/* Pro Plan */}
                <div className={`rounded-lg p-4 transition-all duration-300 relative ${
                  user.pro 
                    ? isDark 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/25' 
                      : 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-300 shadow-lg shadow-yellow-500/25'
                    : isDark 
                      ? 'bg-gray-700/30 border border-gray-600 hover:border-yellow-500/50 hover:shadow-lg hover:shadow-yellow-500/25' 
                      : 'bg-gray-50/50 border border-gray-200 hover:border-yellow-300 hover:shadow-lg hover:shadow-yellow-500/25'
                }`}>
                  {!user.pro && (
                    <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold ${
                      isDark 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    }`}>
                      Recommended
                    </div>
                  )}
                  
                  <div className="text-center mb-3">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-2 ${
                      isDark 
                        ? 'bg-gradient-to-br from-yellow-600 to-orange-600' 
                        : 'bg-gradient-to-br from-yellow-500 to-orange-500'
                    }`}>
                      <Star className="w-5 h-5 text-white" />
                    </div>
                    <h4 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Pro Plan
                    </h4>
                    <div className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      $20<span className="text-sm font-normal">/month</span>
                    </div>
                  </div>
                  
                  <ul className={`space-y-2 mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li className="flex items-center space-x-2">
                      <Zap className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm">Advanced analytics</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <TrendingUp className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm">Market simulation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Shield className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm">Premium support</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Target className="w-3 h-3 text-yellow-500" />
                      <span className="text-sm">Unlimited portfolios</span>
                    </li>
                  </ul>
                  
                  {user.pro ? (
                    <div className={`text-center py-2 rounded-lg ${
                      isDark 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                    }`}>
                      <span className="text-sm font-medium">Current</span>
                    </div>
                  ) : (
                    <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                      <AlertDialogTrigger asChild>
                        <button 
                          onClick={() => handleProPlanChange(true)}
                          className={`
                            w-full py-2 rounded-lg font-semibold text-white text-sm
                            transition-all duration-300 transform hover:scale-[1.02]
                            ${isProcessingPayment 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-yellow-500/25'
                            }
                          `}
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </div>
                          ) : (
                            "Upgrade"
                          )}
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
              
              {/* Downgrade Option */}
              {user.pro && (
                <div className={`rounded-lg p-3 ${
                  isDark ? 'bg-gray-700/30 border border-gray-600' : 'bg-gray-50/50 border border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Need changes?
                      </h4>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        Manage subscription
                      </p>
                    </div>
                    <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
                      <AlertDialogTrigger asChild>
                        <button 
                          className={`
                            px-3 py-1 rounded-lg text-sm font-medium transition-colors
                            ${isDark
                              ? 'text-red-400 hover:bg-red-500/20 hover:text-red-300'
                              : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                            }
                          `}
                        >
                          Manage
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Downgrade to Free?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You'll lose access to:
                            <ul className="mt-2 space-y-1">
                              <li className="flex items-center space-x-2 text-sm">
                                <Zap className="w-3 h-3 text-red-500" />
                                <span>Advanced analytics</span>
                              </li>
                              <li className="flex items-center space-x-2 text-sm">
                                <TrendingUp className="w-3 h-3 text-red-500" />
                                <span>Market simulations</span>
                              </li>
                              <li className="flex items-center space-x-2 text-sm">
                                <Shield className="w-3 h-3 text-red-500" />
                                <span>Premium support</span>
                              </li>
                            </ul>
                            <div className={`mt-3 p-2 rounded-lg text-xs ${
                              isDark 
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                                : 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                            }`}>
                              <strong>Special:</strong> Get 25% off next month! Contact support.
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Pro</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={confirmDowngrade}
                            className="bg-red-600 text-white hover:bg-red-700"
                            disabled={isProcessingPayment}
                          >
                            {isProcessingPayment ? "Processing..." : "Downgrade"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                <User className={`w-6 h-6 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
              <h4 className={`text-base font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sign in required
              </h4>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Please sign in to manage subscription
              </p>
              <Link 
                to="/auth"
                className={`
                  inline-flex items-center px-4 py-2 rounded-lg font-semibold text-white text-sm
                  transition-all duration-300 transform hover:scale-[1.02]
                  ${isDark
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
                  }
                `}
                onClick={onClose}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProPlanSettings;