import Inter from "next/font/local";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Metadata, Viewport } from "next";

const inter = Inter({ src: "../../public/fonts/InterVariable.woff2" });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

const APP_NAME = "Family Calendar";
const APP_DEFAULT_TITLE = "Family Calendar";
const APP_TITLE_TEMPLATE = "Family Calendar";
const APP_DESCRIPTION = "Shared Family Calendar For Birthdays & Remembrances";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
    url: `${baseUrl}`,
    images: [
      {
        url: `${baseUrl}/family_calendar.jpg`,
        width: 800,
        height: 800,
        alt: 'Family Calendar for Birthdays & Remembrances',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    images: [
      {
        url: `${baseUrl}/family_calendar.jpg`,
        alt: 'Family Calendar for Birthdays & Remembrances',
      },
    ],
  },
  alternates: {
    canonical: `${baseUrl}`,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} font-inter-fallback`} suppressHydrationWarning={true}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}