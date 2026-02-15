'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Grid3X3, ArrowRight, ArrowLeft, Book, ChevronLeft } from 'lucide-react';
import { useReaderStore } from '@/store/useReaderStore';
import BackgroundPattern from '@/components/ui/BackgroundPattern';
import { quranJuzData, JuzInfo } from '@/data/quran_metadata';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1
    }
};

export default function QuranSelection() {
    const router = useRouter();
    const setBook = useReaderStore((state) => state.setBook);
    const setPage = useReaderStore((state) => state.setPage);

    const [view, setView] = useState<'selection' | 'juz' | 'juz_detail'>('selection');
    const [selectedJuz, setSelectedJuz] = useState<number | null>(null);

    const handleContinueReading = () => {
        setBook('quran');
        router.push('/quran/viewer');
    };

    const handleStartFullQuran = () => {
        setBook('quran');
        setPage(1);
        router.push('/quran/viewer');
    };

    const handleJuzSelect = (juzNumber: number) => {
        setSelectedJuz(juzNumber);
        setView('juz_detail');
    };

    const handleStartJuz = () => {
        if (!selectedJuz) return;
        const juzData = quranJuzData.find(j => j.id === selectedJuz);
        if (juzData) {
            setBook('quran');
            setPage(juzData.startPage);
            router.push('/quran/viewer');
        }
    };

    const handlePageClick = (pageNumber: number) => {
        setBook('quran');
        setPage(pageNumber);
        router.push('/quran/viewer');
    };

    const getJuzInfo = (juzNum: number) => {
        return quranJuzData.find(j => j.id === juzNum);
    };

    const renderHeader = () => {
        const juz = selectedJuz ? getJuzInfo(selectedJuz) : null;
        if (view === 'selection') return 'اختر طريقة القراءة';
        if (view === 'juz') return 'فهرس الأجزاء';
        if (view === 'juz_detail') return juz ? juz.name : `الجزء ${selectedJuz}`;
        return '';
    };

    const renderSubHeader = () => {
        if (view === 'selection') return 'يمكنك متابعة القراءة من حيث توقفت أو الانتقال مباشرة إلى جزء محدد';
        if (view === 'juz') return 'اختر الجزء الذي تود الانتقال إليه';
        if (view === 'juz_detail') return 'يمكنك البدء من أول الجزء أو اختيار سورة أو صفحة محددة';
        return '';
    };

    return (
        <div className="min-h-screen bg-off-white font-cairo text-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <BackgroundPattern />

            {/* Decorative Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-sage-light/40 rounded-full blur-3xl mix-blend-multiply" />
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-sage-light/40 rounded-full blur-3xl mix-blend-multiply" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="z-10 w-full max-w-4xl"
            >
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-amiri font-bold text-forest-green mb-4">
                        {renderHeader()}
                    </h1>
                    <p className="text-slate-600 text-lg">
                        {renderSubHeader()}
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
                        className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm"
                    >
                        <div className="flex items-center mb-6">
                            <button
                                onClick={() => setView('selection')}
                                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-500 hover:text-forest-green flex items-center gap-2"
                            >
                                <ArrowRight size={20} />
                                <span>عودة للقائمة</span>
                            </button>
                        </div>

                        <motion.div
                            className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-4"
                            dir="rtl"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                                <motion.button
                                    key={juz}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.1, backgroundColor: 'var(--color-sage-green)', color: 'white' }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => handleJuzSelect(juz)}
                                    className="aspect-square rounded-2xl bg-sage-light/50 text-forest-green font-bold text-xl flex items-center justify-center border border-transparent hover:shadow-md transition-all font-amiri"
                                >
                                    {juz}
                                </motion.button>
                            ))}
                        </motion.div>
                    </motion.div>
                )}

                {view === 'juz_detail' && selectedJuz && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/80 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-sm"
                    >
                        <div className="flex items-center mb-6">
                            <button
                                onClick={() => setView('juz')}
                                className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-500 hover:text-forest-green flex items-center gap-2"
                            >
                                <ArrowRight size={20} />
                                <span>عودة للفهرس</span>
                            </button>
                        </div>

                        {/* Juz Actions */}
                        <div className="flex flex-col gap-8">
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                onClick={handleStartJuz}
                                className="w-full bg-forest-green text-white py-4 rounded-xl font-bold font-amiri text-xl shadow-lg hover:shadow-xl hover:bg-forest-green/90 transition-all flex items-center justify-center gap-3"
                            >
                                <BookOpen size={24} />
                                <span>{selectedJuz && getJuzInfo(selectedJuz)?.name} - بدء القراءة</span>
                            </motion.button>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-amiri font-bold text-slate-800 border-b pb-2">السور في هذا الجزء</h3>
                                <div className="p-4 bg-sage-light/30 rounded-xl border border-sage-green/20">
                                    <p className="text-xl font-amiri leading-relaxed text-forest-green">
                                        {selectedJuz && getJuzInfo(selectedJuz)?.surahs}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-amiri font-bold text-slate-800 border-b pb-2">صفحات الجزء</h3>
                                <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                    {(() => {
                                        const juzInfo = quranJuzData.find(j => j.id === selectedJuz);
                                        if (!juzInfo) return null;

                                        // Calculate pages from this juz start to next juz start (or 604)
                                        const startPage = juzInfo.startPage;
                                        const nextJuz = quranJuzData.find(j => j.id === (selectedJuz! + 1));
                                        const endPage = nextJuz ? nextJuz.startPage - 1 : 604;

                                        const pages = [];
                                        for (let p = startPage; p <= endPage; p++) {
                                            pages.push(p);
                                        }
                                        return pages.map(p => (
                                            <button
                                                key={p}
                                                onClick={() => handlePageClick(p)}
                                                className="aspect-[3/4] rounded-md bg-white border border-slate-200 hover:border-forest-green hover:bg-sage-light/20 flex items-center justify-center font-mono text-sm transition-all"
                                            >
                                                {p}
                                            </button>
                                        ));
                                    })()}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>


            {/* Back Button */}
            <Link href="/" className="fixed top-4 left-4 z-50">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 flex items-center justify-center text-slate-700 hover:text-forest-green hover:bg-white transition-all cursor-pointer"
                >
                    <ArrowLeft size={24} strokeWidth={2} />
                </motion.div>
            </Link>
        </div >
    );
}
