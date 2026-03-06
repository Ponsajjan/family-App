'use client'

import AdminSidenav from '@/components/AdminSidenav';
import ToastProvider from '@/components/Toast';
import Topnav from '@/components/Topnav';
import { Logout } from '@/utils/Icons';
import { useRouter } from 'next/navigation';
import React from 'react'

function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
      <AdminSidenav />
      <div className="w-full relative">
        <ToastProvider>
          {children}
        </ToastProvider>
      </div>
    </>
  )
}

export default AdminLayout