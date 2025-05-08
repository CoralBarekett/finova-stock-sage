
import { createContext, useContext, useState, useEffect } from 'react';
import axios, { isAxiosError } from 'axios';

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs when the app initializes to check for existing user session
  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('finovaToken');
      
      if (token) {
        try {
          // Configure axios with the token for this request
          const response = await axios.get<BackendUser>('http://localhost:3000/users/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          // Map the user data, even with partial information
          try {
            const userData = mapBackendUserToFrontendUser(response.data);
            console.log('Session restored for user:', userData);
            setUser(userData);
          } catch (error) {
            console.error('Could not map user data:', error);
            // Don't remove token here, just log the error
          }
        } catch (error) {
          console.error('Failed to fetch user session', error);
          // Only clear token if there's an actual API failure
          if (isAxiosError(error) && error.response?.status === 401) {
            localStorage.removeItem('finovaToken');
            setUser(null);
          }
        }
      } else {
        console.log('No authentication token found');
      }
      
      setIsLoading(false);
    };
    
    checkUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<{ token: string; user: BackendUser }>(
        'http://localhost:3000/users/SignIn',
        { email, password }
      );
      
      // Store token in localStorage for session persistence
      localStorage.setItem('finovaToken', response.data.token);
      
      // Update user state with mapped user data
      const userData = mapBackendUserToFrontendUser(response.data.user);
      console.log('User logged in:', userData);
      setUser(userData);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Login failed:', error);
      return Promise.reject(error);
    }
  };

  const register = async (name: string, email: string, password: string, isPro: boolean = false) => {
    try {
      const response = await axios.post<{ token: string; user: BackendUser }>(
        'http://localhost:3000/users/SignUp',
        { name, email, password, pro: isPro }
      );
      
      // Store token in localStorage for session persistence
      localStorage.setItem('finovaToken', response.data.token);
      
      // Update user state with mapped user data
      const userData = mapBackendUserToFrontendUser(response.data.user);
      console.log('User registered:', userData);
      setUser(userData);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Registration failed:', error);
      return Promise.reject(error);
    }
  };

  const updateUserPlan = async (isPro: boolean) => {
    const token = localStorage.getItem('finovaToken');
    if (token && user) {
      try {
        // Updated to use the new backend route
        const response = await axios.put<BackendUser>(
          `http://localhost:3000/users/UpdateUserByEmail/${user.email}`,
          { pro: isPro },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        const updatedUser = mapBackendUserToFrontendUser(response.data);
        console.log('User plan updated:', updatedUser);
        setUser(updatedUser);
        
        return Promise.resolve();
      } catch (error) {
        console.error('Failed to update user plan', error);
        return Promise.reject(error);
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('finovaToken');
    setUser(null);
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUserPlan }}>
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

// Helper function to standardize mapping from backend to frontend user model
const mapBackendUserToFrontendUser = (backendUser: BackendUser): FrontendUser => {
  // Less strict validation to prevent session loss
  if (!backendUser) {
    console.warn('Empty user data received from backend');
    throw new Error('Empty user data from backend');
  }
  
  return {
    id: backendUser._id || '',
    email: backendUser.email || '',
    name: backendUser.name || '',
    pro: backendUser.pro || false,
  };
};
