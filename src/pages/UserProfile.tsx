import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { 
  ArrowLeft, 
  User, 
  CreditCard,
  Bell,
  History,
  Star,
  MessageSquare,
  Crown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import PaymentForm from '@/components/payment/PaymentForm';
import { toast } from 'sonner';

import ProfileInfo from '@/components/profile/ProfileInfo';
import SubscriptionSection from '@/components/profile/SubscriptionSection';
import WatchlistSection from '@/components/profile/WatchlistSection';
import ChatHistorySection from '@/components/profile/ChatHistorySection';

const UserProfile = () => {
  const { user, updateUserPlan } = useAuth();
  const { theme } = useTheme();
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  const isDark = theme === 'dark';

  const handleProUpgrade = async () => {
    setShowPaymentDialog(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      setIsProcessingPayment(true);
      await updateUserPlan(true);
      toast.success("Successfully upgraded to Pro Plan!");
      setIsProcessingPayment(false);
      setShowPaymentDialog(false);
    } catch (error) {
      toast.error("Failed to upgrade plan. Please try again.");
      setIsProcessingPayment(false);
    }
  };

  const handleStartChat = () => {
    navigate('/ai-assistant');
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className={`text-center max-w-md w-full p-8 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
          isDark 
            ? 'bg-gray-800/80 border border-gray-700/50 shadow-xl' 
            : 'bg-white/80 border border-gray-200/50 shadow-xl'
        }`}>
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isDark 
              ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25' 
              : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25'
          }`}>
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Not Authenticated
          </h2>
          <p className={`mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Please sign in to view your profile
          </p>
          <Link to="/auth">
            <Button className={`
              w-full py-3 rounded-xl font-semibold text-white
              transition-all duration-300 transform hover:scale-[1.02]
              ${isDark
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
              }
            `}>
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link to="/dashboard" className={`inline-flex items-center text-sm transition-colors mb-4 ${
            isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
          }`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                My Profile
              </h1>
              <p className={`mt-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Manage your Finova account settings
              </p>
            </div>
            
            {/* Membership Badge */}
            <div className={`mt-4 md:mt-0 px-4 py-2 rounded-full text-sm flex items-center gap-2 font-medium ${
              user.pro 
                ? isDark 
                  ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30' 
                  : 'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200'
                : isDark 
                  ? 'bg-gray-700 text-gray-300 border border-gray-600' 
                  : 'bg-gray-100 text-gray-700 border border-gray-200'
            }`}>
              {user.pro ? (
                <>
                  <Crown className="w-4 h-4" />
                  Pro Member
                </>
              ) : (
                <>
                  <User className="w-4 h-4" />
                  Free Tier
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl p-6 backdrop-blur-xl transition-all duration-300 sticky top-6 ${
              isDark 
                ? 'bg-gray-800/80 border border-gray-700/50 shadow-xl' 
                : 'bg-white/80 border border-gray-200/50 shadow-xl'
            }`}>
              <div className="flex flex-col items-center text-center mb-6">
                <div className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white mb-4 ${
                  isDark 
                    ? 'bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg shadow-purple-500/25' 
                    : 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg shadow-purple-500/25'
                }`}>
                  <User className="w-10 h-10" />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 ${
                    isDark ? 'bg-green-500 border-gray-800' : 'bg-green-500 border-white'
                  }`}></div>
                </div>
                
                <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {user.name}
                </h2>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user.email}
                </p>
              </div>
              
              <div className={`space-y-3 border-t pt-4 ${
                isDark ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    {user.pro ? "Pro Plan" : "Free Plan"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Bell className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Notifications: On
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <History className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`} />
                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>
                    Member since May 2025
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className={`rounded-2xl backdrop-blur-xl transition-all duration-300 ${
              isDark 
                ? 'bg-gray-800/80 border border-gray-700/50 shadow-xl' 
                : 'bg-white/80 border border-gray-200/50 shadow-xl'
            }`}>
              <Tabs defaultValue="info" className="w-full">
                <TabsList className={`w-full rounded-none justify-start p-0 h-auto ${
                  isDark ? 'bg-transparent border-b border-gray-700' : 'bg-transparent border-b border-gray-200'
                }`}>
                  {[
                    { id: 'info', label: 'Account Info', icon: User },
                    { id: 'subscription', label: 'Subscription', icon: CreditCard },
                    { id: 'watchlist', label: 'Watchlist', icon: Star },
                    { id: 'chatHistory', label: 'Chat History', icon: MessageSquare }
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className={`
                        rounded-none border-b-2 border-transparent data-[state=active]:border-purple-500 
                        data-[state=active]:bg-transparent py-4 px-6 transition-colors
                        ${isDark 
                          ? 'text-gray-400 data-[state=active]:text-purple-400 hover:text-gray-300' 
                          : 'text-gray-600 data-[state=active]:text-purple-600 hover:text-gray-700'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="info" className="p-6">
                  <ProfileInfo user={user} />
                </TabsContent>

                <TabsContent value="subscription" className="p-6">
                  <SubscriptionSection 
                    user={user}
                    onUpgrade={handleProUpgrade}
                    showPaymentDialog={showPaymentDialog}
                    setShowPaymentDialog={setShowPaymentDialog}
                    handlePaymentSuccess={handlePaymentSuccess}
                    isProcessingPayment={isProcessingPayment}
                  />
                </TabsContent>

                <TabsContent value="watchlist" className="p-6">
                  <WatchlistSection />
                </TabsContent>

                <TabsContent value="chatHistory" className="p-6">
                  <ChatHistorySection onStartChat={handleStartChat} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;