import AdminSidenav from '@/components/AdminSidenav';
import ToastProvider from '@/components/Toast';
import React from 'react'

function layout({
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
            <div id='portal'></div>
            </ToastProvider>
        </div>
    </>
  )
}

export default layout