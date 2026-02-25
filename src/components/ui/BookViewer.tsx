'use client';

import { useRef, useState, useEffect, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { FilePenLine } from 'lucide-react';
import { useReaderStore } from '@/store/useReaderStore';
import { QURAN_PAGES, THOUGHTS_PAGES, PageData } from '@/data/quran_metadata';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';

export default function BookViewer() {
    const currentPage = useReaderStore((state) => state.currentPage);
    const setPage = useReaderStore((state) => state.setPage);
    const currentBook = useReaderStore((state) => state.currentBook);
    const pages = useReaderStore((state) => state.currentBook === 'quran' ? QURAN_PAGES : THOUGHTS_PAGES);
    const bookmarks = useReaderStore((state) => state.bookmarks);
    const notes = useReaderStore((state) => state.notes);
    const toggleUI = useReaderStore((state) => state.toggleUI);
    const setUIVisible = useReaderStore((state) => state.setUIVisible);
    const rotation = useReaderStore((state) => state.rotation);
    const isTwoPageViewRaw = useReaderStore((state) => state.isTwoPageView);
    const isTwoPageView = isTwoPageViewRaw && currentBook === 'quran';
    const setTwoPageView = useReaderStore((state) => state.setTwoPageView);

    const [direction, setDirection] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [isLandscapeState, setIsLandscapeState] = useState(false);
    const [isMobileLandscape, setIsMobileLandscape] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isPhoneLandscape, setIsPhoneLandscape] = useState(false);
    // activeLandscape: خاص بالقرآن في landscape على أجهزة اللمس
    const activeLandscape = isMobileLandscape && currentBook === 'quran';
    // isThoughtsPhoneLandscape: جوال بالوضع الأفقي + كتاب الخواطر
    const isThoughtsPhoneLandscape = isPhoneLandscape && currentBook === 'thoughts';
    // isThoughtsMobile: كتاب الخواطر على جهاز لمس → يملأ الشاشة كاملة
    const isThoughtsMobile = isTouchDevice && currentBook === 'thoughts';
    const prevPosY = useRef(0);
    // ref for scrollable root in landscape
    const scrollRef = useRef<HTMLDivElement>(null);

    // ── Layout Detection ────────────────────────────────────────────────────
    useEffect(() => {
        const checkLayout = () => {
            const isLand = window.matchMedia('(orientation: landscape)').matches;
            // pointer:coarse = جوال + أيباد (touch). pointer:fine = كمبيوتر/لابتوب (mouse)
            const isTouch = window.matchMedia('(pointer: coarse)').matches;
            const mobileLand = isLand && isTouch;

            if (!isLand) setTwoPageView(false);
            setIsLandscapeState(isLand);
            setIsMobileLandscape(mobileLand);
            setIsTouchDevice(isTouch);
            // جوال فقط (ليس أيباد): max-height في landscape أقل من  600px
            const isPhone = isTouch && isLand && window.matchMedia('(max-height: 600px)').matches;
            setIsPhoneLandscape(isPhone);
        };

        checkLayout();
        window.addEventListener('resize', checkLayout);
        window.addEventListener('orientationchange', checkLayout);
        return () => {
            window.removeEventListener('resize', checkLayout);
            window.removeEventListener('orientationchange', checkLayout);
        };
    }, [currentBook, setTwoPageView]);

    // ── Scroll to top on page change (landscape) ────────────────────────────
    useEffect(() => {
        if (isMobileLandscape && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [currentPage, isMobileLandscape]);

    // ── Spread Pages ────────────────────────────────────────────────────────
    const rightPageNum = currentBook === 'quran'
        ? (currentPage % 2 === 0 ? currentPage : currentPage - 1)
        : (currentPage % 2 !== 0 ? currentPage : currentPage - 1);
    const leftPageNum = rightPageNum + 1;

    const rightPageData = pages.find(p => p.pageNumber === rightPageNum);
    const leftPageData = pages.find(p => p.pageNumber === leftPageNum);

    // ── Preload ─────────────────────────────────────────────────────────────
    const preloadPages = useMemo(() => {
        const pagesToLoad: PageData[] = [];
        const start = Math.max(1, currentPage - 10);
        const end = Math.min(pages.length, currentPage + 10);
        for (let i = start; i <= end; i++) {
            if (i !== rightPageNum && i !== leftPageNum && (!isTwoPageView ? i !== currentPage : true)) {
                const p = pages.find(p => p.pageNumber === i);
                if (p) pagesToLoad.push(p);
            }
        }
        return pagesToLoad;
    }, [currentPage, pages, rightPageNum, leftPageNum, isTwoPageView]);

    // ── Navigation ──────────────────────────────────────────────────────────
    const paginate = (newDirection: number) => {
        const step = isTwoPageView ? 2 : 1;
        let newPage = currentPage + newDirection * step;
        if (isTwoPageView && newDirection === 1 && newPage > pages.length) newPage = pages.length;
        if (newPage >= 1 && newPage <= pages.length) {
            setDirection(newDirection);
            setPage(newPage);
        }
    };

    // ── Keyboard ────────────────────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') paginate(1);
            if (e.key === 'ArrowRight') paginate(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [currentPage, pages.length, isTwoPageView]);

    // ── useDrag Swipe (Portrait + Desktop) ──────────────────────────────────
    const bind = useDrag(({ active, movement: [mx], cancel, tap, touches }) => {
        if (isZoomed || tap || touches > 1) return;
        if (active && Math.abs(mx) > 100) {
            if (mx < 0 && currentPage > 1) paginate(-1);
            else if (mx > 0 && currentPage < pages.length) paginate(1);
            cancel();
        }
    }, { axis: 'x', filterTaps: true, rubberband: true, bgSwipe: true, pointer: { touch: true } });

    // ── Global Pointer Events Swipe (Mobile Landscape only) ─────────────────
    useEffect(() => {
        if (!isMobileLandscape || currentBook !== 'quran') return;

        let startX = 0, startY = 0, startTime = 0;
        let activeId: number | null = null;
        let pointerCount = 0, aborted = false;

        const onDown = (e: PointerEvent) => {
            pointerCount++;
            if (!e.isPrimary || pointerCount > 1) { aborted = true; return; }
            activeId = e.pointerId; startX = e.clientX; startY = e.clientY;
            startTime = Date.now(); aborted = false;
        };
        const onMove = (e: PointerEvent) => { if (pointerCount > 1) aborted = true; };
        const onUp = (e: PointerEvent) => {
            pointerCount = Math.max(0, pointerCount - 1);
            if (aborted || e.pointerId !== activeId || isZoomed) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
            const dt = Date.now() - startTime, dist = Math.abs(dx);
            if (Math.abs(dx) <= Math.abs(dy) * 1.5) return;
            if (!((dist > 30 && dt < 300) || dist > 60)) return;
            // وضع الصفحتين (RTL): يمين=التالي، يسار=السابق
            // الصفحة الواحدة: يمين=السابق، يسار=التالي
            if (isTwoPageView) {
                if (dx > 0) paginate(1); else paginate(-1);
            } else {
                if (dx > 0) paginate(-1); else paginate(1);
            }
            activeId = null;
        };
        const onCancel = () => { aborted = true; pointerCount = 0; activeId = null; };

        window.addEventListener('pointerdown', onDown);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onCancel);
        return () => {
            window.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onCancel);
        };
    }, [isMobileLandscape, currentBook, isZoomed, currentPage, pages.length, isTwoPageView]);

    // ── Variants ────────────────────────────────────────────────────────────
    const variants = {
        enter: (d: number) => ({ x: d > 0 ? -800 : 800, opacity: 0, scale: 0.98, zIndex: 0 }),
        center: { zIndex: 1, x: 0, opacity: 1, scale: 1 },
        exit: (d: number) => ({ zIndex: 0, x: d > 0 ? 800 : -800, opacity: 0, scale: 0.98 }),
    };

    // ── Render Page ─────────────────────────────────────────────────────────
    const renderPage = (pageData: PageData | undefined, isRightSide: boolean) => {
        if (!pageData) return <div className="hidden lg:block w-1/2 h-full bg-transparent" />;

        // Mobile landscape + Single page: full-width scrollable (aspect-ratio with scroll)
        const landscapeSingleStyle: React.CSSProperties = {
            position: 'relative',
            width: '100%',
            aspectRatio: '0.68 / 1',
        };

        // Mobile landscape + Two pages: fit to screen height, auto width
        const landscapeTwoPageStyle: React.CSSProperties = {
            position: 'relative',
            height: '100%',
            width: 'auto',
            aspectRatio: '0.68 / 1',
            maxHeight: '100vh',
        };

        const portraitPageStyle: React.CSSProperties = {
            transform: `rotate(${rotation}deg)`,
            width: rotation % 180 !== 0 ? '100vh' : undefined,
            height: rotation % 180 !== 0 ? '100vw' : undefined,
        };

        return (
            <div
                className={
                    activeLandscape
                        ? isTwoPageView
                            ? 'relative flex-shrink-0'
                            : ''
                        : `relative transition-transform duration-300 ease-in-out ${isTwoPageView ? 'max-h-full' : 'w-full h-full'
                        }`
                }
                style={
                    activeLandscape
                        ? isTwoPageView
                            ? landscapeTwoPageStyle
                            : landscapeSingleStyle
                        : {
                            ...(isTwoPageView ? { aspectRatio: '0.68 / 1', height: '100%', width: 'auto' } : {}),
                            transform: `rotate(${rotation}deg)`,
                            ...(rotation % 180 !== 0 ? { width: '100vh', height: '100vw' } : {}),
                        }
                }
            >
                {/* Paper Texture */}
                <div
                    className="absolute inset-0 opacity-[0.05] pointer-events-none z-10 mix-blend-multiply"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}
                />

                {/* Spine Shadow */}
                {isTwoPageView && (
                    <div className={`absolute inset-y-0 z-20 w-12 pointer-events-none ${isRightSide
                        ? 'left-0 bg-gradient-to-r from-black/10 to-transparent'
                        : 'right-0 bg-gradient-to-l from-black/10 to-transparent'
                        }`} />
                )}

                {/* Placeholder */}
                <div className="absolute inset-0 bg-[#fffdf5] flex flex-col items-center justify-center text-stone-300">
                    <span className="text-xl font-amiri opacity-20">{pageData.surah}</span>
                </div>

                <Image
                    src={pageData.imageSrc}
                    alt={`صفحة ${pageData.pageNumber}`}
                    fill
                    className={
                        activeLandscape
                            ? 'object-contain object-top'
                            : isTwoPageView
                                ? (isRightSide ? 'object-contain object-left' : 'object-contain object-right')
                                : 'object-contain'
                    }
                    priority
                    unoptimized
                    sizes={isTwoPageView ? '50vw' : '100vw'}
                    draggable={false}
                />

                {/* Bookmark */}
                {bookmarks.includes(pageData.id) && (
                    <>
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[42px] h-[4px] rounded-full"
                            style={{ background: 'linear-gradient(90deg, #d4af37, #fceb9e)', boxShadow: '0 2px 6px rgba(212,175,55,0.5)' }}
                        />
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-10 pointer-events-none mix-blend-multiply"
                            style={{ backgroundColor: 'rgba(212,175,55,0.04)' }}
                        />
                    </>
                )}

                {/* Notes Icon */}
                {notes[pageData.id] && (
                    <div className="absolute top-4 left-8 sm:left-12 z-20 text-amber-600 drop-shadow-md bg-white/80 p-1.5 rounded-full border border-amber-200/50 backdrop-blur-sm">
                        <FilePenLine size={20} className="fill-amber-100" />
                    </div>
                )}
            </div>
        );
    };

    // ── JSX ─────────────────────────────────────────────────────────────────
    // Mobile landscape: ROOT is the scroll container (h-screen overflow-y-auto)
    // Everything else: standard h-screen overflow-hidden
    return (
        <div
            ref={scrollRef}
            className={
                // two-page landscape: overflow-hidden (pages fit in screen)
                // single-page landscape: overflow-y-auto (scrollable)
                activeLandscape && isTwoPageView
                    ? 'h-screen w-full bg-[#fdfbf7] relative overflow-hidden flex items-center justify-center'
                    : activeLandscape
                        ? 'h-screen w-full bg-[#fdfbf7] overflow-y-auto'
                        : 'h-screen w-full bg-[#fdfbf7] relative overflow-hidden flex items-center justify-center'
            }
        >
            {/* Preload */}
            <div className="hidden">
                {preloadPages.map(page => (
                    <Image key={`preload-${page.id}`} src={page.imageSrc} alt="" width={100} height={100} unoptimized priority />
                ))}
            </div>

            <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                    key={`page-wrap-${currentBook}-${isTwoPageView ? rightPageNum : currentPage}`}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 400, damping: 25 },
                        opacity: { duration: 0.15 },
                    }}
                    className={
                        // two-page landscape: absolute inset-0 (fit to screen)
                        // single-page landscape: relative w-full (scrollable)
                        activeLandscape && isTwoPageView
                            ? `absolute inset-0 flex items-center justify-center ${isZoomed ? '' : 'cursor-grab active:cursor-grabbing'}`
                            : activeLandscape
                                ? 'relative w-full flex items-start justify-center'
                                : `absolute inset-0 flex items-center justify-center ${isZoomed ? '' : 'cursor-grab active:cursor-grabbing'}`
                    }
                    {...(!activeLandscape ? (bind() as any) : {})}
                    onTap={() => !isZoomed && toggleUI()}
                    style={{ touchAction: 'pan-y' }}
                >
                    <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={4}
                        centerOnInit={true}
                        wheel={{ step: 0.1, smoothStep: 0.005 }}
                        pinch={{ step: 2 }}
                        panning={{
                            // landscape: let native scroll work; portrait: library panning when zoomed
                            disabled: activeLandscape ? true : !isZoomed,
                            wheelPanning: !activeLandscape,
                        }}
                        limitToBounds={true}
                        zoomAnimation={{ animationType: 'easeOut', animationTime: 200 }}
                        doubleClick={{ disabled: false, step: 0.7, animationTime: 200 }}
                        alignmentAnimation={{ sizeX: 0, sizeY: 0, velocityAlignmentTime: 200, animationTime: 200 }}
                        onZoom={(ref) => setIsZoomed(ref.state.scale > 1.01)}
                        onTransformed={(ref) => setIsZoomed(ref.state.scale > 1.01)}
                        onPanningStart={(ref) => { prevPosY.current = ref.state.positionY; }}
                        onPanning={(ref) => {
                            const diff = ref.state.positionY - prevPosY.current;
                            if (Math.abs(diff) > 3) {
                                setUIVisible(diff > 0);
                                prevPosY.current = ref.state.positionY;
                            }
                        }}
                    >
                        {({ resetTransform }) => (
                            <TransformComponent
                                wrapperClass={
                                    activeLandscape && isTwoPageView
                                        ? '!w-full !h-full flex items-center justify-center'
                                        : activeLandscape
                                            ? '!w-full'
                                            : '!w-full !h-full flex items-center justify-center'
                                }
                                contentClass={
                                    activeLandscape && isTwoPageView
                                        ? '!w-full !h-full flex items-center justify-center'
                                        : activeLandscape
                                            ? '!w-full'
                                            : '!w-full !h-full flex items-center justify-center'
                                }
                            >
                                <div
                                    className={
                                        activeLandscape && isTwoPageView
                                            ? 'relative w-full h-full flex flex-row items-center justify-center'
                                            : activeLandscape
                                                ? 'w-full'
                                                : `relative w-full h-full mx-auto flex items-center justify-center ${(rotation !== 0 || isThoughtsPhoneLandscape) ? 'p-0' : 'p-1'} ${isTwoPageView ? 'gap-0' : ''}`
                                    }
                                    dir={isTwoPageView ? 'rtl' : undefined}
                                >
                                    {isTwoPageView ? (
                                        <>
                                            {renderPage(rightPageData, true)}
                                            <div className="hidden lg:block w-[1px] h-[95%] bg-gradient-to-b from-transparent via-stone-300 to-transparent opacity-30 z-30" />
                                            {renderPage(leftPageData, false)}
                                        </>
                                    ) : (
                                        renderPage(pages.find(p => p.pageNumber === currentPage), true)
                                    )}
                                </div>
                            </TransformComponent>
                        )}
                    </TransformWrapper>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
