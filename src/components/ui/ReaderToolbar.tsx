'use client';

import { FileEdit, Bookmark, Search, Menu, RotateCw } from 'lucide-react';

interface ReaderToolbarProps {
    onNotes: () => void;
    onBookmark: () => void;
    onSearch: () => void;
    onMenuToggle: () => void;
    onRotate?: () => void;
    title?: string;
    isBookmarked?: boolean;
}

export default function ReaderToolbar({
    onNotes,
    onBookmark,
    onSearch,
    onMenuToggle,
    onRotate,
    title = "القرآن الكريم",
    isBookmarked = false,
}: ReaderToolbarProps) {
    // Force Black Icons always (removed dark:text-white)
    const buttonClass = "w-10 h-10 flex items-center justify-center text-black transition-all hover:scale-110 active:scale-95 pointer-events-auto drop-shadow-md";

    return (
        <div className="w-full h-16 flex items-center justify-between px-4 z-50 pointer-events-none" dir="ltr">
            {/* Left Side: Actions (Notes, Bookmark, Search) */}
            <div className="flex items-center gap-2 pointer-events-auto">
                {onRotate && (
                    <button
                        onClick={onRotate}
                        className={buttonClass}
                        title="تدوير الصفحة"
                    >
                        <RotateCw size={24} strokeWidth={2.5} color="#000000" />
                    </button>
                )}
                <button
                    onClick={onNotes}
                    className={buttonClass}
                    title="الملاحظات"
                >
                    <FileEdit size={24} strokeWidth={2.5} color="#000000" />
                </button>
                <button
                    onClick={onBookmark}
                    className={`${buttonClass} ${isBookmarked ? 'text-yellow-600 drop-shadow-lg' : ''}`}
                    title={isBookmarked ? "إزالة العلامة" : "حفظ العلامة"}
                >
                    {/* Bookmark uses fill, so color applies to stroke. Ensuring stroke is black unless active? Or just black stroke + fill? */}
                    {/* User said "Icon color black". Usually means stroke. */}
                    <Bookmark size={24} strokeWidth={2.5} color={isBookmarked ? "#ca8a04" : "#000000"} fill={isBookmarked ? "currentColor" : "none"} />
                </button>
                <button
                    onClick={onSearch}
                    className={buttonClass}
                    title="بحث"
                >
                    <Search size={24} strokeWidth={2.5} color="#000000" />
                </button>
            </div>

            {/* Right Side: Menu & Title */}
            <div className="flex items-center gap-3 pointer-events-auto">
                <span className="text-black font-amiri text-lg pt-1 drop-shadow-md font-bold">
                    {title}
                </span>
                <button
                    onClick={onMenuToggle}
                    className={buttonClass}
                    title="القائمة"
                >
                    <Menu size={24} strokeWidth={2.5} color="#000000" />
                </button>
            </div>
        </div>
    );
}
