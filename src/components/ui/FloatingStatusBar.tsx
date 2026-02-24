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
        isTwoPageView: isTwoPageViewRaw
    } = useReaderStore();

    // Force Single Page View for Thoughts book in the Status Bar as well
    const isTwoPageView = isTwoPageViewRaw && currentBook === 'quran';

    const pages = currentBook === 'quran' ? QURAN_PAGES : THOUGHTS_PAGES;
    const pageData = pages.find(p => p.pageNumber === currentPage);

    // Two Page Logic
    const rightPageNum = currentBook === 'quran'
        ? (currentPage % 2 === 0 ? currentPage : currentPage - 1)
        : (currentPage % 2 !== 0 ? currentPage : currentPage - 1);
    const leftPageNum = rightPageNum + 1;

    const rightPageData = pages.find(p => p.pageNumber === rightPageNum);
    const leftPageData = pages.find(p => p.pageNumber === leftPageNum);

    // Helper to format numbers in Arabic (Eastern) Numerals
    const formatArNum = (num: number | undefined) => {
        if (num === undefined) return '';
        return Number(num).toLocaleString('ar-EG');
    };

    // Helper to get Label
    const getPageLabel = () => {
        if (currentBook === 'thoughts') {
            if (isTwoPageView) {
                // If we are on the cover page (page 1) which is alone on the right
                if (rightPageNum === 1 && !leftPageData) {
                    return `صفحة ١`;
                }
                if (!rightPageData && leftPageData) {
                    return `صفحة ${formatArNum(leftPageData.pageNumber)}`;
                }
                if (rightPageData && !leftPageData) {
                    return `صفحة ${formatArNum(rightPageData.pageNumber)}`;
                }
                return `صفحة ${formatArNum(rightPageNum)} - ${formatArNum(leftPageNum)}`;
            } else {
                return `صفحة ${formatArNum(currentPage)}`;
            }
        }

        // Quran Logic
        if (isTwoPageView) {
            // Check Intro Status
            const rightIsIntro = rightPageData?.isIntro;
            const leftIsIntro = leftPageData?.isIntro;

            if (rightPageData && leftPageData && rightIsIntro && leftIsIntro) {
                if (rightPageData?.surah === leftPageData?.surah) {
                    return rightPageData?.surah;
                }
                return `${rightPageData?.surah} - ${leftPageData?.surah}`;
            }

            if (!rightPageData && leftPageData) {
                return leftPageData.isIntro ? leftPageData.surah : `صفحة ${formatArNum(leftPageData.quranPageNumber ?? leftPageData.pageNumber)}`;
            }
            if (rightPageData && !leftPageData) {
                return rightPageData.isIntro ? rightPageData.surah : `صفحة ${formatArNum(rightPageData.quranPageNumber ?? rightPageData.pageNumber)}`;
            }

            const rightLabel = rightIsIntro ? rightPageData?.surah : `صفحة ${formatArNum(rightPageData?.quranPageNumber ?? rightPageData?.pageNumber)}`;
            const leftLabel = leftIsIntro ? leftPageData?.surah : `صفحة ${formatArNum(leftPageData?.quranPageNumber ?? leftPageData?.pageNumber)}`;

            return `${rightLabel} - ${leftLabel}`;
        } else {
            // Single Page
            return pageData?.isIntro ? pageData?.surah : `صفحة ${formatArNum(pageData?.quranPageNumber ?? pageData?.pageNumber)}`;
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
                        <span>الجزء {formatArNum(activePageData?.juz)}</span>
                        <span className="w-1 h-1 bg-white/40 rounded-full" />
                    </>
                )}

                {/* Page Number Label */}
                <span>{getPageLabel()}</span>
            </div>
        </motion.button>
    );
}
