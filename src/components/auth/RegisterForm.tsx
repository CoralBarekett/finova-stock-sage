import React, { useState } from "react";
import { Mail, Key, Facebook, Chrome, User, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { toast as sonnerToast } from "sonner";
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
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 finova-card space-y-5">
        <h2 className="text-2xl font-bold mb-2 text-center">Sign Up</h2>
        
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="name">Name</label>
          <div className="flex items-center border rounded-md px-2 bg-white/90">
            <User className="w-4 h-4 mr-2 text-finova-primary" />
            <input
              className="flex-1 bg-transparent outline-none py-2"
              type="text"
              name="name"
              id="name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
          {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name}</div>}
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="email">Email</label>
          <div className="flex items-center border rounded-md px-2 bg-white/90">
            <Mail className="w-4 h-4 mr-2 text-finova-primary" />
            <input
              className="flex-1 bg-transparent outline-none py-2"
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
          {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="password">Password</label>
          <div className="flex items-center border rounded-md px-2 bg-white/90">
            <Key className="w-4 h-4 mr-2 text-finova-primary" />
            <input
              className="flex-1 bg-transparent outline-none py-2"
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
        </div>
        
        <div>
          <label className="block text-sm font-semibold mb-1" htmlFor="confirm">Confirm Password</label>
          <div className="flex items-center border rounded-md px-2 bg-white/90">
            <Key className="w-4 h-4 mr-2 text-finova-primary" />
            <input
              className="flex-1 bg-transparent outline-none py-2"
              type="password"
              name="confirm"
              id="confirm"
              value={form.confirm}
              onChange={handleChange}
              autoComplete="new-password"
            />
          </div>
          {errors.confirm && <div className="text-xs text-red-500 mt-1">{errors.confirm}</div>}
        </div>
        
        <div className="flex items-center gap-2 p-2 border rounded-md bg-white/90">
          <input
            type="checkbox"
            id="pro-plan"
            checked={form.pro}
            onChange={togglePro}
            className="rounded border-gray-300 text-yellow-500 focus:ring-yellow-500"
          />
          <label htmlFor="pro-plan" className="flex items-center gap-1 select-none cursor-pointer">
            <Star className={`w-4 h-4 ${form.pro ? "text-yellow-500" : "text-gray-400"}`} />
            <span>Subscribe to Pro plan</span>
          </label>
        </div>
        
        <button 
          type="submit" 
          className="finova-button w-full rounded-md py-2 font-bold"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "SignUp"}
        </button>
        
        <div className="flex flex-col gap-2 mt-2">
          <button type="button" className="flex items-center justify-center gap-2 border py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition">
            <Chrome className="w-4 h-4 text-blue-500" /> Continue with Google
          </button>
          <button type="button" className="flex items-center justify-center gap-2 border py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition">
            <Facebook className="w-4 h-4 text-blue-600" /> Continue with Facebook
          </button>
        </div>
      </form>

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
