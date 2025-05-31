'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  access: string | null;
  setAccess: (access: string | null) => void;
  storeLoginValues: (token: string, access: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [access, setAccess] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = getCookie('token') as string | null;
      const storedAccess = getCookie('access') as string | null;
      
      if (storedToken) setToken(storedToken);
      if (storedAccess) setAccess(storedAccess);
      
      setIsInitialized(true);
    };

    initializeAuth();
  }, []);

  const storeLoginValues = (newToken: string, newAccess: string) => {
    setToken(newToken);
    setAccess(newAccess);
    document.cookie = `token=${newToken}; path=/; secure; sameSite=strict`;
    document.cookie = `access=${newAccess}; path=/; secure; sameSite=strict`;
  };

  const logout = () => {
    setToken(null);
    setAccess(null);
    deleteCookie('token');
    deleteCookie('access');
    router.push('/login');
  };

  const isAuthenticated = !!token;

  const contextValue: AuthContextType = {
    token,
    isAuthenticated,
    access,
    setAccess,
    storeLoginValues,
    logout,
  };

  // Wait until auth state is initialized before rendering children
  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={contextValue}>
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