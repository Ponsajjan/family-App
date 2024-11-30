import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Sidenav } from "@/components/Sidenav";
import "./globals.css";
import ToastProvider from "@/components/Toast";

const inter = Inter({ subsets: ["latin"] });

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: "Family app",
  description: "Developed in intention to remember eachother",
};

export const viewport: Viewport ={
  themeColor: "FFFFFF",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // useEffect(() => {
  //   // Set initial theme based on localStorage or system preference
  //   const storedTheme = localStorage.getItem("theme");
  //   const defaultTheme = storedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  //   document.getElementById("MainDiv")?.classList.add(defaultTheme);
  // }, []);
  
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <main id="MainDiv">
          <ToastProvider>
            <div className="w-full bg-field_color/95 transition-all duration-500 ease-in-out">
              <div className="w-full max-w-7xl mx-auto bg-main_background md:border-x md:border-border_color min-h-screen relative flex">
                <Sidenav />
                {children}
              </div>
            </div>
            <div id='portal'></div>
          </ToastProvider>
        </main>
      </body>
    </html>
  );
}
