'use client';

import { useRef, useState, useEffect } from 'react';
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
    const rotation = useReaderStore((state) => state.rotation);
    const isTwoPageView = useReaderStore((state) => state.isTwoPageView);
    const setTwoPageView = useReaderStore((state) => state.setTwoPageView);

    const [direction, setDirection] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    // Detect Tablet/Desktop Landscape
    useEffect(() => {
        const checkLayout = () => {
            // lg breakpoint (1024px) + Landscape
            // ONLY enable for Quran book (as requested)
            const isLandscape = window.matchMedia("(min-width: 1024px) and (orientation: landscape)").matches;
            setTwoPageView(isLandscape && currentBook === 'quran');
        };

        checkLayout();
        window.addEventListener('resize', checkLayout);
        return () => window.removeEventListener('resize', checkLayout);
    }, [currentBook, setTwoPageView]);

    // Determine Spread Pages
    // Right Page is always Odd (e.g. 1, 3, 5). Left Page is Even (2, 4, 6).
    // Spread for Page 1: [2][1]
    // Spread for Page 2: [2][1]
    // Spread for Page 3: [4][3]
    const rightPageNum = currentPage % 2 !== 0 ? currentPage : currentPage - 1;
    const leftPageNum = rightPageNum + 1;

    // Get Data
    const rightPageData = pages.find(p => p.pageNumber === rightPageNum);
    const leftPageData = pages.find(p => p.pageNumber === leftPageNum);

    // Navigation Helper
    const paginate = (newDirection: number) => {
        // If Two-Page View, jump by 2
        const step = isTwoPageView ? 2 : 1;
        const newPage = currentPage + (newDirection * step);

        if (newPage >= 1 && newPage <= pages.length) {
            setDirection(newDirection);
            setPage(newPage);
        } else if (isTwoPageView && newPage > pages.length && currentPage < pages.length) {
            // Go to very last page if close to end
            setPage(pages.length);
        }
    };

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') {
                paginate(1); // Next
            } else if (e.key === 'ArrowRight') {
                paginate(-1); // Prev
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentPage, pages.length, isTwoPageView]);

    // Swipe Gesture Handler
    const bind = useDrag(({ active, movement: [mx], direction: [xDir], cancel, tap }) => {
        if (isZoomed || tap) return;

        if (active && Math.abs(mx) > 100) {
            // REVERSED ARABIC LOGIC:
            // Swipe Left (← / Negative) -> Next Page (page + 1)
            // Swipe Right (→ / Positive) -> Previous Page (page - 1)
            // 
            // Wait, this comment matches the OLD code.
            // But user said "The Swipe Gestures ... are currently inverted ... I need to flip them."
            // So if I flip them:

            if (mx < 0 && currentPage > 1) {
                // Left Swipe (←) -> Go PREVIOUS (Visual: Dragging left reveals right content?)
                paginate(-1);
            } else if (mx > 0 && currentPage < pages.length) {
                // Right Swipe (→) -> Go NEXT (Visual: Dragging right reveals left content)
                paginate(1);
            }
            cancel();
        }
    }, {
        axis: 'x',
        filterTaps: true,
        rubberband: true,
        bgSwipe: true,
        pointer: { touch: true },
    });

    // Variants
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? -1000 : 1000,
            opacity: 0,
            scale: 0.95,
            zIndex: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        })
    };

    // Helper to render a single page
    const renderPage = (pageData: PageData | undefined, isRightSide: boolean) => {
        if (!pageData) return <div className="hidden lg:block w-1/2 h-full bg-transparent" />;

        return (
            <div
                className={`relative h-full transition-transform duration-300 ease-in-out ${isTwoPageView ? 'w-1/2' : 'w-full'}`}
                style={{
                    transform: `rotate(${rotation}deg)`,
                    // When rotated 90/270, swap dimensions to fit screen
                    width: rotation % 180 !== 0 ? '100vh' : undefined,
                    height: rotation % 180 !== 0 ? '100vw' : undefined,
                }}
            >
                {/* Paper Texture Overlay */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-10 mix-blend-multiply"
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                />

                {/* Inner Spine Shadow for Two Page View */}
                {isTwoPageView && (
                    <div className={`absolute inset-y-0 z-20 w-12 pointer-events-none ${isRightSide
                        ? 'left-0 bg-gradient-to-r from-black/10 to-transparent' // Right Page: Shadow on Left Edge
                        : 'right-0 bg-gradient-to-l from-black/10 to-transparent' // Left Page: Shadow on Right Edge
                        }`}
                    />
                )}

                {/* Loading Placeholder */}
                <div className="absolute inset-0 bg-[#fffdf5] flex flex-col items-center justify-center text-stone-300">
                    <span className="text-xl font-amiri opacity-20">{pageData.surah}</span>
                </div>

                <Image
                    src={pageData.imageSrc}
                    alt={`صفحة ${pageData.pageNumber}`}
                    fill
                    className={`object-contain ${isTwoPageView ? (isRightSide ? 'object-left' : 'object-right') : ''}`}
                    loading="eager"
                    sizes={isTwoPageView ? "50vw" : "100vw"}
                    draggable={false}
                />

                {/* Indicators */}
                {bookmarks.includes(pageData.id) && (
                    <div className="absolute top-0 right-8 sm:right-12 z-20 text-red-600 drop-shadow-md">
                        <svg width="24" height="40" viewBox="0 0 24 40" fill="currentColor">
                            <path d="M0 0h24v40L12 30 0 40V0z" />
                        </svg>
                    </div>
                )}
                {notes[pageData.id] && (
                    <div className="absolute top-4 left-8 sm:left-12 z-20 text-amber-600 drop-shadow-md bg-white/80 p-1.5 rounded-full border border-amber-200/50 backdrop-blur-sm">
                        <FilePenLine size={20} className="fill-amber-100" />
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="h-screen w-full bg-[#fdfbf7] dark:bg-zinc-900 relative overflow-hidden flex items-center justify-center">

            <AnimatePresence initial={false} custom={direction} mode='popLayout'>
                <motion.div
                    key={isTwoPageView ? rightPageNum : currentPage} // Key changes on spread change
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 }
                    }}
                    className={`absolute inset-0 flex items-center justify-center ${isZoomed ? '' : 'cursor-grab active:cursor-grabbing'}`}
                    {...(bind() as any)}
                    onTap={() => !isZoomed && toggleUI()}
                    style={{ touchAction: 'pan-y' }}
                >
                    <TransformWrapper
                        initialScale={1}
                        minScale={1}
                        maxScale={4}
                        centerOnInit={true}
                        wheel={{ step: 0.2 }}
                        pinch={{ step: 5 }}
                        disabled={!isZoomed}
                        doubleClick={{ disabled: false, step: 0.7, animationTime: 200 }}
                        alignmentAnimation={{ sizeX: 0, sizeY: 0, velocityAlignmentTime: 200 }}
                        onZoom={(ref) => setIsZoomed(ref.state.scale > 1.01)}
                        onTransformed={(ref) => setIsZoomed(ref.state.scale > 1.01)}
                    >
                        {({ zoomToElement, resetTransform }) => (
                            <TransformComponent
                                wrapperClass="!w-full !h-full flex items-center justify-center"
                                contentClass="!w-full !h-full flex items-center justify-center"
                            >
                                <div className={`relative w-full h-full mx-auto flex items-center justify-center ${rotation !== 0 ? 'p-0' : 'p-1'} ${isTwoPageView ? 'gap-0' : ''}`} dir={isTwoPageView ? "rtl" : undefined}>
                                    {/* In TwoPage View: [Right Page (Lower)] [Left Page (Higher)] for Correct RTL */}

                                    {isTwoPageView ? (
                                        <>
                                            {/* RIGHT SIDE (Odd Page, Lower Number) */}
                                            {renderPage(rightPageData, true)}

                                            {/* CENTER SPINE (Optional) */}
                                            <div className="hidden lg:block w-[1px] h-[95%] bg-gradient-to-b from-transparent via-stone-300 to-transparent opacity-30 z-30" />

                                            {/* LEFT SIDE (Even Page, Higher Number) */}
                                            {renderPage(leftPageData, false)}
                                        </>
                                    ) : (
                                        // Single Page View
                                        renderPage(pages.find(p => p.pageNumber === currentPage), true)
                                    )}
                                </div>
                            </TransformComponent>
                        )}
                    </TransformWrapper>
                </motion.div>
            </AnimatePresence>

            {/* Page Info Footer */}

        </div >
    );
}
