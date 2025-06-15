'use client'

import { useToast } from "@/components/Toast";
import React, { createContext, useContext, useEffect, useState } from 'react';

interface mainValueType {
  head: string | null;
}
const MemberHeadContext = createContext<mainValueType>({head: ''})

export const useMemberHeadContext = () => useContext(MemberHeadContext);

export default function MemberHeadProvider({children}: Readonly<{children: React.ReactNode}>) {
  const toast = useToast();
  const [head, setHead] = useState('')


  useEffect(() => {
    async function fetchHeadMembers() {
      try {
        const response = await fetch(`/api/main`,
          {
            method: 'GET',
            headers: { 
              'Content-Type': 'application/json'
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
  }, [toast]);

  const contextValue: mainValueType = {
    head,
  };
  return (
    <div className="w-full">
      <MemberHeadContext.Provider value={contextValue}>
        {children}
      </MemberHeadContext.Provider>
    </div>
  );
}