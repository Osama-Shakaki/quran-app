
'use client';

import { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

// Augment the window interface for the custom install event
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

// Cache the event at the module level so it's not missed if the component mounts late
let cachedPrompt: BeforeInstallPromptEvent | null = null;
if (typeof window !== 'undefined') {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        cachedPrompt = e as BeforeInstallPromptEvent;
        // Optionally dispatch a custom event if it mounts later
        window.dispatchEvent(new CustomEvent('app-pwa-ready', { detail: e }));
    });
}

export default function InstallPrompt({ onInstallSuccess, variant = 'sidebar' }: { onInstallSuccess?: () => void, variant?: 'sidebar' | 'hero' }) {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(cachedPrompt);
    const [isStandalone, setIsStandalone] = useState(false);
    const [showButton, setShowButton] = useState(false);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);
    const [showOtherInstructions, setShowOtherInstructions] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Detect if already installed and running in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone) {
            setIsStandalone(true);
            return;
        }

        // For iOS devices, we show the button by default since 'beforeinstallprompt' is not supported there
        const isIos = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()) && !('MSStream' in window);
        if (isIos) {
            setShowButton(true);
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            cachedPrompt = e as BeforeInstallPromptEvent;
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Show the button only after the event is captured
            setShowButton(true);
        };

        const handleCustomEvent = (e: Event) => {
            const customEvent = e as CustomEvent;
            setDeferredPrompt(customEvent.detail);
            setShowButton(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('app-pwa-ready', handleCustomEvent);

        // If we already have it from the cache, update button visibility
        if (cachedPrompt) {
            setShowButton(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('app-pwa-ready', handleCustomEvent);
        };
    }, []);

    const handleInitialClick = () => {
        // Open our custom confirmation modal first
        setIsModalOpen(true);
    };

    const handleConfirm = async () => {
        if (deferredPrompt) {
            // Trigger the native OS prompt
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log('User choice:', outcome);

            if (outcome === 'accepted') {
                setIsStandalone(true);
                if (onInstallSuccess) onInstallSuccess();
            }
            setDeferredPrompt(null);
            setIsModalOpen(false);
        } else {
            // Fallback for iOS / Unsupported browsers (or Incognito mode)
            const isIos = /ipad|iphone|ipod/.test(navigator.userAgent.toLowerCase()) && !('MSStream' in window);
            if (isIos) {
                // Switch modal to show iOS instructions instead of native alert
                setShowIOSInstructions(true);
            } else {
                // Switch modal to show generic/desktop instructions
                setShowOtherInstructions(true);
            }
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        // Reset instructions state when closing so it's fresh next time
        setTimeout(() => {
            setShowIOSInstructions(false);
            setShowOtherInstructions(false);
        }, 300);
    };

    // If it's already installed, hide the button
    if (isStandalone) return null;

    return (
        <>
            {variant === 'sidebar' ? (
                /* Sidebar Button */
                <button
                    id="installAppBtn"
                    onClick={handleInitialClick}
                    className="flex items-center justify-between gap-2.5 md:gap-4 py-2.5 md:py-5 px-3 md:px-6 text-white rounded-xl md:rounded-[1.2rem] transition-all hover:scale-[1.02] active:scale-95 shadow-sm shadow-black/10 w-full relative overflow-hidden group border border-white/20 md:border-transparent mt-1 md:mt-0"
                    style={{ backgroundColor: '#18382d' }}
                >
                    {/* Subtle highlight effect */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Text section (will be on the right in RTL) */}
                    <div className="flex flex-col items-start gap-0.5 md:gap-1 text-right w-full">
                        <span className="font-bold text-[0.95rem] md:text-[1.15rem] tracking-tight leading-none text-white font-cairo">التثبيت كتطبيق</span>
                        <span className="text-[0.65rem] md:text-[0.85rem] text-white/80 md:text-white/90 font-medium leading-none whitespace-nowrap">للوصول الفوري وبدون إنترنت</span>
                    </div>

                    {/* Icon section (will be on the left in RTL) */}
                    <div className="bg-white/15 md:bg-white/20 p-2 md:p-3 rounded-lg md:rounded-2xl shrink-0 backdrop-blur-sm border border-white/5 shadow-inner">
                        <Download className="text-white drop-shadow-sm w-4 h-4 md:w-[26px] md:h-[26px]" strokeWidth={2.5} />
                    </div>
                </button>
            ) : (
                /* Hero Variant Banner */
                <button
                    id="installHeroBtn"
                    onClick={handleInitialClick}
                    className="flex items-center justify-between gap-3 md:gap-4 p-5 md:p-6 bg-gradient-to-r from-forest-green to-[#18382d] text-white rounded-2xl md:rounded-[2rem] transition-all hover:scale-[1.01] active:scale-95 shadow-xl shadow-forest-green/20 w-full relative overflow-hidden group border border-forest-green/30"
                >
                    {/* Subtle highlight & glow effects */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -left-10 -top-10 w-40 h-40 bg-sage-light/10 rounded-full blur-3xl group-hover:bg-sage-light/20 transition-colors"></div>

                    {/* Text section (will be on the right in RTL) */}
                    <div className="flex flex-col items-start gap-1.5 text-right w-full relative z-10">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-bold text-[1.4rem] tracking-tight leading-none text-white font-amiri">مكتبتي في جيبك</span>
                            <div className="px-3 py-1 bg-white/10 rounded-full text-[0.65rem] font-bold tracking-widest backdrop-blur-md border border-white/10">جديد</div>
                        </div>
                        <span className="text-[0.95rem] text-white/80 font-medium leading-relaxed">قم بتثبيت التطبيق للوصول الفوري السريع والقراءة بدون الحاجة للإنترنت إطلاقاً.</span>
                    </div>

                    {/* Icon section (will be on the left in RTL) */}
                    <div className="relative z-10 shrink-0">
                        <div className="absolute inset-0 bg-white/20 rounded-2xl blur-md group-hover:bg-white/30 transition-colors animate-pulse"></div>
                        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 shadow-inner group-hover:scale-110 transition-transform relative">
                            <Download size={32} className="text-white drop-shadow-md" strokeWidth={1.5} />
                        </div>
                    </div>
                </button>
            )}

            {mounted && createPortal(
                <AnimatePresence>
                    {isModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                            dir="rtl"
                        >
                            {/* Make sure we ignore clicks inside the modal content, but close on overlay click if desired */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                className="bg-[#fdfbf7] w-full max-w-sm rounded-3xl md:rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200/50 mx-2 md:mx-0"
                            >
                                <div className="p-5 md:p-7">
                                    {!showIOSInstructions && !showOtherInstructions ? (
                                        <>
                                            <div className="w-20 h-20 bg-forest-green/10 rounded-full flex items-center justify-center mx-auto mb-5 text-forest-green relative">
                                                <div className="absolute inset-0 bg-forest-green/20 rounded-full animate-ping opacity-20" />
                                                <Download size={36} />
                                            </div>
                                            <h3 className="text-2xl font-amiri font-bold text-center text-slate-800 mb-3">
                                                التثبيت كتطبيق
                                            </h3>
                                            <p className="text-center text-slate-600 mb-8 leading-relaxed font-medium">
                                                هل ترغب في تثبيت تطبيق "مكتبتي" ليعمل كبرنامج مستقل على جهازك وبدون الحاجة للإتصال بالإنترنت؟
                                            </p>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleConfirm}
                                                    className="flex-1 bg-forest-green text-white py-3.5 rounded-xl font-bold transition-transform active:scale-95 shadow-md shadow-forest-green/20"
                                                >
                                                    تأكيد
                                                </button>
                                                <button
                                                    onClick={handleCloseModal}
                                                    className="flex-1 bg-slate-200/80 text-slate-700 py-3.5 rounded-xl font-bold transition-transform active:scale-95 hover:bg-slate-300/80"
                                                >
                                                    إلغاء
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    handleCloseModal();
                                                    window.dispatchEvent(new Event('hide-install-bubble'));
                                                    localStorage.setItem('install-bubble-dismissed', 'true');
                                                }}
                                                className="mt-4 w-full text-center text-[0.85rem] text-slate-400 hover:text-slate-600 font-medium transition-colors"
                                            >
                                                لا تظهر هذه النافذة مجدداً
                                            </button>
                                        </>
                                    ) : showIOSInstructions ? (
                                        <>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-amiri font-bold text-slate-800">
                                                    تثبيت على أجهزة آيفون
                                                </h3>
                                                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-100/50 rounded-full">
                                                    <X size={20} />
                                                </button>
                                            </div>

                                            <div className="flex flex-col gap-4 mb-8">
                                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                    <div className="bg-blue-50 text-blue-500 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                                                        <Share size={22} className="ml-0.5 mb-1" />
                                                    </div>
                                                    <p className="text-sm text-slate-700 font-medium">1. اضغط على أيقونة <span className="font-bold text-slate-900">المشاركة</span> في شريط المتصفح السُفلي</p>
                                                </div>
                                                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                                    <div className="bg-slate-50 text-slate-700 w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                                                        <PlusSquare size={22} />
                                                    </div>
                                                    <p className="text-sm text-slate-700 font-medium">2. اسحب للأسفل واختر <span className="font-bold text-slate-900">إضافة إلى الصفحة الرئيسية (Add to Home Screen)</span></p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleCloseModal}
                                                className="w-full bg-forest-green text-white py-3.5 rounded-xl font-bold transition-transform active:scale-95 shadow-md shadow-forest-green/20"
                                            >
                                                حسناً، فهمت
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex justify-between items-center mb-6">
                                                <h3 className="text-xl font-amiri font-bold text-slate-800">
                                                    خطوات التثبيت اليدوي
                                                </h3>
                                                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors p-2 bg-slate-100/50 rounded-full">
                                                    <X size={20} />
                                                </button>
                                            </div>

                                            <div className="flex flex-col gap-4 mb-8">
                                                <div className="bg-amber-50 text-amber-800 p-4 rounded-xl border border-amber-200 shadow-sm flex gap-3 text-sm font-medium mb-2 leading-relaxed">
                                                    <Info size={28} className="shrink-0 mt-0.5 text-amber-600" />
                                                    <p>التثبيت التلقائي يتطلب اتصالاً آمناً (HTTPS) ولا يعمل عبر الشبكة المحلية المؤقتة. يمكنك التثبيت يدوياً باتباع الخطوات، أو الانتظار وسيعمل التلقائي فور رفع التطبيق على الإنترنت.</p>
                                                </div>

                                                <div className="flex flex-col gap-3">
                                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                                                        <p className="text-sm text-slate-700">
                                                            <strong className="text-slate-900 block mb-1">💻 أجهزة الكمبيوتر:</strong>
                                                            ابحث عن أيقونة التثبيت <span className="inline-block bg-slate-100 px-1 rounded mx-1">⬇️</span> في شريط عنوان المتصفح (URL).
                                                        </p>
                                                    </div>
                                                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
                                                        <p className="text-sm text-slate-700">
                                                            <strong className="text-slate-900 block mb-1">📱 أجهزة الأندرويد:</strong>
                                                            افتح قائمة المتصفح <span className="inline-block bg-slate-100 px-1 rounded mx-1">⋮</span> واختر <strong className="text-forest-green">إضافة للشاشة الرئيسية</strong>.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleCloseModal}
                                                className="w-full bg-forest-green text-white py-3.5 rounded-xl font-bold transition-transform active:scale-95 shadow-md shadow-forest-green/20"
                                            >
                                                حسناً، فهمت
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
