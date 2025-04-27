
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if user is already authenticated
    if (!loading && user) {
      console.log("Auth page: User already authenticated, redirecting to dashboard");
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-gray-100 to-white'
      }`}>
        <div className="animate-pulse">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Loading...
          </h1>
        </div>
      </div>
    );
  }

  // If user is authenticated, don't render the auth page content
  if (user) {
    return null;
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-gray-100 to-white'
    }`}>
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome to Finova
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Your Personal Finance Assistant
          </p>
        </div>

        <div className={`${
          theme === 'dark' 
            ? 'bg-gray-800/50 backdrop-blur-lg border-gray-700' 
            : 'bg-white/80 backdrop-blur-lg border-gray-200'
        } rounded-2xl p-8 shadow-xl border`}>
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                isLogin 
                  ? 'bg-primary text-white' 
                  : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-white`
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                !isLogin 
                  ? 'bg-primary text-white' 
                  : `${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} hover:text-white`
              }`}
            >
              Sign Up
            </button>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default Auth;
