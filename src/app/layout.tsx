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
  title: 'المصحف المفسر و الخواطر',
  description: "تطبيق تفاعلي يجمع بين تفسير القرآن الكريم ودفتر الخواطر بإعداد م. فيصل شققي",
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Heritage Reader'
  },
  openGraph: {
    title: "المصحف المفسر و الخواطر",
    description: "تطبيق تفاعلي يجمع بين تفسير القرآن الكريم ودفتر الخواطر بإعداد م. فيصل شققي",
    siteName: "مكتبتي",
    locale: "ar_SA",
    type: "website",
    images: [
      {
        url: "/share-logo.jpg",
        width: 800,
        height: 800,
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "المصحف المفسر و الخواطر",
    description: "تطبيق تفاعلي يجمع بين تفسير القرآن الكريم ودفتر الخواطر بإعداد م. فيصل شققي",
    images: ["/share-logo.jpg"]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fdfbf7" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.globalInstallPrompt = null;
              window.addEventListener('beforeinstallprompt', function(e) {
                e.preventDefault();
                window.globalInstallPrompt = e;
                window.dispatchEvent(new Event('app-pwa-ready'));
              });
            `,
          }}
        />
      </head>
      <body
        className={`${cairo.variable} ${amiri.variable} ${reemKufi.variable} antialiased bg-[#fdfbf7] text-slate-900`}
        suppressHydrationWarning
      >

        <GlobalInstallBanner />
        {children}
      </body>
    </html>
  );
}
