
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    }
  }, [navigate, user, loading]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse-gentle">
        <h1 className="text-3xl font-bold finova-gradient-text">Finova</h1>
        <p className="text-foreground/70 text-center mt-2">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
