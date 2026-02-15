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
  title: "Digital Heritage E-reader",
  description: "A digital viewer for The Holy Quran and Thoughts & Wisdom.",
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
        {children}
      </body>
    </html>
  );
}
