'use client';

import { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Virtual, Keyboard } from 'swiper/modules';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Link from 'next/link';
import { ArrowLeft, FilePenLine } from 'lucide-react';
import { useReaderStore } from '@/store/useReaderStore';
import { QURAN_PAGES, THOUGHTS_PAGES, PageData, quranJuzData } from '@/data/quran_metadata';
import Image from 'next/image';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/virtual';

export default function BookViewer() {
    const { currentBook, currentPage, setPage, bookmarks, notes } = useReaderStore();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const swiperRef = useRef<any>(null);

    const pages: PageData[] = currentBook === 'quran' ? QURAN_PAGES : THOUGHTS_PAGES;

    // Sync external page changes (e.g. from slider) to Swiper
    useEffect(() => {
        if (swiperRef.current && swiperRef.current.activeIndex !== currentPage - 1) {
            swiperRef.current.slideTo(currentPage - 1);
        }
    }, [currentPage]);

    const handleSlideChange = (swiper: { activeIndex: number }) => {
        setPage(swiper.activeIndex + 1);
    };

    return (
        <div className="h-screen w-full bg-[#fdfbf7] dark:bg-zinc-900 relative">
            <Swiper
                modules={[Virtual, Keyboard]}
                spaceBetween={0}
                slidesPerView={1}
                virtual
                dir="rtl"
                keyboard={{ enabled: true }}
                onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                    // Initial sync
                    swiper.slideTo(currentPage - 1, 0);
                }}
                onSlideChange={handleSlideChange}
                className="h-full w-full"
            >
                {pages.map((page, index) => {
                    // We render a few slides around the current one for virtualization 
                    // (Swiper Virtual handles this logic but we map all for it to manage)
                    const isBookmarked = bookmarks.includes(page.id);
                    const hasNote = notes[page.id];

                    return (
                        <SwiperSlide key={page.id} virtualIndex={index} className="flex items-center justify-center h-full w-full relative">
                            <TransformWrapper
                                initialScale={1}
                                minScale={1}
                                maxScale={4}
                                centerOnInit={true}
                                wheel={{ step: 0.2 }}
                                pinch={{ step: 5 }}
                                doubleClick={{ disabled: false, step: 0.7, animationTime: 200 }}
                                alignmentAnimation={{ sizeX: 0, sizeY: 0, velocityAlignmentTime: 200 }}
                            >
                                {({ zoomToElement, resetTransform }) => (
                                    <TransformComponent
                                        wrapperClass="!w-full !h-full flex items-center justify-center"
                                        contentClass="!w-full !h-full flex items-center justify-center"
                                    >
                                        <div className="relative w-full h-full max-w-4xl mx-auto flex items-center justify-center p-2 sm:p-4">
                                            {/* Placeholder for the actual image */}
                                            <div className="relative w-full h-full shadow-2xl rounded-sm overflow-hidden bg-[#fdfbf7]">
                                                {/* Paper Texture Overlay */}
                                                <div className="absolute inset-0 opacity-[0.05] pointer-events-none z-10 mix-blend-multiply"
                                                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}
                                                />

                                                {/* Background placeholder while loading */}
                                                <div className="absolute inset-0 bg-[#fffdf5] flex flex-col items-center justify-center text-stone-300">
                                                    <div className="animate-pulse flex flex-col items-center">
                                                        <span className="text-6xl font-amiri opacity-10 mb-4">﷽</span>
                                                        <span className="text-2xl font-amiri opacity-40">
                                                            {page.surah ? page.surah : 'جاري التحميل...'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <Image
                                                    src={page.imageSrc}
                                                    alt={`صفحة ${page.pageNumber}`}
                                                    fill
                                                    className="object-contain"
                                                    loading="lazy"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
                                                />
                                            </div>

                                            {/* Bookmark Indicator on Page */}
                                            {isBookmarked && (
                                                <div className="absolute top-0 right-8 sm:right-12 z-10 text-red-600 drop-shadow-md">
                                                    <svg width="24" height="40" viewBox="0 0 24 40" fill="currentColor">
                                                        <path d="M0 0h24v40L12 30 0 40V0z" />
                                                    </svg>
                                                </div>
                                            )}

                                            {/* Note Indicator on Page */}
                                            {hasNote && (
                                                <div className="absolute top-4 left-8 sm:left-12 z-10 text-amber-600 drop-shadow-md bg-white/80 p-1.5 rounded-full border border-amber-200/50 backdrop-blur-sm">
                                                    <FilePenLine size={20} className="fill-amber-100" />
                                                </div>
                                            )}
                                        </div>
                                    </TransformComponent>
                                )}
                            </TransformWrapper>
                        </SwiperSlide>
                    );
                })}

            </Swiper>

            {/* Back Button */}
            <Link href="/" className="fixed bottom-8 right-8 z-50">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full shadow-lg border border-white/20 flex items-center justify-center text-slate-700 hover:text-forest-green hover:bg-white transition-all cursor-pointer"
                >
                    <ArrowLeft size={24} strokeWidth={2} />
                </motion.div>
            </Link>

            {/* Page Info Footer */}
            <div dir="rtl" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 px-6 py-3 text-forest-green font-amiri font-bold text-lg flex items-center gap-3 whitespace-nowrap">
                {currentBook !== 'quran' && (
                    <span>صفحة {currentPage}</span>
                )}
            </div>
        </div >
    );
}
