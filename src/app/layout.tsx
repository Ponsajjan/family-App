import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Sidenav } from "@/components/Sidenav";
import "./globals.css";
import ToastProvider from "@/components/Toast";
import { ThemeProvider } from "@/contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Family app",
  description: "Developed in intention to remember eachother",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "FFFFFF",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <main id="MainDiv">
          <ThemeProvider>
            <ToastProvider>
              <div className="w-full bg-field_color/95 transition-all duration-500 ease-in-out">
                <div className="w-full max-w-7xl mx-auto bg-main_background md:border-x md:border-border_color min-h-screen relative flex">
                  <Sidenav />
                  {children}
                </div>
              </div>
              <div id='portal'></div>
            </ToastProvider>
          </ThemeProvider>
        </main>
      </body>
    </html>
  );
}
