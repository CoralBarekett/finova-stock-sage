
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we've finished checking authentication and there's no user
    if (!isLoading && !user) {
      console.log("Protected route: No authenticated user, redirecting to auth");
      navigate('/auth', { 
        replace: true,
        state: { from: location.pathname } // Store the attempted URL for potential redirect back after login
      });
    } else if (!isLoading && user) {
      // Validate that we have a complete user object
      if (user.id && user.email && user.name) {
        console.log("Protected route: User authenticated", user);
      } else {
        console.error("Protected route: Invalid user object", user);
        navigate('/auth', { 
          replace: true,
          state: { from: location.pathname }
        });
      }
    }
  }, [user, isLoading, navigate, location]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="animate-pulse">
          <h1 className="text-3xl font-bold text-white">Loading...</h1>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated
  if (!user || !user.id) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
