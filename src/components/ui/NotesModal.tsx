'use client';

import { useState, useEffect } from 'react';
import { useReaderStore } from '@/store/useReaderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, FilePenLine } from 'lucide-react';
import { QURAN_PAGES } from '@/data/quran_metadata';

interface NotesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function NotesModal({ isOpen, onClose }: NotesModalProps) {
    const { currentPage, currentBook, notes, saveNote, deleteNote } = useReaderStore();
    const [noteContent, setNoteContent] = useState('');
    const [verseNumber, setVerseNumber] = useState('');

    // Determine current page ID
    const pageId = currentBook === 'quran'
        ? `quran-file-${currentPage}` // Match the standard format used elsewhere
        : `thoughts-${currentPage}`;

    // Compute tailored human-readable label for Note creation
    const pageData = currentBook === 'quran' ? QURAN_PAGES.find(p => p.pageNumber === currentPage) : null;
    const displayLabel = currentBook === 'quran' && pageData && !pageData.isIntro
        ? `سورة ${pageData.surah} - صفحة ${pageData.quranPageNumber}`
        : currentBook === 'quran'
            ? `القرآن الكريم - غلاف/مقدمة`
            : `خواطر وحكم - صفحة ${currentPage}`;

    // Load existing note when opening
    useEffect(() => {
        if (isOpen) {
            const existingNote = notes[pageId];
            setNoteContent(existingNote ? existingNote.content : '');
            setVerseNumber(existingNote?.verseNumber || '');
        }
    }, [isOpen, pageId, notes]);

    const handleSave = () => {
        if (noteContent.trim()) {
            saveNote(pageId, noteContent, verseNumber.trim());
        } else {
            // Optional: confirm deletion of empty note?
            deleteNote(pageId);
        }
        onClose();
    };

    const handleDelete = () => {
        deleteNote(pageId);
        setNoteContent('');
        setVerseNumber('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[80vh]"
                        dir="rtl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-off-white">
                            <div className="flex items-center gap-3 text-forest-green">
                                <div className="p-2 bg-sage-light rounded-full">
                                    <FilePenLine size={24} />
                                </div>
                                <h3 className="text-xl font-bold font-amiri">تدوين الملاحظات</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 flex-1 flex flex-col gap-4 overflow-y-auto">
                            <div className="flex items-center gap-2 text-sm text-slate-500 font-cairo">
                                <span>جاري إضافة ملاحظة لـ:</span>
                                <span className="bg-sage-light px-2 py-0.5 rounded text-forest-green font-bold text-xs">{displayLabel}</span>
                            </div>

                            {currentBook === 'quran' && (
                                <input
                                    type="text"
                                    placeholder="رقم الآية (اختياري)"
                                    value={verseNumber}
                                    onChange={(e) => setVerseNumber(e.target.value)}
                                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-sage-green focus:border-sage-green focus:outline-none font-cairo text-slate-800 placeholder:text-slate-400"
                                />
                            )}

                            <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                placeholder="اكتب خواطرك وتأملاتك حول هذه الصفحة هنا..."
                                className="w-full flex-1 min-h-[200px] p-4 rounded-2xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-sage-green focus:border-sage-green focus:outline-none resize-none font-cairo leading-relaxed text-slate-800 placeholder:text-slate-400"
                            />
                        </div>

                        {/* Footer */}
                        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center gap-4">
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 text-red-500 hover:text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition-colors group"
                            >
                                <Trash2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span className="font-cairo font-bold text-sm">حذف</span>
                            </button>

                            <button
                                onClick={handleSave}
                                className="flex-1 flex items-center justify-center gap-2 bg-forest-green hover:bg-emerald-800 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                            >
                                <Save className="w-5 h-5" />
                                <span className="font-cairo font-bold">حفظ الملاحظة</span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
