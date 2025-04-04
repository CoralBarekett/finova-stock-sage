
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="finova-card p-8 text-center max-w-md w-full">
        <AlertTriangle className="w-16 h-16 mx-auto text-finova-primary mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">404</h1>
        <p className="text-white/70 mb-6">Oops! The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/')}
          className="finova-button px-6 py-2 rounded-lg text-white"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotFound;
