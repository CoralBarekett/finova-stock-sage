
import React, { useState } from "react";
import { Mail, Key, Facebook, Google } from "lucide-react";

const validateEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const RegisterForm: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    let err: { email?: string; password?: string; confirm?: string } = {};

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
    if (form.password && form.password.length < 6) {
      err.password = "Password must be at least 6 characters.";
      valid = false;
    }
    if (form.password !== form.confirm) {
      err.confirm = "Passwords do not match.";
      valid = false;
    }
    setErrors(err);

    if (valid) {
      alert("Demo: Registration successful! (No backend)");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 finova-card space-y-5">
      <h2 className="text-2xl font-bold mb-2 text-center">Sign Up</h2>
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
      <button type="submit" className="finova-button w-full rounded-md py-2 font-bold">Sign Up</button>
      <div className="flex flex-col gap-2 mt-2">
        <button type="button" className="flex items-center justify-center gap-2 border py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition">
          <Google className="w-4 h-4 text-blue-500" /> Continue with Google
        </button>
        <button type="button" className="flex items-center justify-center gap-2 border py-2 rounded-md bg-white text-gray-700 hover:bg-gray-100 transition">
          <Facebook className="w-4 h-4 text-blue-600" /> Continue with Facebook
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
