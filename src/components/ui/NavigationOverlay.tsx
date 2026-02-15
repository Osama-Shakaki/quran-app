'use client';

import { useState } from 'react';
import { useReaderStore } from '@/store/useReaderStore';
import { QURAN_PAGES } from '@/data/quran_metadata';
import { Bookmark, Search, Menu, FilePenLine, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavigationOverlayProps {
    onNotesClick: () => void;
}

export default function NavigationOverlay({ onNotesClick }: NavigationOverlayProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    const { currentPage, currentBook, bookmarks, toggleBookmark, setPage } = useReaderStore();

    const currentPageParams = currentBook === 'quran'
        ? QURAN_PAGES.find(p => p.pageNumber === currentPage)
        : { pageNumber: currentPage, id: `thoughts-${currentPage}` };

    const isBookmarked = currentPageParams ? bookmarks.includes(currentPageParams.id) : false;

    const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const page = parseInt(e.target.value);
        if (!isNaN(page)) setPage(page);
    };

    return (
        <>
            {/* Top Bar */}
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-b from-black/60 to-transparent text-white flex justify-between items-center"
            >
                <div className="flex items-center gap-4">
                    <button onClick={() => setIsOpen(true)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="text-xl font-amiri font-bold drop-shadow-sm">
                        {currentBook === 'quran' ? 'القرآن الكريم' : 'خواطر وحكم'}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowSearch(!showSearch)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        title="بحث / انتقال"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => currentPageParams && toggleBookmark(currentPageParams.id)}
                        className={`p-2 rounded-full hover:bg-white/10 transition-colors ${isBookmarked ? 'text-yellow-400' : 'text-white'}`}
                        title={isBookmarked ? "إزالة العلامة" : "حفظ العلامة"}
                    >
                        <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                    <button
                        onClick={onNotesClick}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        title="الملاحظات"
                    >
                        <FilePenLine className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>

            {/* Side Menu (Simple Implementation for now) */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-80 bg-off-white z-[70] shadow-2xl p-6 flex flex-col font-cairo"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-amiri font-bold text-forest-green">القائمة</h2>
                                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-4 text-slate-700">
                                <a href="/" className="flex items-center gap-3 p-3 hover:bg-sage-light rounded-xl transition-colors">
                                    <span className="font-bold">الرئيسية</span>
                                </a>
                                <a href="/quran" className="flex items-center gap-3 p-3 hover:bg-sage-light rounded-xl transition-colors">
                                    <span className="font-bold">المصحف المفسر</span>
                                </a>
                                <a href="/thoughts" className="flex items-center gap-3 p-3 hover:bg-sage-light rounded-xl transition-colors">
                                    <span className="font-bold">دفتر الخواطر</span>
                                </a>
                            </nav>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Search/GoTo Bar */}
            <AnimatePresence>
                {showSearch && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-20 left-4 right-4 z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden max-w-md mx-auto border border-white/20"
                    >
                        <div className="p-4 flex flex-col gap-4 font-cairo" dir="rtl">
                            <div className="flex items-center justify-between text-slate-700">
                                <span className="text-sm font-bold">الانتقال للصفحة</span>
                                <span className="bg-sage-light px-3 py-1 rounded-full text-forest-green font-bold font-mono">
                                    {currentPage}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max={currentBook === 'quran' ? 604 : 110}
                                value={currentPage}
                                onChange={handlePageChange}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-forest-green"
                            />
                            <div className="flex justify-between text-xs text-slate-400 font-mono">
                                <span>1</span>
                                <span>{currentBook === 'quran' ? 604 : 110}</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom info */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed bottom-6 left-0 right-0 z-30 pointer-events-none flex justify-center"
            >
                <div className="bg-black/40 backdrop-blur-md px-6 py-2 rounded-full text-white text-sm font-amiri shadow-lg border border-white/10">
                    {currentBook === 'quran' && currentPageParams && 'surah' in currentPageParams
                        ? `${currentPageParams.surah} • صفحة ${currentPage}`
                        : `صفحة ${currentPage}`}
                </div>
            </motion.div>
        </>
    );
}
