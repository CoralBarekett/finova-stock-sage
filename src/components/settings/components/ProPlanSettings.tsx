import React, { useState } from "react";
import { Star, AlertTriangle, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
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
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);

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
      await updateUserPlan(false); // Set pro field to false
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
    <div>
      <h3 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
        <Star className="text-yellow-500" /> Pro Plan
      </h3>
      <div className="space-y-4">
        {user ? (
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
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    Currently using Pro Plan
                  </p>
                ) : (
                  <button 
                    className="w-full py-2 bg-primary/20 text-primary rounded-md cursor-not-allowed"
                    disabled
                  >
                    Current Plan
                  </button>
                )}
              </div>
              
              <div className={`flex-1 p-4 border ${user.pro ? "border-primary" : "border-border"} rounded-md relative`}>
                {!user.pro && <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">Recommended</div>}
                <h4 className="font-medium mb-2 flex items-center gap-1">
                  Pro <Star className="text-yellow-500 h-4 w-4" />
                </h4>
                <ul className="text-sm space-y-1 mb-4 text-foreground/80">
                  <li>• Advanced features</li>
                  <li>• Stock simulation</li>
                  <li>• Premium support</li>
                  <li>• Priority updates</li>
                  <li>• Unlimited portfolios</li>
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
                        {isProcessingPayment ? "Processing..." : "Upgrade"}
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
            
            {user.pro && (
              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
                    <AlertDialogTrigger asChild>
                      <button 
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Manage subscription
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-destructive flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5" />
                          Are you sure you want to downgrade?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Downgrading to the Free plan will immediately remove access to:
                          <ul className="mt-2 space-y-1">
                            <li>• Advanced stock analysis tools</li>
                            <li>• Stock market simulations</li>
                            <li>• Premium support services</li>
                            <li>• Multiple portfolio management</li>
                            <li>• Advanced market insights</li>
                          </ul>
                          <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
                            <strong>Special offer:</strong> Stay on Pro and get 25% off your next month! Contact support to claim this offer.
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep Pro Benefits</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={confirmDowngrade}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          disabled={isProcessingPayment}
                        >
                          {isProcessingPayment ? "Processing..." : "Downgrade Anyway"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-6">
            <p className="mb-4">Please sign in to manage your subscription</p>
            <Link 
              to="/auth"
              className="finova-button py-2 px-4 rounded-md inline-block"
              onClick={onClose}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
      
      {/* Downgrade confirmation dialog */}
      <AlertDialog open={showDowngradeDialog} onOpenChange={setShowDowngradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Are you sure you want to downgrade?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Downgrading to the Free plan will immediately remove access to:
              <ul className="mt-2 space-y-1">
                <li>• Advanced stock analysis tools</li>
                <li>• Stock market simulations</li>
                <li>• Premium support services</li>
                <li>• Multiple portfolio management</li>
                <li>• Advanced market insights</li>
              </ul>
              <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md text-sm">
                <strong>Special offer:</strong> Stay on Pro and get 25% off your next month! Contact support to claim this offer.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Pro Benefits</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDowngrade}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isProcessingPayment}
            >
              {isProcessingPayment ? "Processing..." : "Downgrade Anyway"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProPlanSettings;