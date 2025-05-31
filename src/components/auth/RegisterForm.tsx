import React, { useState } from "react";
import { Mail, Key, Facebook, Chrome, User, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
import { useTheme } from "@/context/ThemeContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentForm from "@/components/payment/PaymentForm";

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirm: "",
    pro: false 
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const validateForm = () => {
    let valid = true;
    let err: { name?: string; email?: string; password?: string; confirm?: string } = {};

    if (!form.name) {
      err.name = "Name is required.";
      valid = false;
    }

    if (!form.email) {
      err.email = "Email is required.";
      valid = false;
    } else if (!validateEmail(form.email)) {
      err.email = "Invalid email address.";
      valid = false;
    }
    
    if (!form.password) {
      err.password = "Password is required.";
      valid = false;
    }
    
    if (form.password && form.password.length < 8) {
      err.password = "Password must be at least 8 characters.";
      valid = false;
    }
    
    if (form.password !== form.confirm) {
      err.confirm = "Passwords do not match.";
      valid = false;
    }
    
    setErrors(err);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (form.pro) {
      setShowPaymentDialog(true);
      return;
    }

    await processRegistration();
  };

  const processRegistration = async () => {
    setIsSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.pro);
      
      // Show success toast
      toast({
        title: "Welcome to Finova!",
        description: "Your account has been created successfully.",
      });
      
      // Also show a sonner toast for better visibility
      sonnerToast.success("Registration successful", {
        description: "Redirecting to dashboard..."
      });
      
      // Add a small delay before navigation to ensure auth state is updated
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 100);
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response?.status === 409) {
        setErrors({ email: "Email already in use" });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePro = () => {
    setForm(prev => ({ ...prev, pro: !prev.pro }));
  };

  const handlePaymentSuccess = async () => {
    await processRegistration();
    setShowPaymentDialog(false);
  };

  return (
    <>
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        isDark ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="w-full max-w-lg mx-auto p-6">
          <form onSubmit={handleSubmit} className={`rounded-xl p-8 space-y-6 transition-all duration-300 hover:shadow-lg ${
            isDark 
              ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-purple-500/50' 
              : 'bg-gradient-to-br from-white to-gray-50 shadow-sm hover:shadow-md'
          }`}>
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sign Up
              </h2>
              <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Create your account to get started
              </p>
            </div>

            <div className="space-y-5">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="name">
                  Full Name
                </label>
                <div className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-700/50 border border-gray-600 focus-within:border-purple-500 focus-within:bg-gray-700/70' 
                    : 'bg-gray-50/50 border border-gray-200 focus-within:border-purple-500 focus-within:bg-white'
                }`}>
                  <User className={`w-5 h-5 mr-3 ${
                    isDark ? 'text-purple-400' : 'text-purple-500'
                  }`} />
                  <input
                    className={`flex-1 bg-transparent outline-none text-sm ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    }`}
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <div className="text-xs text-red-400 mt-2 flex items-center">
                  <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                  {errors.name}
                </div>}
              </div>
              
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="email">
                  Email Address
                </label>
                <div className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-700/50 border border-gray-600 focus-within:border-purple-500 focus-within:bg-gray-700/70' 
                    : 'bg-gray-50/50 border border-gray-200 focus-within:border-purple-500 focus-within:bg-white'
                }`}>
                  <Mail className={`w-5 h-5 mr-3 ${
                    isDark ? 'text-purple-400' : 'text-purple-500'
                  }`} />
                  <input
                    className={`flex-1 bg-transparent outline-none text-sm ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    }`}
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <div className="text-xs text-red-400 mt-2 flex items-center">
                  <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                  {errors.email}
                </div>}
              </div>
              
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="password">
                  Password
                </label>
                <div className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-700/50 border border-gray-600 focus-within:border-purple-500 focus-within:bg-gray-700/70' 
                    : 'bg-gray-50/50 border border-gray-200 focus-within:border-purple-500 focus-within:bg-white'
                }`}>
                  <Key className={`w-5 h-5 mr-3 ${
                    isDark ? 'text-purple-400' : 'text-purple-500'
                  }`} />
                  <input
                    className={`flex-1 bg-transparent outline-none text-sm ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    }`}
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Create a strong password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
                {errors.password && <div className="text-xs text-red-400 mt-2 flex items-center">
                  <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                  {errors.password}
                </div>}
              </div>
              
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`} htmlFor="confirm">
                  Confirm Password
                </label>
                <div className={`flex items-center rounded-xl px-4 py-3 transition-all duration-200 ${
                  isDark 
                    ? 'bg-gray-700/50 border border-gray-600 focus-within:border-purple-500 focus-within:bg-gray-700/70' 
                    : 'bg-gray-50/50 border border-gray-200 focus-within:border-purple-500 focus-within:bg-white'
                }`}>
                  <Key className={`w-5 h-5 mr-3 ${
                    isDark ? 'text-purple-400' : 'text-purple-500'
                  }`} />
                  <input
                    className={`flex-1 bg-transparent outline-none text-sm ${
                      isDark ? 'text-white placeholder-gray-400' : 'text-gray-900 placeholder-gray-500'
                    }`}
                    type="password"
                    name="confirm"
                    id="confirm"
                    placeholder="Confirm your password"
                    value={form.confirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>
                {errors.confirm && <div className="text-xs text-red-400 mt-2 flex items-center">
                  <div className="w-1 h-1 bg-red-400 rounded-full mr-2"></div>
                  {errors.confirm}
                </div>}
              </div>
              
              <div className={`rounded-xl p-4 transition-all duration-200 ${
                form.pro 
                  ? isDark 
                    ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                    : 'bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200'
                  : isDark 
                    ? 'bg-gray-700/30 border border-gray-600' 
                    : 'bg-gray-50/50 border border-gray-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="pro-plan"
                    checked={form.pro}
                    onChange={togglePro}
                    className="w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-500 focus:ring-2"
                  />
                  <label htmlFor="pro-plan" className="flex items-center space-x-2 select-none cursor-pointer flex-1">
                    <div className={`p-2 rounded-lg ${
                      form.pro 
                        ? 'bg-yellow-500/20 text-yellow-500' 
                        : isDark ? 'bg-gray-600 text-gray-400' : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Star className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`font-semibold ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        Subscribe to Pro Plan
                      </span>
                      <p className={`text-xs ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Get advanced features and priority support
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`
                w-full py-4 rounded-xl font-semibold text-white
                transition-all duration-300 transform hover:scale-[1.02]
                ${isSubmitting 
                  ? 'opacity-50 cursor-not-allowed' 
                  : form.pro
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 shadow-lg hover:shadow-yellow-500/25'
                    : isDark
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-purple-500/25'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25'
                }
              `}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : form.pro ? (
                <div className="flex items-center justify-center space-x-2">
                  <Star className="w-4 h-4" />
                  <span>Continue to Pro Payment</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="relative my-6">
              <div className={`absolute inset-0 flex items-center ${
                isDark ? 'border-gray-600' : 'border-gray-200'
              }`}>
                <div className={`w-full border-t ${
                  isDark ? 'border-gray-600' : 'border-gray-200'
                }`}></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-4 text-sm font-medium ${
                  isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
                }`}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <button 
                type="button" 
                className={`
                  w-full flex items-center justify-center space-x-3 py-3 rounded-xl font-medium
                  transition-all duration-200 hover:scale-[1.01]
                  ${isDark
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500'
                    : 'bg-gray-50 hover:bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
              >
                <Chrome className="w-5 h-5 text-blue-500" />
                <span>Continue with Google</span>
              </button>
              
              <button 
                type="button" 
                className={`
                  w-full flex items-center justify-center space-x-3 py-3 rounded-xl font-medium
                  transition-all duration-200 hover:scale-[1.01]
                  ${isDark
                    ? 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border border-gray-600 hover:border-gray-500'
                    : 'bg-gray-50 hover:bg-white text-gray-700 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }
                `}
              >
                <Facebook className="w-5 h-5 text-blue-600" />
                <span>Continue with Facebook</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Pro Plan Subscription</DialogTitle>
          </DialogHeader>
          <PaymentForm
            onPaymentSubmit={handlePaymentSuccess}
            onCancel={() => setShowPaymentDialog(false)}
            isProcessing={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </>
    );
  };
  
  export default RegisterForm;