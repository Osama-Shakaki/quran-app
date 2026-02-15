'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, BookOpen, Layers } from 'lucide-react';
import { QURAN_INDEX_DATA } from '@/data/quranIndexData';

interface QuranIndexProps {
    onPageSelect: (pageNumber: number) => void;
}

export default function QuranIndex({ onPageSelect }: QuranIndexProps) {
    const [expandedJuz, setExpandedJuz] = useState<number | null>(null);

    const toggleJuz = (id: number) => {
        setExpandedJuz(expandedJuz === id ? null : id);
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 font-cairo" dir="rtl">
            {QURAN_INDEX_DATA.map((juz) => (
                <div key={juz.id} className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-all hover:shadow-md hover:border-sage-green/30">
                    {/* Accordion Header */}
                    <button
                        onClick={() => toggleJuz(juz.id)}
                        className={`w-full p-5 flex items-center justify-between transition-colors ${expandedJuz === juz.id ? 'bg-sage-light/30 text-forest-green' : 'hover:bg-slate-50 text-slate-700'}`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg font-amiri ${expandedJuz === juz.id ? 'bg-forest-green text-white shadow-lg' : 'bg-slate-100 text-slate-500'}`}>
                                {juz.id}
                            </div>
                            <div className="flex flex-col items-start">
                                <span className={`text-xl font-bold font-amiri ${expandedJuz === juz.id ? 'text-forest-green' : 'text-slate-800'}`}>
                                    {juz.name}
                                </span>
                                <span className="text-sm text-slate-500">
                                    صفحة {juz.startPage} - {juz.endPage}
                                </span>
                            </div>
                        </div>
                        <motion.div
                            animate={{ rotate: expandedJuz === juz.id ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={expandedJuz === juz.id ? 'text-forest-green' : 'text-slate-400'}
                        >
                            <ChevronDown size={24} />
                        </motion.div>
                    </button>

                    {/* Accordion Content */}
                    <AnimatePresence>
                        {expandedJuz === juz.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                                className="overflow-hidden"
                            >
                                <div className="p-5 border-t border-slate-100 bg-white/50">
                                    {/* Surahs Section */}
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm font-bold">
                                            <BookOpen size={16} />
                                            <span>السور في هذا الجزء</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {juz.surahs.map((surah, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => onPageSelect(surah.startPage + 4)}
                                                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-forest-green hover:text-white hover:border-forest-green transition-colors font-amiri font-bold shadow-sm"
                                                >
                                                    سورة {surah.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pages Grid Section */}
                                    <div>
                                        <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm font-bold">
                                            <Layers size={16} />
                                            <span>صفحات الجزء</span>
                                        </div>
                                        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
                                            {Array.from({ length: (juz.endPage - juz.startPage + 1) }, (_, i) => juz.startPage + i).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => onPageSelect(page + 4)}
                                                    className="aspect-square rounded-lg bg-slate-50 hover:bg-sage-light hover:text-forest-green text-slate-600 font-mono text-sm border border-transparent hover:border-sage-green/30 transition-all flex items-center justify-center"
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}


        </div>
    );
}
