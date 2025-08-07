import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  aadhar: string;
  phone: string;
  houseNo: string;
  type: 'home' | 'organization';
  role: 'user' | 'admin';
  credits: number;
  location?: { lat: number; lng: number };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (aadhar: string, password: string) => Promise<boolean>;
  signup: (userData: any) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('haritha_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (aadhar: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('haritha_users') || '[]');
    const foundUser = users.find((u: User) => u.aadhar === aadhar);

    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('haritha_user', JSON.stringify(foundUser));
      return true;
    }

    // Default admin login
    if (aadhar === '123456789012' && password === 'admin123') {
      const adminUser: User = {
        id: '1',
        name: 'Admin User',
        aadhar: '123456789012',
        phone: '9876543210',
        houseNo: 'Admin Office',
        type: 'organization',
        role: 'admin',
        credits: 0
      };
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem('haritha_user', JSON.stringify(adminUser));
      return true;
    }

    return false;
  };

  const signup = async (userData: any): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('haritha_users') || '[]');
    const newUser: User = {
      id: Date.now().toString(),
      ...userData,
      role: 'user',
      credits: 0
    };

    users.push(newUser);
    localStorage.setItem('haritha_users', JSON.stringify(users));
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('haritha_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('haritha_user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('haritha_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      signup,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}