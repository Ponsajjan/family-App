'use client'

import { useToast } from "@/components/Toast";
import Topnav from "@/components/Topnav";
import { useAuth } from "@/contexts/AuthContext";
import React, { createContext, useContext, useEffect, useState } from 'react';

interface mainValueType {
  head: string | null;
}
const MainMemberContext = createContext<mainValueType>({head: ''})

export const useMainMemberContext = () => useContext(MainMemberContext);

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const {token} = useAuth();
  const toast = useToast();
  const [head, setHead] = useState('')


  useEffect(() => {
    async function fetchHeadMembers() {
      try {
        const response = await fetch(`/api/main`,
          {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHead(data.member['name'])
        
      } catch (error: any) {
        toast?.show(error.message || 'Failed to fetch page data', 'error', 5000);
      }
    }

    fetchHeadMembers();
  }, [token, toast]);

  const contextValue: mainValueType = {
    head,
  };
  return (
    <div className="w-full">
      <Topnav>
      </Topnav>
      <MainMemberContext.Provider value={contextValue}>
        {children}
      </MainMemberContext.Provider>
    </div>
  );
}