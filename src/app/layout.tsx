import Inter from "next/font/local";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const inter = Inter({ src: "../../public/fonts/InterVariable.woff2" });

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata = {
    title: "Family Calendar",
    description: "Shared Family Calendar For Birthdays & Remembrances",
    openGraph: {
        title: "Family Calendar",
        description: "Shared Family Calendar For Birthdays & Remembrances",
        url: `${baseUrl}`,
        type: "website",
        images: [{url:`${baseUrl}/family_calender.png`, alt: 'Birthday & Remembrance Calendar'}],
    },
    alternates: {
        canonical: `${baseUrl}`,
    },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}