
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      console.log("Checking authentication status...");
      const token = localStorage.getItem('finovaToken');
      if (token) {
        console.log("Token found, validating...");
        const response = await axios.get('http://localhost:3000/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Make sure the response data conforms to User type
        const userData = response.data as User;
        console.log("User authenticated:", userData);
        setUser(userData);
      } else {
        console.log("No authentication token found");
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('finovaToken');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    console.log("Login attempt for:", email);
    const response = await axios.post<AuthResponse>('http://localhost:3000/users/SignIn', { email, password });
    const { token, user: userData } = response.data;
    console.log("Login successful:", userData);
    localStorage.setItem('finovaToken', token);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    console.log("Registration attempt for:", email);
    const response = await axios.post<AuthResponse>('http://localhost:3000/users/SignUp', { name, email, password });
    const { token, user: userData } = response.data;
    console.log("Registration successful:", userData);
    localStorage.setItem('finovaToken', token);
    setUser(userData);
  };

  const logout = async () => {
    console.log("Logging out user");
    localStorage.removeItem('finovaToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};
