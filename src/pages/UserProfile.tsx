import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  ArrowLeft, 
  User, 
  Pencil, 
  Save,
  CreditCard,
  Bell,
  History,
  Star,
  Check,
  Shield,
  Zap,
  BarChart4,
  MessageSquare
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import PaymentForm from '@/components/payment/PaymentForm';
import { toast } from 'sonner';

const UserProfile = () => {
  const { user, updateUserPlan } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const navigate = useNavigate();

  // Get saved watchlist from localStorage
  const savedWatchlistJson = localStorage.getItem('watchlist');
  const watchlist = savedWatchlistJson ? JSON.parse(savedWatchlistJson) : [];

  // Get chat history from localStorage (we'll add this for the connection)
  const savedChatsJson = localStorage.getItem('userChatHistory');
  const chatHistory = savedChatsJson ? JSON.parse(savedChatsJson) : [];

  const handleSave = () => {
    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

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

  // Get the current date and calculate 1 month from now
  const today = new Date();
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);
  const formattedNextMonth = nextMonth.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleStartChat = () => {
    navigate('/ai-assistant');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
          <User className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-3">Not Authenticated</h2>
          <p className="mb-6 text-muted-foreground">Please sign in to view your profile</p>
          <Link to="/auth">
            <Button className="w-full py-6">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-5xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your Finova account settings</p>
        </div>
        
        {/* Membership Badge */}
        <div className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 font-medium ${user.pro ? "bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200" : "bg-gray-100 text-gray-800 border border-gray-200"}`}>
          {user.pro ? (
            <>
              <Shield className="w-4 h-4 text-amber-500" />
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Profile Summary Card - Left Side */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <User className="w-10 h-10" />
              </div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)} 
                  className="mt-4 w-full gap-1"
                >
                  <Pencil className="w-4 h-4" /> Edit Profile
                </Button>
              )}
            </div>
            
            <div className="space-y-3 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <span>{user.pro ? "Pro Plan" : "Free Plan"}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span>Notifications: On</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <History className="w-4 h-4 text-muted-foreground" />
                <span>Member since May 2025</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area - Right Side */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full border-b rounded-none justify-start p-0 h-auto">
                {[
                  { id: 'info', label: 'Account Info', icon: User },
                  { id: 'subscription', label: 'Subscription', icon: CreditCard },
                  { id: 'watchlist', label: 'Watchlist', icon: Star },
                  { id: 'chatHistory', label: 'Chat History', icon: MessageSquare }
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-4 px-6"
                  >
                    <div className="flex items-center gap-2">
                      <tab.icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="info" className="p-6">
                {isEditing ? (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-4">Edit Profile</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-2">Full Name</label>
                        <Input 
                          value={editedName} 
                          onChange={(e) => setEditedName(e.target.value)} 
                          className="w-full md:w-2/3"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-2">Email Address</label>
                        <Input 
                          value={editedEmail} 
                          onChange={(e) => setEditedEmail(e.target.value)} 
                          className="w-full md:w-2/3"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-2">New Password</label>
                        <Input 
                          type="password" 
                          placeholder="Enter new password" 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          className="w-full md:w-2/3"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Leave blank to keep current password</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4 mt-4 border-t border-gray-100">
                      <Button onClick={handleSave} className="gap-1">
                        <Save className="w-4 h-4" /> Save Changes
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold mb-4">Account Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Full Name</p>
                        <p className="font-medium">{user.name}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Email Address</p>
                        <p className="font-medium">{user.email}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Account Type</p>
                        <p className="font-medium">{user.pro ? "Pro Account" : "Standard Account"}</p>
                      </div>
                      
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Password</p>
                        <p className="font-medium">••••••••</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between mt-4">
                      <div>
                        <p className="font-medium">Account Security</p>
                        <p className="text-sm text-muted-foreground">Enable two-factor authentication for added security</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Set Up 2FA
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="subscription" className="p-6">
                <h3 className="text-xl font-bold mb-6">Subscription Details</h3>

                <div className="mb-6">
                  <div className={`rounded-lg p-6 ${user.pro ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100" : "bg-gray-50 border border-gray-100"}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg mb-1">{user.pro ? "Pro Plan" : "Free Plan"}</h4>
                        <p className="text-muted-foreground text-sm mb-4">
                          {user.pro 
                            ? "You're enjoying full access to all premium Finova features."
                            : "You're using the Free plan with limited features."}
                        </p>
                        
                        {user.pro && (
                          <p className="text-sm font-medium">
                            <span className="text-green-600 flex items-center gap-1">
                              <Check className="w-4 h-4" /> Active until {formattedNextMonth}
                            </span>
                          </p>
                        )}
                      </div>
                      
                      {user.pro && (
                        <div className="flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full">
                          <Shield className="w-8 h-8 text-amber-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {user.pro ? (
                  <div>
                    <h4 className="font-medium text-lg mb-4">Your Pro Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: Zap, title: "AI-powered predictions", desc: "Access to predictive analysis tools" },
                        { icon: Bell, title: "Early trend detection", desc: "Get signals before the market moves" },
                        { icon: Shield, title: "Priority support", desc: "Get help quickly when you need it" },
                        { icon: BarChart4, title: "Advanced reports", desc: "Detailed financial analysis reports" }
                      ].map((benefit, index) => (
                        <div key={index} className="flex gap-3 p-4 rounded-lg border border-gray-100">
                          <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full flex-shrink-0">
                            <benefit.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h5 className="font-medium">{benefit.title}</h5>
                            <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-100">
                      <Button variant="outline" size="sm">
                        Manage Billing
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6">
                      <h4 className="font-medium text-lg mb-4">Pro Plan Benefits</h4>
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
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-6 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-bold text-lg mb-1">Upgrade to Pro</h5>
                        <p className="text-sm text-muted-foreground">Get access to all Finova premium features</p>
                      </div>
                      
                      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                        <AlertDialogTrigger asChild>
                          <Button className="gap-2" onClick={handleProUpgrade}>
                            <Shield className="w-4 h-4" />
                            Upgrade Now
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-lg">
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
              </TabsContent>

              <TabsContent value="watchlist" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">My Stock Watchlist</h3>
                  <Link to="/stocks">
                    <Button variant="outline" size="sm">Manage Watchlist</Button>
                  </Link>
                </div>
                
                {watchlist.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">No stocks in your watchlist</h4>
                    <p className="text-muted-foreground mb-4">Start tracking your favorite stocks to receive updates and alerts</p>
                    <Link to="/stocks">
                      <Button size="sm">Add Your First Stock</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {watchlist.map((stock, index) => (
                      <Link to={`/stocks/${stock.symbol}`} key={index}>
                        <div className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{stock.name}</h4>
                            <p className="text-sm text-muted-foreground">{stock.symbol}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${stock.price}</p>
                            <p className={`text-sm ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.changePercent}%
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="chatHistory" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold">Chat History with FinovaBot</h3>
                  <Button variant="outline" size="sm" onClick={handleStartChat}>
                    Start New Chat
                  </Button>
                </div>
                
                {chatHistory.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">Your chat history will appear here</h4>
                    <p className="text-muted-foreground mb-4">Ask FinovaBot about market trends, stock analysis, and investment advice</p>
                    <Button size="sm" onClick={handleStartChat}>Chat with FinovaBot</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatHistory.map((chat, index) => (
                      <div key={index} className="p-4 border border-gray-100 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{new Date(chat.timestamp).toLocaleDateString()}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">You:</span> {chat.userMessage}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          <span className="font-medium">FinovaBot:</span> {chat.botResponse}
                        </p>
                      </div>
                    ))}
                    <div className="text-center mt-4">
                      <Button size="sm" onClick={handleStartChat}>Continue Chatting</Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;