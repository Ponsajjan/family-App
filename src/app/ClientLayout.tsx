"use client"

import Sidenav from "@/components/Sidenav";
import ToastProvider from "@/components/Toast";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

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
        <AuthProvider>
          <div className="w-full bg-field_color/95 transition-all duration-500 ease-in-out">
            <div className="w-full max-w-[2600px] mx-auto bg-main_background md:border-x md:border-border_color min-h-screen relative flex">
              <Sidenav />
              <div className="w-full relative">
                <ToastProvider>
                  {children}
                  <PWAInstallPrompt />
                  <div id='portal'></div>
                </ToastProvider>
              </div>
            </div>
          </div>
        </AuthProvider>
      </main>
    );
  }

  return (
    <AuthProvider>
      <div className="w-full bg-field_color/95 transition-all duration-500 ease-in-out">
        <div className="w-full max-w-[2600px] mx-auto bg-main_background md:border-x md:border-border_color min-h-screen relative flex">
          {children}
        </div>
      </div>
    </AuthProvider>
  );
}