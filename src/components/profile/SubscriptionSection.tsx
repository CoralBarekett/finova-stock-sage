import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { 
  Check, 
  Crown, 
  Zap, 
  Bell, 
  Shield, 
  BarChart4 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import PaymentForm from '@/components/payment/PaymentForm';

interface SubscriptionSectionProps {
  user: any;
  onUpgrade: () => void;
  showPaymentDialog: boolean;
  setShowPaymentDialog: (show: boolean) => void;
  handlePaymentSuccess: () => Promise<void>;
  isProcessingPayment: boolean;
}

const SubscriptionSection: React.FC<SubscriptionSectionProps> = ({
  user,
  onUpgrade,
  showPaymentDialog,
  setShowPaymentDialog,
  handlePaymentSuccess,
  isProcessingPayment
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Get the current date and calculate 1 month from now
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  const formattedNextMonth = nextMonth.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <>
      <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Subscription Details
      </h3>

      <div className="mb-6">
        <div className={`rounded-xl p-6 ${
          user.pro 
            ? isDark 
              ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
              : 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200'
            : isDark 
              ? 'bg-gray-700/30 border border-gray-600' 
              : 'bg-gray-50 border border-gray-200'
        }`}>
          <div className="flex justify-between items-start">
            <div>
              <h4 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user.pro ? "Pro Plan" : "Free Plan"}
              </h4>
              <p className={`text-sm mb-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {user.pro 
                  ? "You're enjoying full access to all premium Finova features."
                  : "You're using the Free plan with limited features."}
              </p>
              
              {user.pro && (
                <p className="text-sm font-medium">
                  <span className="text-green-500 flex items-center gap-1">
                    <Check className="w-4 h-4" /> Active until {formattedNextMonth}
                  </span>
                </p>
              )}
            </div>
            
            {user.pro && (
              <div className={`flex items-center justify-center w-16 h-16 rounded-full ${
                isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'
              }`}>
                <Crown className="w-8 h-8 text-yellow-500" />
              </div>
            )}
          </div>
        </div>
      </div>

      {user.pro ? (
        <div>
          <h4 className={`font-medium text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Your Pro Benefits
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { icon: Zap, title: "AI-powered predictions", desc: "Access to predictive analysis tools" },
              { icon: Bell, title: "Early trend detection", desc: "Get signals before the market moves" },
              { icon: Shield, title: "Priority support", desc: "Get help quickly when you need it" },
              { icon: BarChart4, title: "Advanced reports", desc: "Detailed financial analysis reports" }
            ].map((benefit, index) => (
              <div key={index} className={`flex gap-3 p-4 rounded-xl transition-all duration-300 ${
                isDark 
                  ? 'border border-gray-600 hover:border-purple-500/50 bg-gray-700/30' 
                  : 'border border-gray-200 hover:border-purple-300 bg-gray-50/50'
              }`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0 ${
                  isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'
                }`}>
                  <benefit.icon className="w-5 h-5" />
                </div>
                <div>
                  <h5 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {benefit.title}
                  </h5>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <Button 
              variant="outline" 
              size="sm"
              className={isDark 
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }
            >
              Manage Billing
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h4 className={`font-medium text-lg mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Pro Plan Benefits
            </h4>
            <ul className="space-y-3">
              {[
                "AI-powered stock prediction tools",
                "Early trend detection with Finova signals",
                "Priority customer support",
                "Access to advanced financial reports",
                "Multiple portfolio comparison dashboard"
              ].map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className={`flex flex-col md:flex-row gap-4 items-center p-6 rounded-xl ${
            isDark ? 'bg-gray-700/30' : 'bg-gray-50'
          }`}>
            <div className="flex-1">
              <h5 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Upgrade to Pro
              </h5>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Get access to all Finova premium features
              </p>
            </div>
            
            <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <AlertDialogTrigger asChild>
                <Button 
                  className={`
                    gap-2 px-6 py-3 rounded-xl font-semibold text-white
                    transition-all duration-300 transform hover:scale-[1.02]
                    ${isProcessingPayment 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-yellow-500/25'
                    }
                  `}
                  onClick={onUpgrade}
                  disabled={isProcessingPayment}
                >
                  <Crown className="w-4 h-4" />
                  Upgrade Now
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="sm:max-w-[425px]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Complete Your Pro Subscription</AlertDialogTitle>
                </AlertDialogHeader>
                <PaymentForm
                  onPaymentSubmit={handlePaymentSuccess}
                  onCancel={() => setShowPaymentDialog(false)}
                  isProcessing={isProcessingPayment}
                />
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      )}
    </>
  );
};

export default SubscriptionSection;