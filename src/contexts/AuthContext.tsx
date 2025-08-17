'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { updateToken } from '@/utils/auth';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  access: string | null;
  setAccess: (access: string | null) => void;
  storeLoginValues: (token: string, access: string, forDescendanceOf:string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [access, setAccess] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Initialize auth state on mount
    const storedToken = getCookie('token') || null;
    const storedAccess = getCookie('access') || null;
    if (storedToken || storedAccess) {
      setToken(storedToken as string | null);
      setAccess(storedAccess as string | null);
      updateToken(storedToken as string)
    }
    setIsInitialized(true);

  }, []);

  const storeLoginValues = (newToken: string, newAccess: string, forDescendanceOf:string) => {
    setToken(newToken);
    setAccess(newAccess);
    const daysToSeconds = 180 * 24 * 60 * 60; // 180 days in seconds
    document.cookie = `token=${newToken}; path=/; max-age=${daysToSeconds};`;
    document.cookie = `access=${newAccess}; path=/; max-age=${daysToSeconds};`;
    document.cookie = `loggedAccounts=${forDescendanceOf}; path=/; max-age=${daysToSeconds};`;
    return
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
    return null;
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

  //   // Process the value: remove everything after last underscore and replace underscores with spaces
  //   const processedValue = newDescendentFor
  //     .substring(0, newDescendentFor.lastIndexOf("_"))
  //     .replace(/_/g, " ");