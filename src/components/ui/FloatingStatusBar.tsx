'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useReaderStore } from '@/store/useReaderStore';
import { QURAN_PAGES, THOUGHTS_PAGES } from '@/data/quran_metadata';

interface FloatingStatusBarProps {
    onOpenSearch: () => void;
}

export default function FloatingStatusBar({ onOpenSearch }: FloatingStatusBarProps) {
    const {
        currentBook,
        currentPage,
        isTwoPageView
    } = useReaderStore();

    const pages = currentBook === 'quran' ? QURAN_PAGES : THOUGHTS_PAGES;
    const pageData = pages.find(p => p.pageNumber === currentPage);

    // Two Page Logic
    const rightPageNum = currentPage % 2 !== 0 ? currentPage : currentPage - 1;
    const leftPageNum = rightPageNum + 1;

    const rightPageData = pages.find(p => p.pageNumber === rightPageNum);
    const leftPageData = pages.find(p => p.pageNumber === leftPageNum);

    // Helper to get Label
    const getPageLabel = () => {
        if (currentBook === 'thoughts') {
            if (currentPage === 1) return `صفحة 1`;
            const lower = (currentPage - 1) * 2;
            const upper = lower + 1;
            return `صفحة ${lower} - ${upper}`;
        }

        // Quran Logic
        if (isTwoPageView) {
            // Check Intro Status
            const rightIsIntro = rightPageData?.isIntro;
            const leftIsIntro = leftPageData?.isIntro;

            if (rightIsIntro && leftIsIntro) {
                return "المقدمة";
            }

            const rightLabel = rightIsIntro ? "المقدمة" : `صفحة ${rightPageData?.quranPageNumber}`;
            const leftLabel = leftIsIntro ? "المقدمة" : `صفحة ${leftPageData?.quranPageNumber}`;

            return `${rightLabel} - ${leftLabel}`;
        } else {
            // Single Page
            return pageData?.isIntro ? "المقدمة" : `صفحة ${pageData?.quranPageNumber}`;
        }
    };

    // Metadata (Surah/Juz) - Use Right/Current page as reference
    const activePageData = isTwoPageView ? rightPageData : pageData;
    const showMetadata = currentBook === 'quran' && activePageData && !activePageData.isIntro;

    return (
        <motion.button
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSearch}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 
                       flex items-center gap-3 px-5 py-2 
                       bg-black/30 backdrop-blur-md 
                       text-white rounded-full shadow-lg 
                       border border-white/10 hover:bg-black/40 transition-colors"
        >
            {/* Search Icon Indicator */}
            <div className="bg-white/10 p-1 rounded-full">
                <Search size={14} className="text-white/80" />
            </div>

            {/* Info Content */}
            <div className="flex items-center gap-2 text-xs font-amiri font-bold tracking-wide whitespace-nowrap">
                {showMetadata && (
                    <>
                        <span>{activePageData?.surah}</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full" />
                        <span>الجزء {activePageData?.juz}</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full" />
                    </>
                )}

                {/* Page Number Label */}
                <span>{getPageLabel()}</span>
            </div>
        </motion.button>
    );
}
