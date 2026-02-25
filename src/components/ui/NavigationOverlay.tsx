'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useReaderStore } from '@/store/useReaderStore';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, BookMarked, FileText, Trash2, ChevronLeft, Download } from 'lucide-react';
import SpotlightSearch from './SpotlightSearch';
import ReaderToolbar from './ReaderToolbar';
import FloatingStatusBar from './FloatingStatusBar';
import { QURAN_SURAHS, QURAN_PAGES, THOUGHTS_PAGES } from '@/data/quran_metadata';
import InstallPrompt from './InstallPrompt';

interface NavigationOverlayProps {
    onNotesClick: () => void;
}

export default function NavigationOverlay({ onNotesClick }: NavigationOverlayProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'menu' | 'bookmarks' | 'notes'>('menu');

    // Subscribe to specific store updates to avoid unnecessary re-renders
    const isUIVisible = useReaderStore((state) => state.isUIVisible);
    const setUIVisible = useReaderStore((state) => state.setUIVisible);
    const currentPage = useReaderStore((state) => state.currentPage);
    const setPage = useReaderStore((state) => state.setPage);
    const currentBook = useReaderStore((state) => state.currentBook);
    const setBook = useReaderStore((state) => state.setBook);
    const bookmarks = useReaderStore((state) => state.bookmarks);
    const toggleBookmark = useReaderStore((state) => state.toggleBookmark);
    const notes = useReaderStore((state) => state.notes);
    const deleteNote = useReaderStore((state) => state.deleteNote);
    const rotatePage = useReaderStore((state) => state.rotatePage);
    const rotation = useReaderStore((state) => state.rotation);

    // Current page ID for bookmarking
    const pageId = currentBook === 'quran' ? `quran-file-${currentPage}` : `thoughts-${currentPage}`;
    // @ts-ignore - Temporary ignore until store is reverted
    const isBookmarked = Array.isArray(bookmarks) && bookmarks.includes(pageId);

    // Derive Surah and Juz info
    const pageData = QURAN_PAGES.find(p => p.pageNumber === currentPage);
    const currentSurahName = pageData?.surah || 'الفاتحة';
    const currentJuzNum = pageData?.juz || 1;

    // Fetch additional state for Two-Page View toggle
    const isTwoPageView = useReaderStore((state) => state.isTwoPageView);
    const setTwoPageView = useReaderStore((state) => state.setTwoPageView);
    const [isLandscape, setIsLandscape] = useState(false);
    const [isLandscapeForToolbar, setIsLandscapeForToolbar] = useState(false);

    // Detect Mobile Landscape Mode only (not desktop)
    useEffect(() => {
        const checkLandscape = () => {
            const isLandscapeOrientation = window.matchMedia("(orientation: landscape)").matches;
            const isMobile = window.matchMedia("(max-width: 1023px)").matches;
            // isLandscape: true فقط عند جوال في الوضع الأفقي (للقائمة)
            setIsLandscape(isLandscapeOrientation && isMobile);
            // isLandscapeForToolbar: true لأي جهاز في الوضع الأفقي (لأيقونة عرض الصفحتين)
            setIsLandscapeForToolbar(isLandscapeOrientation);
        };

        checkLandscape();
        window.addEventListener('resize', checkLandscape);
        return () => window.removeEventListener('resize', checkLandscape);
    }, []);

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

    // Smart Scroll & Strict Zoom Detection for Immersive Reading
    useEffect(() => {
        let lastScrollY = window.scrollY;
        let ticking = false;
        const SCROLL_THRESHOLD = 5;

        // 1. Strict Zoom Handler
        const handleZoomCheck = () => {
            if (!window.visualViewport) return;

            const currentScale = window.visualViewport.scale;

            // If scale > 1 (user is zoomed in), strictly hide the header
            if (currentScale > 1.01) {
                setUIVisible(false);
            } else {
                setUIVisible(true);
            }
        };

        // 2. Scroll Handler (only triggers when NOT zoomed)
        const updateVisibilityOnScroll = () => {
            const currentScrollY = window.scrollY;

            // iOS over-scroll (rubber banding) protection
            if (currentScrollY <= 0) {
                setUIVisible(true);
            } else if (Math.abs(currentScrollY - lastScrollY) > SCROLL_THRESHOLD) {
                if (currentScrollY > lastScrollY) {
                    // Scrolling Down -> Hide
                    setUIVisible(false);
                } else {
                    // Scrolling Up -> Show
                    setUIVisible(true);
                }
            }

            lastScrollY = currentScrollY;
            ticking = false;
        };

        const handleScroll = () => {
            const isZoomed = window.visualViewport && window.visualViewport.scale > 1.01;

            if (isZoomed) {
                // Let handleZoomCheck handle the hiding if zoomed
                return;
            }

            if (!ticking) {
                window.requestAnimationFrame(updateVisibilityOnScroll);
                ticking = true;
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", handleZoomCheck, { passive: true });
            window.visualViewport.addEventListener("scroll", handleZoomCheck, { passive: true });
            // Initial check
            handleZoomCheck();
        }

        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", handleZoomCheck);
                window.visualViewport.removeEventListener("scroll", handleZoomCheck);
            }
        };
    }, [setUIVisible]);

    // Helpers to parse ID and format label
    const parseIdToLabel = (id: string) => {
        let pageNum = 0;
        let isThoughts = false;

        if (id.startsWith('thoughts-')) {
            pageNum = parseInt(id.replace('thoughts-', ''), 10);
            isThoughts = true;
        } else if (id.startsWith('quran-file-')) {
            pageNum = parseInt(id.replace('quran-file-', ''), 10);
        } else if (!isNaN(Number(id))) {
            // Fallback for old numeric IDs saved in previous sessions
            pageNum = Number(id);
        }

        if (pageNum > 0) {
            if (isThoughts) {
                return `خواطر وحكم - صفحة ${pageNum}`;
            } else {
                const data = QURAN_PAGES.find(p => p.pageNumber === pageNum);
                return data && !data.isIntro ? `سورة ${data.surah} - صفحة ${data.quranPageNumber}` : `القرآن الكريم - غلاف/مقدمة`;
            }
        }

        return 'عنصر غير معروف';
    };

    const navigateToItem = (id: string, openNote: boolean = false) => {
        let pageNum = 0;
        let isThoughts = false;

        if (id.startsWith('thoughts-')) {
            pageNum = parseInt(id.replace('thoughts-', ''), 10);
            isThoughts = true;
        } else if (id.startsWith('quran-file-')) {
            pageNum = parseInt(id.replace('quran-file-', ''), 10);
        } else if (!isNaN(Number(id))) {
            pageNum = Number(id);
        }

        if (pageNum > 0) {
            if (isThoughts) {
                if (currentBook !== 'thoughts') {
                    setBook('thoughts');
                }
                if (!pathname.includes('/thoughts')) {
                    router.push('/thoughts'); // Perform actual Next.js navigation
                }
                setPage(pageNum);
            } else {
                if (currentBook !== 'quran') {
                    setBook('quran');
                }
                if (!pathname.includes('/quran/viewer')) {
                    router.push('/quran/viewer'); // Perform actual Next.js navigation
                }
                setPage(pageNum);
            }
        }
        setIsMenuOpen(false); // Close drawer after navigation

        if (openNote) {
            // slightly longer timeout to allow the router push to start mounting the target route if needed
            setTimeout(() => {
                onNotesClick();
            }, 100);
        }
    };

    return (
        <>


            <AnimatePresence>
                {isUIVisible && (
                    <motion.div
                        variants={topBarVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed top-0 left-0 right-0 z-50 pointer-events-none pt-[env(safe-area-inset-top)]"
                    >
                        <div className="w-full pointer-events-auto">
                            <ReaderToolbar
                                onNotes={onNotesClick}
                                onRotate={currentBook === 'thoughts' ? rotatePage : undefined}
                                title={currentBook === 'quran' ? "القرآن الكريم" : "خواطر وحكم"}
                                onBookmark={() => toggleBookmark(pageId)}
                                onSearch={() => setIsSearchOpen(true)}
                                onMenuToggle={() => setIsMenuOpen(true)}
                                isBookmarked={isBookmarked || false}
                                isLandscape={isLandscapeForToolbar && currentBook === 'quran'}
                                isTwoPageView={isTwoPageView}
                                onToggleTwoPage={() => setTwoPageView(!isTwoPageView)}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                            className="fixed top-0 right-0 bottom-0 w-80 md:w-96 bg-[#fdfbf7] z-[70] shadow-2xl flex flex-col font-cairo overflow-hidden"
                            dir="rtl"
                        >
                            {/* Drawer Header */}
                            <div className="flex justify-between items-center p-6 border-b border-slate-200 bg-white/50 backdrop-blur-sm pt-[max(1.5rem,env(safe-area-inset-top))]">
                                <h2 className="text-2xl font-amiri font-bold text-forest-green">القائمة</h2>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Tabs Header */}
                            <div className="flex border-b border-slate-200">
                                <button
                                    onClick={() => setActiveTab('menu')}
                                    className={`flex-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'menu' ? 'border-forest-green text-forest-green' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                >
                                    الرئيسية
                                </button>
                                <button
                                    onClick={() => setActiveTab('bookmarks')}
                                    className={`flex-1 flex items-center justify-center gap-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'bookmarks' ? 'border-forest-green text-forest-green' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                >
                                    <BookMarked size={16} /> علاماتي
                                </button>
                                <button
                                    onClick={() => setActiveTab('notes')}
                                    className={`flex-1 flex items-center justify-center gap-1 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'notes' ? 'border-forest-green text-forest-green' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                                >
                                    <FileText size={16} /> ملاحظاتي
                                </button>
                            </div>

                            {/* Tab Content Area */}
                            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                                <AnimatePresence mode="wait">
                                    {/* MENU TAB */}
                                    {activeTab === 'menu' && (
                                        <motion.nav
                                            key="menu"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex flex-col gap-2"
                                        >
                                            <Link
                                                href="/"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 p-4 hover:bg-sage-light/30 rounded-xl transition-colors text-slate-700 hover:text-forest-green bg-white shadow-sm border border-slate-100"
                                            >
                                                <span className="font-bold text-lg">الرئيسية</span>
                                                <ChevronLeft size={20} className="mr-auto text-slate-400" />
                                            </Link>
                                            <Link
                                                href="/quran"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 p-4 hover:bg-sage-light/30 rounded-xl transition-colors text-slate-700 hover:text-forest-green bg-white shadow-sm border border-slate-100"
                                            >
                                                <span className="font-bold text-lg">المصحف المفسر</span>
                                                <ChevronLeft size={20} className="mr-auto text-slate-400" />
                                            </Link>
                                            <Link
                                                href="/thoughts"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 p-4 hover:bg-sage-light/30 rounded-xl transition-colors text-slate-700 hover:text-forest-green bg-white shadow-sm border border-slate-100"
                                            >
                                                <span className="font-bold text-lg">دفتر الخواطر</span>
                                                <ChevronLeft size={20} className="mr-auto text-slate-400" />
                                            </Link>

                                            {/* InstallPrompt يظهر فقط في Portrait (خارج منطقة التمرير) */}
                                        </motion.nav>
                                    )}

                                    {/* BOOKMARKS TAB */}
                                    {activeTab === 'bookmarks' && (() => {
                                        const filteredBookmarks = bookmarks.filter(id => {
                                            if (currentBook === 'quran') {
                                                return id.startsWith('quran-file-') || !isNaN(Number(id));
                                            }
                                            return id.startsWith('thoughts-');
                                        });

                                        return (
                                            <motion.div
                                                key="bookmarks"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="flex flex-col gap-3"
                                            >
                                                {filteredBookmarks.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center p-8 text-slate-400 text-center">
                                                        <BookMarked size={48} className="mb-4 opacity-20" />
                                                        <p>لا توجد علامات مرجعية محفوظة في هذا القسم.</p>
                                                        <p className="text-sm mt-2 opacity-70">اضغط على أيقونة العلامة في الأعلى لحفظ الصفحة الحالية.</p>
                                                    </div>
                                                ) : (
                                                    filteredBookmarks.map((id) => (
                                                        <div key={`bookmark-${id}`} className="group relative flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-sage-dark/30 transition-all hover:shadow-md">
                                                            <button
                                                                className="flex-1 text-right pr-2"
                                                                onClick={() => navigateToItem(id)}
                                                            >
                                                                <p className="font-bold text-forest-green text-sm sm:text-base line-clamp-1">{parseIdToLabel(id)}</p>
                                                                <p className="text-xs text-slate-400 mt-1">اضغط للانتقال</p>
                                                            </button>
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); toggleBookmark(id); }}
                                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1"
                                                                title="حذف العلامة"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    ))
                                                )}
                                            </motion.div>
                                        );
                                    })()}

                                    {/* NOTES TAB */}
                                    {activeTab === 'notes' && (() => {
                                        const filteredNotes = Object.values(notes).filter(note => {
                                            if (currentBook === 'quran') {
                                                return note.pageId.startsWith('quran-file-') || !isNaN(Number(note.pageId));
                                            }
                                            return note.pageId.startsWith('thoughts-');
                                        });

                                        return (
                                            <motion.div
                                                key="notes"
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                className="flex flex-col gap-3"
                                            >
                                                {filteredNotes.length === 0 ? (
                                                    <div className="flex flex-col items-center justify-center p-8 text-slate-400 text-center">
                                                        <FileText size={48} className="mb-4 opacity-20" />
                                                        <p>لا توجد ملاحظات محفوظة في هذا القسم.</p>
                                                        <p className="text-sm mt-2 opacity-70">اضغط على زر القلم لكتابة خواطرك حول الصفحة.</p>
                                                    </div>
                                                ) : (
                                                    filteredNotes.sort((a, b) => b.createdAt - a.createdAt).map((note) => (
                                                        <div
                                                            key={`note-${note.pageId}`}
                                                            onClick={() => navigateToItem(note.pageId, true)}
                                                            className="group flex flex-col p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-sage-dark/30 transition-all cursor-pointer hover:shadow-md"
                                                        >
                                                            <div className="flex justify-between items-start mb-2 group-hover:opacity-100">
                                                                <div className="flex-1 text-right text-xs text-sage-dark font-bold group-hover:text-forest-green transition-colors flex items-center gap-2">
                                                                    <span>{parseIdToLabel(note.pageId)}</span>
                                                                    {note.verseNumber && (
                                                                        <span className="bg-sage-light/50 text-forest-green px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap">
                                                                            آية {note.verseNumber}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); deleteNote(note.pageId); }}
                                                                    className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors mr-2"
                                                                    title="حذف الملاحظة"
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                            <div className="text-slate-700 text-sm leading-relaxed overflow-hidden text-ellipsis display-webkit-box webkit-line-clamp-3 webkit-box-orient-vertical">
                                                                {note.content}
                                                            </div>
                                                            <span className="text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-50 text-left">
                                                                {new Date(note.createdAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            </span>
                                                        </div>
                                                    ))
                                                )}
                                            </motion.div>
                                        );
                                    })()}
                                </AnimatePresence>
                            </div>

                            {/* PWA Install — ثابت في الأسفل في Portrait فقط */}
                            {!isLandscape && activeTab === 'menu' && (
                                <div className="px-5 pb-5 shrink-0 w-full">
                                    <InstallPrompt onInstallSuccess={() => setIsMenuOpen(false)} />
                                </div>
                            )}

                            {/* Drawer Footer */}
                            <div className="py-4 border-t border-slate-200 bg-white/50 backdrop-blur-sm shrink-0">
                                <div className="text-center text-slate-400 font-medium text-xs w-full">
                                    <p>مكتبتي © 2026</p>
                                </div>
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

            {/* PWA Install Banner — bottom bar */}

            {/* Spotlight Search Modal */}
            <SpotlightSearch
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </>
    );
}
