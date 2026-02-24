'use client';

import { FileEdit, Bookmark, Search, Menu, RotateCw, BookOpen, BookOpenCheck } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useReaderStore } from '@/store/useReaderStore';

interface ReaderToolbarProps {
    onNotes: () => void;
    onBookmark: () => void;
    onSearch: () => void;
    onMenuToggle: () => void;
    onRotate?: () => void;
    title?: string;
    isBookmarked?: boolean;
    isLandscape?: boolean;
    isTwoPageView?: boolean;
    onToggleTwoPage?: () => void;
}

export default function ReaderToolbar({
    onNotes,
    onBookmark,
    onSearch,
    onMenuToggle,
    onRotate,
    title = "القرآن الكريم",
    isBookmarked = false,
    isLandscape = false,
    isTwoPageView = false,
    onToggleTwoPage,
}: ReaderToolbarProps) {
    // Force Black Icons always (removed dark:text-white)
    const buttonClass = "w-10 h-10 flex items-center justify-center text-black transition-all hover:scale-110 active:scale-95 pointer-events-auto drop-shadow-md";

    return (
        <div className="w-full h-16 flex items-center justify-between px-4 z-[60] bg-transparent pt-[env(safe-area-inset-top)]" dir="ltr">
            {/* Left Side: Actions (Notes, Bookmark, Search) */}
            <div className="flex items-center gap-2">
                {isLandscape && onToggleTwoPage && (
                    <button
                        onClick={onToggleTwoPage}
                        className={buttonClass}
                        title={isTwoPageView ? "عرض صفحة واحدة" : "عرض صفحتين"}
                    >
                        {isTwoPageView ? (
                            <BookOpenCheck size={24} strokeWidth={2.5} color="#000000" />
                        ) : (
                            <BookOpen size={24} strokeWidth={2.5} color="#000000" />
                        )}
                    </button>
                )}
                {onRotate && (
                    <button
                        onClick={onRotate}
                        className={buttonClass}
                        title="تدوير الصفحة"
                    >
                        <RotateCw size={24} strokeWidth={2.5} color="#000000" />
                    </button>
                )}
                <button
                    onClick={onNotes}
                    className={buttonClass}
                    title="الملاحظات"
                >
                    <FileEdit size={24} strokeWidth={2.5} color="#000000" />
                </button>
                <button
                    onClick={onBookmark}
                    className={`relative w-10 h-10 flex items-center justify-center transition-all hover:scale-110 active:scale-95 pointer-events-auto drop-shadow-md ${isBookmarked ? 'text-yellow-600' : 'text-black'}`}
                    title={isBookmarked ? "إزالة العلامة" : "حفظ العلامة"}
                >
                    <AnimatePresence mode="wait">
                        {isTwoPageView ? (
                            <motion.div
                                key="double"
                                initial={{ opacity: 0, rotate: -10 }}
                                animate={{ opacity: 1, rotate: 0 }}
                                exit={{ opacity: 0, rotate: 10 }}
                                className="relative flex items-center justify-center"
                            >
                                {/* Background subtle bookmark for the left page */}
                                <Bookmark
                                    size={20}
                                    strokeWidth={2}
                                    className="absolute -translate-x-2.5 translate-y-1 opacity-60"
                                    color={isBookmarked ? "#ca8a04" : "#000000"}
                                    fill={isBookmarked ? "#fef08a" : "none"}
                                />
                                {/* Foreground main bookmark for the right page */}
                                <Bookmark
                                    size={24}
                                    strokeWidth={2.5}
                                    className="relative z-10 drop-shadow-sm"
                                    color={isBookmarked ? "#ca8a04" : "#000000"}
                                    fill={isBookmarked ? "currentColor" : "none"}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="single"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                            >
                                <Bookmark
                                    size={24}
                                    strokeWidth={2.5}
                                    color={isBookmarked ? "#ca8a04" : "#000000"}
                                    fill={isBookmarked ? "currentColor" : "none"}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Sparkle effect on active */}
                    {isBookmarked && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0.8 }}
                            animate={{ scale: [1, 1.8, 2], opacity: [0.8, 0, 0] }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="absolute inset-0 bg-yellow-400 rounded-full z-[-1]"
                        />
                    )}
                </button>
                <button
                    onClick={onSearch}
                    className={buttonClass}
                    title="بحث"
                >
                    <Search size={24} strokeWidth={2.5} color="#000000" />
                </button>
            </div>

            {/* Right Side: Menu & Title */}
            <div className="flex items-center gap-3">
                <Link href="/" className="text-black font-amiri text-lg pt-1 font-bold no-underline decoration-transparent hover:text-black">
                    {title}
                </Link>
                <button
                    onClick={onMenuToggle}
                    className={buttonClass}
                    title="القائمة"
                >
                    <Menu size={24} strokeWidth={2.5} color="#000000" />
                </button>
            </div>
        </div>
    );
}
