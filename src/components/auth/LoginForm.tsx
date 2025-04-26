
import React, { useState } from "react";
import { Mail, Key, Facebook, Chrome } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const LoginForm: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    let err: { email?: string; password?: string } = {};
    
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
    
    setErrors(err);

    if (valid) {
      setIsSubmitting(true);
      try {
        await login(form.email, form.password);
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate('/dashboard');
      } catch (error) {
        console.error("Login error:", error);
        if (error.response?.status === 404) {
          setErrors({ email: "User not found" });
        } else if (error.response?.status === 401) {
          setErrors({ password: "Invalid credentials" });
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
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 finova-card space-y-5">
      <h2 className="text-2xl font-bold mb-2 text-center">SignIn</h2>
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
            autoComplete="current-password"
          />
        </div>
        {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password}</div>}
      </div>
      <button 
        type="submit" 
        className="finova-button w-full rounded-md py-2 font-bold"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "SignIn"}
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
  );
};

export default LoginForm;
