"use client"

import { Inter } from "next/font/google";
import Sidenav from "@/components/Sidenav";
import "./globals.css";
import ToastProvider from "@/components/Toast";
// import { ThemeProvider } from "@/contexts/ThemeContext";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    '/terms/login'
  ];

  if (IncludeSideNavLayoutPaths.includes(pathname)) {
    return (
      <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
          <main id="MainDiv">
            <noscript>hi hello!..</noscript>
            <AuthProvider>
              <div className="w-full bg-field_color/95 transition-all duration-500 ease-in-out">
                <div className="w-full max-w-[2600px] mx-auto bg-main_background md:border-x md:border-border_color min-h-screen relative flex">
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
          </main>
        </body>
      </html>
    );
  }
  
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <AuthProvider>
          <div className="w-full bg-field_color/95 transition-all duration-500 ease-in-out">
            <div className="w-full max-w-[2600px] mx-auto bg-main_background md:border-x md:border-border_color min-h-screen relative flex">
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
