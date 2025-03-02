'use client'

import ModeratorSidenav from '@/components/ModeratorSidenav';
import ToastProvider from '@/components/Toast';
import React from 'react'

function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

  return (
    <>
      <ModeratorSidenav />
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