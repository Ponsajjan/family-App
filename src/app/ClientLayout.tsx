"use client"

import Sidenav from "@/components/Sidenav";
import ToastProvider from "@/components/Toast";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import { ReduxProvider } from "@/store/ReduxProvider";
import { AppInitializer } from "@/store/AppInitializer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const IncludeSideNavLayoutPaths = [
    '/',
    '/relatives',
    '/terms',
    '/tree',
    '/add_edit',
    '/add_edit/add_member',
    '/add_edit/add_relationship',
    '/add_edit/edit_member',
    '/add_edit/edit_relationship',
    '/moderator',
    '/moderator/verify_members',
    '/moderator/verify_changes',
    '/terms/moderator_login',
    '/terms/add_login',
  ];

  if (IncludeSideNavLayoutPaths.includes(pathname)) {
    return (
      <main id="MainDiv">
        <noscript>Amor fati!..</noscript>
        <ReduxProvider>
          <AppInitializer />
          <AuthProvider>
            <div className="w-full transition-all duration-500 ease-in-out">
              <div className="w-full max-w-[162.5rem] mx-auto md:border-x md:border-border_color md:min-h-screen relative flex">
                <Sidenav />
                <div className="w-full relative">
                  <ToastProvider>
                    {children}
                    <div id='portal'></div>
                  </ToastProvider>
                </div>
              </div>
            </div>
          </AuthProvider>
        </ReduxProvider>
      </main>
    );
  }

  return (
    <ReduxProvider>
      <AppInitializer />
      <AuthProvider>
        <div className="w-full transition-all duration-500 ease-in-out">
          <div className="w-full max-w-[162.5rem] mx-auto md:border-x md:border-border_color md:min-h-screen relative flex">
            {children}
          </div>
        </div>
      </AuthProvider>
    </ReduxProvider>
  );
}