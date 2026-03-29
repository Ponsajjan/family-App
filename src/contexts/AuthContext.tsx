'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import { useRouter, usePathname } from 'next/navigation';
import { updateToken } from '@/utils/auth';

interface AuthContextType {
  storeLoginValues: (token: string, access: string, authId: string, oldAuthId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initialize auth state on mount
    const storedToken = getCookie('token') || null;

    if (storedToken) {
      updateToken(storedToken as string)
    }
    setIsInitialized(true);

  }, []);

  const storeLoginValues = (newToken: string, newAccess: string, authId: string, oldAuthId?: string) => {
    const maxAge = 180 * 24 * 60 * 60; // 180 days in seconds

    // Set token and access cookies using setCookie
    setCookie('token', newToken, { maxAge, path: '/' });
    setCookie('access', newAccess, { maxAge, path: '/' });

    if (newAccess === 'Admin') {
      router.push('/admin');
      return;
    }

    // Get existing logged accounts from cookies-next
    const existingAccountsCookie = getCookie('authId');
    const existingSelectedAuthIdCookie = getCookie('selectedAuthId');
    let selectedAuthId: string[] = [];
    let accounts: string[] = [];

    if (existingAccountsCookie) {
      try {
        const decodedValue = typeof existingAccountsCookie === 'string'
          ? existingAccountsCookie
          : JSON.stringify(existingAccountsCookie);

        accounts = JSON.parse(decodedValue);
        if (!Array.isArray(accounts)) {
          accounts = [String(accounts)];
        }
      } catch (e) {
        console.error("Error parsing logged accounts cookie", e);
        accounts = [];
      }
    }

    if (existingSelectedAuthIdCookie) {
      try {
        const decodedValue = typeof existingSelectedAuthIdCookie === 'string'
          ? existingSelectedAuthIdCookie
          : JSON.stringify(existingSelectedAuthIdCookie);

        selectedAuthId = JSON.parse(decodedValue);
        if (!Array.isArray(selectedAuthId)) {
          selectedAuthId = [String(selectedAuthId)];
        }
      } catch (e) {
        console.error("Error parsing selected authId cookie", e);
        selectedAuthId = [];
      }
    }

    if (oldAuthId) {
      const oldIndex = accounts.indexOf(oldAuthId);
      if (oldIndex !== -1) {
        accounts[oldIndex] = authId; // Replace specific ID
        selectedAuthId[oldIndex] = authId;
      } else if (!accounts.includes(authId)) {
        accounts.push(authId); // Add if not found and new one not there
        selectedAuthId.push(authId);
      }
    } else {
      // Add new account if it doesn't exist
      if (!accounts.includes(authId)) {
        accounts.push(authId);
      }
    }

    // Limit accounts array to prevent cookie overflow
    const MAX_ACCOUNTS = 10;
    if (accounts.length > MAX_ACCOUNTS) {
      accounts = accounts.slice(-MAX_ACCOUNTS);
    };

    // Update the cookie using setCookie
    setCookie('authId', JSON.stringify(accounts), { maxAge, path: '/' });
    setCookie('selectedAuthId', JSON.stringify(selectedAuthId), { maxAge, path: '/' });

    if (pathname === '/login') {
      router.push('/terms');
    }
    if (pathname === '/moderator/login' && newAccess === 'Moderator') {
      router.push('/moderator');
    }
  };

  const logout = () => {
    deleteCookie('token');
    deleteCookie('access');
    router.push('/login');
  };

  // const isAuthenticated = Boolean(getCookie('token'));

  const contextValue: AuthContextType = {
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