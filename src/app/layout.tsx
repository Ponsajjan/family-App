'use client'

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Sidenav, NavLink } from "@/components/Sidenav";
import "./globals.css";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic"
// export const metadata: Metadata = {
//   title: "new app",
//   description: "Developed in intention to remember eachother",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Set initial theme based on localStorage or system preference
    const storedTheme = localStorage.getItem("theme");
    const defaultTheme = storedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.getElementById("MainDiv")?.classList.add(defaultTheme);
  }, []);
  
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <main id="MainDiv">
          <div id='portal'></div>
          <div className="w-full bg-field_color">
            <div className="w-full max-w-[1200px] mx-auto bg-main_background md:border-x md:border-border_color min-h-screen relative flex">
              <Sidenav />
              {children}
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
