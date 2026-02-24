'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import InstallPrompt from './InstallPrompt';

export default function GlobalInstallBanner() {
    const pathname = usePathname();
    const [isStandalone, setIsStandalone] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);
    const [isDontShowChecked, setIsDontShowChecked] = useState(false);
    const [isInstallSupported, setIsInstallSupported] = useState(false);

    useEffect(() => {
        const checkStandalone = () => {
            const standalone = window.matchMedia('(display-mode: standalone)').matches ||
                (window.navigator as unknown as { standalone?: boolean }).standalone;
            setIsStandalone(!!standalone);

            const dismissed = localStorage.getItem('install-bubble-dismissed') === 'true';
            setIsDismissed(dismissed);

            if (!standalone && !dismissed) {
                setTimeout(() => setIsVisible(true), 2000);
            }
        };

        const checkInstallSupport = () => {
            // For iOS devices, we always show it because they don't support beforeinstallprompt
            const isIos = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()) && !('MSStream' in window);
            if (isIos) {
                setIsInstallSupported(true);
            }

            // Check if we already have the event cached globally by InstallPrompt or Layout inline script
            if (window.hasOwnProperty('cachedInstallEvent') || (window as any).cachedPrompt || (window as any).globalInstallPrompt) {
                setIsInstallSupported(true);
            }
        };

        const handlePwaReady = () => {
            setIsInstallSupported(true);
        };

        const handleForceHide = () => {
            setIsVisible(false);
            setIsExpanded(false);
            setIsDismissed(true);
        };

        window.addEventListener('hide-install-bubble', handleForceHide);
        window.addEventListener('app-pwa-ready', handlePwaReady);
        window.addEventListener('beforeinstallprompt', handlePwaReady);

        checkStandalone();
        checkInstallSupport();

        return () => {
            window.removeEventListener('hide-install-bubble', handleForceHide);
            window.removeEventListener('app-pwa-ready', handlePwaReady);
            window.removeEventListener('beforeinstallprompt', handlePwaReady);
        };
    }, []);

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        setIsExpanded(false);
        localStorage.setItem('install-bubble-dismissed', 'true');
    };

    const handleCheckboxToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDontShowChecked(e.target.checked);
    };

    const handleCloseExpanded = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDontShowChecked) {
            window.dispatchEvent(new Event('hide-install-bubble'));
            localStorage.setItem('install-bubble-dismissed', 'true');
        } else {
            setIsExpanded(false);
        }
    };

    if (isStandalone || isDismissed || pathname !== '/' || !isInstallSupported) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.8 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.8 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="fixed bottom-6 left-6 md:bottom-8 md:left-8 landscape:bottom-2 landscape:left-3 z-[90] font-cairo flex flex-col items-start mb-[env(safe-area-inset-bottom)]"
                    dir="rtl"
                >
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="mb-4 w-[320px] md:w-[340px] bg-white/95 backdrop-blur-xl shadow-2xl rounded-[1.5rem] overflow-hidden border border-white/40 p-4 relative"
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start w-full mb-3">
                                    <div className="flex gap-3 items-center">
                                        <div className="shrink-0 bg-sage-light/30 w-11 h-11 rounded-xl flex items-center justify-center text-forest-green border border-sage-green/20 shadow-inner">
                                            <Download size={20} className="drop-shadow-sm" />
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <h4 className="font-bold text-slate-800 text-[1.05rem] leading-tight mb-1 font-amiri tracking-wide">
                                                نزّل التطبيق لجهازك
                                            </h4>
                                            <p className="text-[0.75rem] text-slate-500 leading-tight font-medium">
                                                وصول أسرع، بدون إنترنت إطلاقاً
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCloseExpanded}
                                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-full transition-colors shrink-0"
                                        aria-label="إغلاق النافذة"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>

                                {/* Action Area */}
                                <div className="w-full">
                                    <InstallPrompt variant="sidebar" onInstallSuccess={() => setIsVisible(false)} />
                                </div>

                                <div className="mt-4 w-full flex items-center justify-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="dontShowAgain"
                                        checked={isDontShowChecked}
                                        onChange={handleCheckboxToggle}
                                        className="w-4 h-4 accent-forest-green cursor-pointer"
                                    />
                                    <label
                                        htmlFor="dontShowAgain"
                                        className="text-[0.85rem] text-slate-500 hover:text-slate-700 font-medium transition-colors cursor-pointer select-none"
                                    >
                                        لا تظهر هذه النافذة مجدداً
                                    </label>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Tooltip Message */}
                    <AnimatePresence>
                        {!isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                transition={{
                                    duration: 0.5,
                                    repeat: Infinity,
                                    repeatType: "reverse",
                                    repeatDelay: 3
                                }}
                                className="absolute -top-12 left-0 bg-forest-green text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
                            >
                                ثبّت التطبيق
                                <div className="absolute -bottom-1 left-4 w-2 h-2 bg-forest-green rotate-45"></div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* The Floating Bubble */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={!isExpanded ? {
                            y: [0, -8, 0],
                        } : {}}
                        transition={!isExpanded ? {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        } : {}}
                        onClick={() => setIsExpanded(!isExpanded)}
                        className={`relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 landscape:w-10 landscape:h-10 rounded-full shadow-lg border border-white/20 transition-colors z-10 ${isExpanded ? 'bg-slate-800 text-white' : 'bg-forest-green text-white hover:bg-forest-green/90'
                            }`}
                        aria-label="تثبيت التطبيق"
                    >
                        {isExpanded ? <X size={22} className="md:w-6 md:h-6" /> : <Download size={22} className="md:w-6 md:h-6" />}

                        {/* Red unread dot */}
                        {!isExpanded && (
                            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full"></span>
                        )}
                    </motion.button>



                </motion.div>
            )}
        </AnimatePresence>
    );
}
