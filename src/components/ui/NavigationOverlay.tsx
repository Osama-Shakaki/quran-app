'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useReaderStore } from '@/store/useReaderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw } from 'lucide-react';
import SpotlightSearch from './SpotlightSearch';
import ReaderToolbar from './ReaderToolbar';
import FloatingStatusBar from './FloatingStatusBar';
import { QURAN_SURAHS, QURAN_PAGES } from '@/data/quran_metadata';

interface NavigationOverlayProps {
    onNotesClick: () => void;
}

export default function NavigationOverlay({ onNotesClick }: NavigationOverlayProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    // Subscribe to specific store updates to avoid unnecessary re-renders
    const isUIVisible = useReaderStore((state) => state.isUIVisible);
    const currentPage = useReaderStore((state) => state.currentPage);
    const currentBook = useReaderStore((state) => state.currentBook);
    const bookmarks = useReaderStore((state) => state.bookmarks);
    const toggleBookmark = useReaderStore((state) => state.toggleBookmark);
    const rotatePage = useReaderStore((state) => state.rotatePage);
    const rotation = useReaderStore((state) => state.rotation);

    // Current page ID for bookmarking
    const pageId = currentBook === 'quran' ? `quran-${currentPage}` : `thoughts-${currentPage}`;
    // @ts-ignore - Temporary ignore until store is reverted
    const isBookmarked = Array.isArray(bookmarks) && bookmarks.includes(pageId);

    // Derive Surah and Juz info
    const pageData = QURAN_PAGES.find(p => p.pageNumber === currentPage);
    const currentSurahName = pageData?.surah || 'الفاتحة';
    const currentJuzNum = pageData?.juz || 1;

    // Initial load animation variants
    const topBarVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: { y: 0, opacity: 1 },
        exit: { y: -100, opacity: 0 }
    };

    // Keyboard shortcut for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>


            {/* Top Navigation Bar (Hidden in Immersive Mode) */}
            {/* Top Navigation Bar (Always Visible) */}
            <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
                <div className="w-full pointer-events-auto">
                    <ReaderToolbar
                        onNotes={onNotesClick}
                        onRotate={currentBook === 'thoughts' ? rotatePage : undefined}
                        title={currentBook === 'quran' ? "القرآن الكريم" : "خواطر وحكم"}
                        onBookmark={() => toggleBookmark(pageId)}
                        onSearch={() => setIsSearchOpen(true)}
                        onMenuToggle={() => setIsMenuOpen(true)}
                        isBookmarked={isBookmarked || false}
                    />
                </div>
            </div>

            {/* Side Menu Drawer */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-80 bg-[#fdfbf7] z-[70] shadow-2xl p-6 flex flex-col font-cairo"
                            dir="rtl"
                        >
                            <div className="flex justify-between items-center mb-8 border-b border-slate-200 pb-4">
                                <h2 className="text-2xl font-amiri font-bold text-forest-green">القائمة الرئيسية</h2>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-2">
                                <Link
                                    href="/"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 hover:bg-sage-light/50 rounded-xl transition-colors text-slate-700 hover:text-forest-green"
                                >
                                    <span className="font-bold text-lg">الرئيسية</span>
                                </Link>
                                <Link
                                    href="/quran"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 hover:bg-sage-light/50 rounded-xl transition-colors text-slate-700 hover:text-forest-green"
                                >
                                    <span className="font-bold text-lg">المصحف المفسر</span>
                                </Link>
                                <Link
                                    href="/thoughts"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 p-3 hover:bg-sage-light/50 rounded-xl transition-colors text-slate-700 hover:text-forest-green"
                                >
                                    <span className="font-bold text-lg">دفتر الخواطر</span>
                                </Link>
                            </nav>

                            <div className="mt-auto pt-6 border-t border-slate-200 text-center text-slate-400 text-sm">
                                <p>إصدار 1.0.0</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>



            {/* Floating Status Bar */}
            <AnimatePresence>
                {isUIVisible && (
                    <FloatingStatusBar
                        onOpenSearch={() => setIsSearchOpen(true)}
                    />
                )}
            </AnimatePresence>

            {/* Spotlight Search Modal */}
            <SpotlightSearch
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}
