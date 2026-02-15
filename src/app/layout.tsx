import type { Metadata } from "next";
import { Amiri, Cairo, Reem_Kufi } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "المكتبة التراثية الرقمية",
  description: "عارض تراثي للمصحف الشريف وكتب الخواطر",
  manifest: '/manifest.json',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover',
  themeColor: '#fdfbf7',
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
                    if ('serviceWorker' in navigator) {
                        window.addEventListener('load', function() {
                            navigator.serviceWorker.register('/sw.js').then(function(registration) {
                                console.log('ServiceWorker registration successful');
                            }, function(err) {
                                console.log('ServiceWorker registration failed: ', err);
                            });
                        });
                    }
                `
          }}
        />
        {children}
      </body>
    </html>
  );
}
