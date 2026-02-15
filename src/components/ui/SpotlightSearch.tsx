'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Hash, BookOpen, X, CornerDownLeft } from 'lucide-react';
import { QURAN_SURAHS, THOUGHTS_PAGES } from '@/data/quran_metadata';
import { useReaderStore } from '@/store/useReaderStore';

interface SpotlightSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SpotlightSearch({ isOpen, onClose }: SpotlightSearchProps) {
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const { setPage, setBook, currentBook } = useReaderStore();

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setActiveIndex(0);
        }
    }, [isOpen]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) => (prev + 1) % results.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                handleSelect(results[activeIndex]);
            } else if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, activeIndex, query]); // Added results as dependency via query but results is derived

    // Search Logic
    const results = useMemo(() => {
        if (!query.trim()) return [];
        const term = query.toLowerCase().trim();
        const searchResults: any[] = [];

        // 1. Page Number Logic (Shared but different constraints)
        // Check for specific "Page X" pattern OR just a pure number
        const pageMatch = term.match(/^(?:page|صفحة|ص)?\s*(\d+)$/);

        if (pageMatch) {
            const pageNum = parseInt(pageMatch[1]);

            if (currentBook === 'quran') {
                if (pageNum >= 1 && pageNum <= 604) {
                    searchResults.push({ type: 'page', number: pageNum, label: `الذهاب للصفحة ${pageNum}` });
                }
            } else if (currentBook === 'thoughts') {
                // Thoughts book logic
                if (pageNum >= 1 && pageNum <= THOUGHTS_PAGES.length) {
                    searchResults.push({ type: 'page', number: pageNum, label: `الذهاب للصفحة ${pageNum}` });
                }
            }
        }

        // 2. Surah Search (Only for Quran)
        if (currentBook === 'quran') {
            const normalize = (text: string) => text.replace(/[أإآ]/g, 'ا').replace(/[ة]/g, 'ه');

            const surahMatches = QURAN_SURAHS
                .filter(s => normalize(s.name).includes(normalize(term))) // Removed s.number check per request
                .map(s => ({ type: 'surah', ...s }))
                .slice(0, 5);

            searchResults.push(...surahMatches);
        }

        return searchResults;

    }, [query, currentBook]);

    const handleSelect = (item: any) => {
        if (!item) return;

        // No need to switch book as we are searching within context or context-aware
        // setBook(currentBook); // Already in correct book

        if (item.type === 'page') {
            setPage(item.number);
        } else if (item.type === 'surah') {
            setPage(item.startPage);
        }
        onClose();
    };

    // Dynamic Placeholder
    const placeholderText = currentBook === 'quran'
        ? "ابدأ البحث عن سورة أو رقم صفحة..."
        : "اكتب رقم الصفحة للذهاب إليها...";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[101] flex items-start justify-center pt-[20vh] px-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto border border-slate-100 flex flex-col max-h-[60vh] font-cairo"
                            dir="rtl"
                        >
                            {/* Input Header */}
                            <div className="flex items-center gap-3 p-4 border-b border-slate-100 bg-slate-50/50">
                                <Search className="text-slate-400 w-5 h-5 flex-shrink-0" />
                                <input
                                    autoFocus
                                    type="text"
                                    placeholder={placeholderText}
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-lg text-slate-800 placeholder:text-slate-400 font-amiri"
                                />
                                <button
                                    onClick={onClose}
                                    className="p-1 hover:bg-slate-200 rounded text-slate-500 text-xs font-mono border border-slate-200"
                                >
                                    ESC
                                </button>
                            </div>

                            {/* Results */}
                            <div className="overflow-y-auto p-2">
                                {results.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        {results.map((item: any, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleSelect(item)}
                                                onMouseEnter={() => setActiveIndex(index)}
                                                className={`flex items-center justify-between p-3 rounded-lg transition-colors text-right ${index === activeIndex ? 'bg-forest-green text-white' : 'text-slate-700 hover:bg-slate-100'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    {item.type === 'page' ? (
                                                        <Hash size={18} className={index === activeIndex ? 'text-white/80' : 'text-slate-400'} />
                                                    ) : (
                                                        <BookOpen size={18} className={index === activeIndex ? 'text-white/80' : 'text-slate-400'} />
                                                    )}
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-lg font-amiri">
                                                            {item.type === 'page' ? item.label : `سورة ${item.name}`}
                                                        </span>
                                                        {item.type === 'surah' && (
                                                            <span className={`text-xs ${index === activeIndex ? 'text-white/70' : 'text-slate-400'}`}>
                                                                صفحة {item.startPage}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {index === activeIndex && (
                                                    <CornerDownLeft size={16} className="opacity-50" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ) : query ? (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        لا توجد نتائج لـ "{query}"
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-slate-400 text-sm">
                                        <p className="mb-2">جرب البحث عن:</p>
                                        <div className="flex flex-wrap gap-2 justify-center">
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs">الكهف</span>
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs">يس</span>
                                            <span className="bg-slate-100 px-2 py-1 rounded text-xs">صفحة 100</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
