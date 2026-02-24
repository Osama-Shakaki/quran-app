'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Grid3X3, ArrowRight, Book, ChevronLeft } from 'lucide-react';
import { useReaderStore } from '@/store/useReaderStore';
import Image from 'next/image';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import { quranJuzData, JuzInfo, QURAN_PAGES } from '@/data/quran_metadata';
import QuranIndex from '@/components/QuranIndex';



export default function QuranSelection() {
    const router = useRouter();
    const setBook = useReaderStore((state) => state.setBook);
    const setPage = useReaderStore((state) => state.setPage);
    const currentPage = useReaderStore((state) => state.currentPage);

    const [view, setView] = useState<'selection' | 'juz'>('selection');
    const handleContinueReading = () => {
        setBook('quran');
        router.push('/quran/viewer');
    };

    const handleStartFullQuran = () => {
        setBook('quran');
        setPage(4);
        router.push('/quran/viewer');
    };

    const handlePageClick = (pageNumber: number) => {
        setBook('quran');
        setPage(pageNumber);
        router.push('/quran/viewer');
    };

    return (
        <div className="min-h-screen bg-off-white font-cairo text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <BackgroundPattern />

            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-sage-light/40 rounded-full blur-3xl mix-blend-multiply" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-sage-light/40 rounded-full blur-3xl mix-blend-multiply" />
            </div>

            {/* Preload Background Images for Instant Navigation */}
            <div className="hidden">
                {QURAN_PAGES.find(p => p.pageNumber === currentPage)?.imageSrc && (
                    <Image src={QURAN_PAGES.find(p => p.pageNumber === currentPage)!.imageSrc} alt="preload-quran" width={100} height={100} priority unoptimized />
                )}
                {QURAN_PAGES.find(p => p.pageNumber === 4)?.imageSrc && (
                    <Image src={QURAN_PAGES.find(p => p.pageNumber === 4)!.imageSrc} alt="preload-quran-start" width={100} height={100} priority unoptimized />
                )}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-4xl relative"
            >
                {/* Back to Home Button */}
                <button
                    onClick={() => router.push('/')}
                    className="absolute top-0 right-0 p-2 text-slate-500 hover:text-forest-green transition-colors hover:bg-white/50 rounded-full"
                    title="عودة للرئيسية"
                >
                    <ArrowRight size={24} />
                </button>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-amiri font-bold text-forest-green mb-4">
                        {view === 'selection' ? 'اختر طريقة القراءة' : 'فهرس الأجزاء'}
                    </h1>
                    <p className="text-slate-600 text-lg">
                        {view === 'selection'
                            ? 'يمكنك متابعة القراءة من حيث توقفت أو الانتقال مباشرة إلى جزء محدد'
                            : 'اضغط على الجزء لعرض السور والصفحات'}
                    </p>
                </div>

                {view === 'selection' ? (
                    <div className="flex flex-col gap-6 w-full">
                        {/* Top Row: Full Quran & Juz Index */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Quran Card */}
                            <motion.button
                                whileHover={{ scale: 1.02, translateY: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleStartFullQuran}
                                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm hover:shadow-xl hover:border-sage-green/30 transition-all group text-right relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-sage-light/50 rounded-2xl flex items-center justify-center mb-6 text-forest-green group-hover:bg-sage-green group-hover:text-white transition-colors">
                                        <Book size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-slate-800 group-hover:text-forest-green transition-colors">المصحف كاملاً</h3>
                                    <p className="text-slate-500 leading-relaxed">
                                        البدء بقراءة المصحف الشريف من أول سورة الفاتحة.
                                    </p>
                                </div>
                            </motion.button>

                            {/* Juz Index Card */}
                            <motion.button
                                whileHover={{ scale: 1.02, translateY: -5 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setView('juz')}
                                className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm hover:shadow-xl hover:border-sage-green/30 transition-all group text-right relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-sage-light/50 rounded-2xl flex items-center justify-center mb-6 text-forest-green group-hover:bg-sage-green group-hover:text-white transition-colors">
                                        <Grid3X3 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 text-slate-800 group-hover:text-forest-green transition-colors">فهرس الأجزاء</h3>
                                    <p className="text-slate-500 leading-relaxed">
                                        الانتقال المباشر إلى جزء محدد من أجزاء القرآن الثلاثين.
                                    </p>
                                </div>
                            </motion.button>
                        </div>

                        {/* Bottom Row: Continue Reading */}
                        <motion.button
                            whileHover={{ scale: 1.01, translateY: -2 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={handleContinueReading}
                            className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm hover:shadow-xl hover:border-sage-green/30 transition-all group text-right relative overflow-hidden w-full flex flex-col md:flex-row items-center md:items-start md:gap-8"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-50" />
                            <div className="relative z-10 w-full md:w-auto flex flex-col items-center md:items-start">
                                <div className="w-16 h-16 bg-sage-light/50 rounded-2xl flex items-center justify-center mb-4 md:mb-0 text-forest-green group-hover:bg-sage-green group-hover:text-white transition-colors">
                                    <BookOpen size={32} />
                                </div>
                            </div>
                            <div className="relative z-10 flex-1 text-center md:text-right">
                                <h3 className="text-2xl font-bold mb-2 text-slate-800 group-hover:text-forest-green transition-colors">متابعة القراءة</h3>
                                <p className="text-slate-500 leading-relaxed">
                                    استكمل القراءة من آخر صفحة توقفت عندها في المصحف الشريف.
                                </p>
                            </div>
                        </motion.button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full"
                    >
                        <div className="flex items-center mb-6">
                            <button
                                onClick={() => setView('selection')}
                                className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-500 hover:text-forest-green flex items-center gap-2 font-bold"
                            >
                                <ArrowRight size={20} />
                                <span>عودة للقائمة</span>
                            </button>
                        </div>

                        <QuranIndex onPageSelect={handlePageClick} />
                    </motion.div>
                )}


            </motion.div>



        </div >
    );
}
