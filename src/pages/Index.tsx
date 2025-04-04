
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the dashboard page
    navigate('/dashboard');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse-gentle">
        <h1 className="text-3xl font-bold finova-gradient-text">Finova</h1>
        <p className="text-white/70 text-center mt-2">Loading...</p>
      </div>
    </div>
  );
};

export default Index;
