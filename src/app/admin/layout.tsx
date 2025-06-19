'use client'

import AdminSidenav from '@/components/AdminSidenav';
import ToastProvider from '@/components/Toast';
import Topnav from '@/components/Topnav';
import { Logout } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
import React from 'react'

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
  const router = useRouter()
  
  const logout = async () => {
    try {
      const response = await fetch('/api/logout', { method: 'GET' });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
        <AdminSidenav />
        <div className="w-full relative">
          <Topnav>
            <button onClick={logout} className="px-2 ml-auto mr-0 flex items-center gap-2">
              <Logout />
            </button>
          </Topnav>
          <ToastProvider>
          {children}
          <div id='portal'></div>
          </ToastProvider>
        </div>
    </>
  )
}

export default layout