import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('adminToken');
      const storedUser = localStorage.getItem('adminUser');

      if (storedToken && storedUser) {
        try {
          // Set axios default header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // Verify token is still valid
          const isValid = await checkAuth();
          if (isValid) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await axios.get('http://localhost:5000/api/auth/me');
      return response.data.success;
    } catch (error) {
      return false;
    }
  };

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminUser', JSON.stringify(newUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    delete axios.defaults.headers.common['Authorization'];
  };

  const isAuthenticated = !!token && !!user && user.isActive === true;

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
