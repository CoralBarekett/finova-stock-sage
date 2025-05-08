import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface BackendUser {
  _id: string;
  email: string;
  name: string;
  pro?: boolean;
}

interface FrontendUser {
  id: string;
  email: string;
  name: string;
  pro: boolean;
}

interface AuthContextType {
  user: FrontendUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, isPro?: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUserPlan: (isPro: boolean) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (token: string): Promise<FrontendUser | null> => {
    try {
      const response = await axios.get<BackendUser>(`${BACKEND_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return mapBackendUserToFrontendUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      // If there's an error, clear the token as it may be invalid
      localStorage.removeItem('finovaToken');
      return null;
    }
  };

  const refreshUser = async (): Promise<void> => {
    const token = localStorage.getItem('finovaToken');
    if (token) {
      try {
        setIsLoading(true);
        const userData = await fetchUserData(token);
        setUser(userData);
      } catch (error) {
        console.error('Error refreshing user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('finovaToken');
      if (token) {
        const userData = await fetchUserData(token);
        setUser(userData);
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<{ token: string; user: BackendUser }>(
        `${BACKEND_API_URL}/users/SignIn`,
        { email, password }
      );
      localStorage.setItem('finovaToken', response.data.token);
      setUser(mapBackendUserToFrontendUser(response.data.user));
    } catch (error) {
      console.error('Login error:', error);
      throw error; // Re-throw to handle in the login form
    }
  };

  const register = async (name: string, email: string, password: string, isPro: boolean = false) => {
    const response = await axios.post<{ token: string; user: BackendUser }>(
      `${BACKEND_API_URL}/users/SignUp`,
      { name, email, password, pro: isPro }
    );
    localStorage.setItem('finovaToken', response.data.token);
    setUser(mapBackendUserToFrontendUser(response.data.user));
  };

  const updateUserPlan = async (isPro: boolean) => {
    const token = localStorage.getItem('finovaToken');
    if (token && user) {
      try {
        const response = await axios.put<BackendUser>(
          `${BACKEND_API_URL}/users/UpdateUserByEmail/${user.email}`,
          { pro: isPro },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(mapBackendUserToFrontendUser(response.data));
      } catch (error) {
        console.error('Failed to update user plan', error);
        if (error && typeof error === 'object' && 'response' in error) {
          // Handle specific API errors
          throw error;
        }
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('finovaToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUserPlan, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const mapBackendUserToFrontendUser = (backendUser: BackendUser): FrontendUser => ({
  id: backendUser._id,
  email: backendUser.email,
  name: backendUser.name,
  pro: backendUser.pro || false,
});
