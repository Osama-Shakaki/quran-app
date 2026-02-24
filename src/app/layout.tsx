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
  metadataBase: new URL("https://quran-faisalshakaki.vercel.app"),
  title: 'مكتبتي | التفسير والخواطر',
  description: "تطبيق تفاعلي يجمع بين تفسير القرآن الكريم ودفتر للخواطر",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Heritage Reader'
  },
  openGraph: {
    title: "مكتبتي | التفسير والخواطر",
    description: "تطبيق تفاعلي يجمع بين تفسير القرآن الكريم ودفتر للخواطر",
    siteName: "مكتبتي",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/share-logo.png",
        width: 800,
        height: 800,
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "مكتبتي | التفسير والخواطر",
    description: "تطبيق تفاعلي يجمع بين تفسير القرآن الكريم ودفتر للخواطر",
    images: ["/share-logo.png"]
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
