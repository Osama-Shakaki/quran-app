'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, PenTool, ArrowLeft, Download, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useReaderStore } from '@/store/useReaderStore';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import { QURAN_PAGES, THOUGHTS_PAGES } from '@/data/quran_metadata';


// ─── PWA Install Top Bar ────────────────────────────────────────────────────
// Removed as per user request
// ────────────────────────────────────────────────────────────────────────────

export default function Home() {
  const { quranPage, thoughtsPage, setBook } = useReaderStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      } as const,
    },
  };

  return (
    <main className="min-h-screen bg-off-white flex flex-col items-center justify-center p-4 md:p-8 font-cairo text-slate-900 relative overflow-hidden selection:bg-sage-green selection:text-white">
      <BackgroundPattern />

      {/* Ambient Light Effects */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-sage-light/30 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-peach-light/30 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Preload Background Images for Instant Navigation */}
      <div className="hidden">
        {QURAN_PAGES.find(p => p.pageNumber === quranPage)?.imageSrc && (
          <Image src={QURAN_PAGES.find(p => p.pageNumber === quranPage)!.imageSrc} alt="preload-quran" width={100} height={100} priority unoptimized />
        )}
        {QURAN_PAGES.find(p => p.pageNumber === 4)?.imageSrc && (
          <Image src={QURAN_PAGES.find(p => p.pageNumber === 4)!.imageSrc} alt="preload-quran-start" width={100} height={100} priority unoptimized />
        )}
        {THOUGHTS_PAGES.find(p => p.pageNumber === thoughtsPage)?.imageSrc && (
          <Image src={THOUGHTS_PAGES.find(p => p.pageNumber === thoughtsPage)!.imageSrc} alt="preload-thoughts" width={100} height={100} priority unoptimized />
        )}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl z-10 flex flex-col gap-12"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-amiri font-bold text-slate-900 leading-tight drop-shadow-sm">
            <span className="text-forest-green relative inline-block">
              مكتبتي
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-sage-green/40 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-light">
            المصحف الشريف وصفحات الخواطر، بتجربة قراءة عصرية تحاكي الورق
          </p>
        </motion.div>



        {/* Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">

          {/* Quran Card */}
          <motion.div variants={itemVariants} className="group h-full">
            <Link href="/quran" onClick={() => setBook('quran')} className="block h-full">
              <div className="h-full bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/40 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group-hover:border-sage-green/30">
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-sage-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-sage-light to-white rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/50 group-hover:scale-110 transition-transform duration-500">
                      <BookOpen size={40} className="text-forest-green drop-shadow-sm" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-amiri mb-4 text-slate-800 group-hover:text-forest-green transition-colors">المصحف المفسر</h2>
                    <p className="text-lg text-slate-600 font-light leading-relaxed mb-8">
                      تفسير شخصي مكتوب بخط اليد مدمج مع صفحات القرآن الكريم، لتجربة تدبر عميقة.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Progress Indicator */}

                    <div className="bg-white/50 rounded-xl p-4 border border-white/60 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-slate-500">آخر تواجد</span>
                        <span className="font-bold text-forest-green font-amiri">
                          {quranPage < 5 ? 'المقدمة' : `صفحة ${quranPage - 4}`}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-forest-green rounded-full opacity-80"
                          style={{ width: `${Math.max(5, ((Math.max(0, quranPage - 4)) / 604) * 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-forest-green font-medium group-hover:translate-x-[-8px] transition-transform">
                      <div className="w-10 h-10 rounded-full border border-forest-green/20 flex items-center justify-center bg-white">
                        <ArrowLeft size={18} />
                      </div>
                      <span>اكمل القراءة</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Thoughts Card */}
          <motion.div variants={itemVariants} className="group h-full">
            <Link href="/thoughts" onClick={() => setBook('thoughts')} className="block h-full">
              <div className="h-full bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/40 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden group-hover:border-orange-200/50">
                {/* Card Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-peach-light/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-br from-peach-light to-white rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-white/50 group-hover:scale-110 transition-transform duration-500">
                      <PenTool size={40} className="text-orange-800 drop-shadow-sm" strokeWidth={1.5} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-amiri mb-4 text-slate-800 group-hover:text-orange-800 transition-colors">دفتر الخواطر</h2>
                    <p className="text-lg text-slate-600 font-light leading-relaxed mb-8">
                      تأملات وخواطر شخصية مدونة يدوياً في لحظات الصفاء، تشاركك رحلة الفهم.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Progress Indicator */}
                    <div className="bg-white/50 rounded-xl p-4 border border-white/60 backdrop-blur-sm">
                      <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-slate-500">آخر تواجد</span>
                        <span className="font-bold text-orange-800 font-amiri">صفحة {thoughtsPage}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        {/* Assuming ~200 pages for thoughts as an estimate for display */}
                        <div
                          className="h-full bg-orange-400 rounded-full opacity-80"
                          style={{ width: `${Math.min((thoughtsPage / 200) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-orange-800 font-medium group-hover:translate-x-[-8px] transition-transform">
                      <div className="w-10 h-10 rounded-full border border-orange-800/20 flex items-center justify-center bg-white">
                        <ArrowLeft size={18} />
                      </div>
                      <span>تصفح الخواطر</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}
