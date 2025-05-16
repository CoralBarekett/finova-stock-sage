
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
  updateUserProfile?: (name: string) => Promise<void>;
  updateUserPassword?: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('finovaToken');
      if (token) {
        try {
          const response = await axios.get<BackendUser>(`${BACKEND_API_URL}/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(mapBackendUserToFrontendUser(response.data));
        } catch (error) {
          console.error('Failed to fetch user', error);
          logout();
        }
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post<{ token: string; user: BackendUser }>(
      `${BACKEND_API_URL}/users/SignIn`,
      { email, password }
    );
    localStorage.setItem('finovaToken', response.data.token);
    setUser(mapBackendUserToFrontendUser(response.data.user));
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
        // Fixed API endpoint URL - adding missing slash
        const response = await axios.put<BackendUser>(
          `${BACKEND_API_URL}/users/UpdateUserByEmail/${user.email}`,
          { pro: isPro },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUser(mapBackendUserToFrontendUser(response.data));
      } catch (error) {
        console.error('Failed to update user plan', error);
      }
    }
  };

  // Added for future functionality - not implemented in backend yet
  const updateUserProfile = async (name: string) => {
    const token = localStorage.getItem('finovaToken');
    if (token && user) {
      try {
        // This would connect to a real API endpoint in production
        console.log(`Updating user profile: ${name}`);
        // Simulate successful update by updating local state
        setUser(prev => prev ? {...prev, name} : null);
        return Promise.resolve();
      } catch (error) {
        console.error('Failed to update user profile', error);
        return Promise.reject(error);
      }
    }
    return Promise.reject(new Error('User not authenticated'));
  };

  // Added for future functionality - not implemented in backend yet
  const updateUserPassword = async (currentPassword: string, newPassword: string) => {
    const token = localStorage.getItem('finovaToken');
    if (token && user) {
      try {
        // This would connect to a real API endpoint in production
        console.log(`Updating user password`);
        return Promise.resolve();
      } catch (error) {
        console.error('Failed to update user password', error);
        return Promise.reject(error);
      }
    }
    return Promise.reject(new Error('User not authenticated'));
  };

  const logout = () => {
    localStorage.removeItem('finovaToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      updateUserPlan,
      updateUserProfile,
      updateUserPassword 
    }}>
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
