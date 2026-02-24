import type { Metadata, Viewport } from "next";
import { Amiri, Cairo, Reem_Kufi } from "next/font/google";

import "./globals.css";
import GlobalInstallBanner from "@/components/ui/GlobalInstallBanner";

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic"],
  weight: ["300", "400", "600", "700"],
  display: "swap",
});

const reemKufi = Reem_Kufi({
  variable: "--font-reem-kufi",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: '#fdfbf7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'مكتبتي',
  description: "عارض تراثي للمصحف الشريف وكتب الخواطر",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Heritage Reader'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${cairo.variable} ${amiri.variable} ${reemKufi.variable} antialiased bg-[#fdfbf7] text-slate-900`}
      >

        <GlobalInstallBanner />
        {children}
      </body>
    </html>
  );
}
