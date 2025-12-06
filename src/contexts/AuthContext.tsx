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
  storeLoginValues: (token: string, access: string, mainMemberNameRef: string, oldAccountRef?: string) => void;
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

  const storeLoginValues = (newToken: string, newAccess: string, mainMemberNameRef: string, oldAccountRef?: string) => {
    setToken(newToken);
    setAccess(newAccess);
    const daysToSeconds = 180 * 24 * 60 * 60; // 180 days in seconds

    // Set token and access cookies
    document.cookie = `token=${newToken}; path=/; max-age=${daysToSeconds};`;
    document.cookie = `access=${newAccess}; path=/; max-age=${daysToSeconds};`;

    if (newAccess === 'Admin') {
      router.push('/admin');
      return
    }

    // Get existing logged accounts
    const existingCookie = document.cookie.split('; ')
      .find(row => row.startsWith('loggedAccounts='));

    let accounts: string[] = [];
    if (existingCookie) {
      const cookieValue = existingCookie.split('=')[1];
      try {
        // First decode URI component, then parse JSON
        const decodedValue = decodeURIComponent(cookieValue);
        if (decodedValue.startsWith('[') && decodedValue.endsWith(']')) {
          accounts = JSON.parse(decodedValue);
        } else {
          // If it's a malformed array string, treat as single value
          accounts = [decodedValue.replace(/^\["|"\]$/g, '')];
        }
      } catch (e) {
        console.error("Error parsing loggedAccounts cookie", e);
        accounts = [mainMemberNameRef]; // Fallback to new value
      }
    }

    // Limit accounts array to prevent cookie overflow
    const MAX_ACCOUNTS = 10;

    // If oldAccountRef is provided, replace it with the new one
    if (oldAccountRef) {
      const oldIndex = accounts.indexOf(oldAccountRef);
      if (oldIndex !== -1) {
        accounts[oldIndex] = mainMemberNameRef;
      } else {
        // If old account not found, add new account if it doesn't exist and we have space
        if (!accounts.includes(mainMemberNameRef) && accounts.length < MAX_ACCOUNTS) {
          accounts.push(mainMemberNameRef);
        }
      }
    } else {
      // Add new account if it doesn't exist and we have space
      if (!accounts.includes(mainMemberNameRef) && accounts.length < MAX_ACCOUNTS) {
        accounts.push(mainMemberNameRef);
      }
    }

    // Trim array if it exceeds max size (keep most recent)
    if (accounts.length > MAX_ACCOUNTS) {
      accounts = accounts.slice(-MAX_ACCOUNTS);
    }

    // Update the cookie with properly formatted JSON array
    document.cookie = `loggedAccounts=${encodeURIComponent(JSON.stringify(accounts))}; path=/; max-age=${daysToSeconds};`;

    // Redirect based on new access
    if (newAccess === 'Member') {
      router.push('/terms');
    } else if (newAccess === 'Moderator') {
      router.push('/moderator');
    }
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