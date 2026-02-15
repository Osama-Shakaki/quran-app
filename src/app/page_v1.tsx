'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, PenTool, Play, ArrowLeft } from 'lucide-react';
import { useReaderStore } from '@/store/useReaderStore';

export default function Home() {
  const { currentPage, currentBook } = useReaderStore();

  return (
    <main className="min-h-screen bg-off-white flex flex-col items-center justify-center p-4 md:p-8 font-cairo text-slate-900 relative">

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl h-full md:h-[80vh]">

        {/* Quran Card (Right) */}
        <Link href="/quran" className="group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sage-light rounded-full opacity-20 -mr-20 -mt-20 blur-3xl group-hover:bg-sage-green/30 transition-colors" />

            <div>
              <div className="w-16 h-16 bg-sage-light rounded-2xl flex items-center justify-center mb-6 text-forest-green">
                <BookOpen size={32} strokeWidth={1.5} />
              </div>
              <h1 className="text-4xl md:text-5xl font-amiri mb-4 text-slate-800">المصحف المفسر</h1>
              <p className="text-lg text-slate-600 font-light leading-relaxed max-w-md">
                تفسير شخصي مكتوب بخط اليد مدمج مع صفحات القرآن الكريم.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <div className="w-12 h-12 rounded-full bg-sage-light flex items-center justify-center text-forest-green group-hover:bg-sage-green group-hover:text-white transition-colors">
                <ArrowLeft size={20} />
              </div>
              <span className="text-forest-green font-medium group-hover:text-sage-green transition-colors">تصفح الآن</span>
            </div>
          </motion.div>
        </Link>

        {/* Thoughts Card (Left) */}
        <Link href="/thoughts" className="group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-full bg-white rounded-3xl shadow-sm border border-slate-100 p-8 flex flex-col justify-between hover:shadow-md transition-all duration-300 relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-peach-light rounded-full opacity-30 -ml-20 -mt-20 blur-3xl group-hover:bg-soft-peach/40 transition-colors" />

            <div>
              <div className="w-16 h-16 bg-peach-light rounded-2xl flex items-center justify-center mb-6 text-orange-800">
                <PenTool size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-4xl md:text-5xl font-amiri mb-4 text-slate-800">دفتر الخواطر</h2>
              <p className="text-lg text-slate-600 font-light leading-relaxed max-w-md">
                تأملات وخواطر شخصية مدونة يدوياً في لحظات الصفاء.
              </p>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <div className="w-12 h-12 rounded-full bg-peach-light flex items-center justify-center text-orange-800 group-hover:bg-soft-peach transition-colors">
                <ArrowLeft size={20} />
              </div>
              <span className="text-slate-700 font-medium group-hover:text-orange-800 transition-colors">اقرأ الخواطر</span>
            </div>
          </motion.div>
        </Link>

      </div>

      {/* Floating Action Bar */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
        className="fixed bottom-8 z-50"
      >
        <Link href={currentBook === 'quran' ? '/quran/viewer' : '/thoughts'}>
          <div className="bg-forest-green text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 hover:shadow-xl hover:scale-105 transition-all cursor-pointer">
            <div className="bg-white/10 p-2 rounded-full">
              <Play size={16} fill="white" className="ml-0.5" />
            </div>
            <span className="font-medium text-lg">متابعة القراءة</span>
            <div className="h-4 w-[1px] bg-white/30 mx-1" />
            <span className="text-sm font-light opacity-90 text-sage-light font-amiri">
              {currentBook === 'quran' ? 'القرآن' : 'الخواطر'} • ص {currentPage}
            </span>
          </div>
        </Link>
      </motion.div>

    </main>
  );
}
