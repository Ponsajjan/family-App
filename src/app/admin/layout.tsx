'use client'

import AdminSidenav from '@/components/AdminSidenav';
import ToastProvider from '@/components/Toast';
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