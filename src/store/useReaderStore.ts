import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type BookType = 'quran' | 'thoughts';

interface Note {
    pageId: string;
    content: string;
    createdAt: number;
}

interface ReaderState {
    currentBook: BookType;
    currentPage: number; // The active page being viewed
    quranPage: number;   // Last viewed page in Quran
    thoughtsPage: number; // Last viewed page in Thoughts
    bookmarks: string[]; // List of bookmarked page IDs
    notes: Record<string, Note>; // Map pageId to Note

    // Actions
    setBook: (book: BookType) => void;
    setPage: (page: number) => void;
    toggleBookmark: (pageId: string) => void;
    saveNote: (pageId: string, content: string) => void;
    deleteNote: (pageId: string) => void;

    // UI State
    isUIVisible: boolean;
    toggleUI: () => void;
    setUIVisible: (visible: boolean) => void;

    // View State
    rotation: number;
    rotatePage: () => void;
    isTwoPageView: boolean;
    setTwoPageView: (isTwoPage: boolean) => void;
}

export const useReaderStore = create<ReaderState>()(
    persist(
        (set) => ({
            currentBook: 'quran',
            currentPage: 1, // This will be dynamic based on currentBook
            quranPage: 5, // Start at Al-Fatiha (File 5)
            thoughtsPage: 1,
            bookmarks: [], // Initialize as empty string array
            notes: {},

            setBook: (book) => set((state) => ({
                currentBook: book,
                // When switching books, restore the page for that book
                currentPage: book === 'quran' ? state.quranPage : state.thoughtsPage,
                rotation: 0 // Reset rotation when switching books
            })),

            setPage: (page) => set((state) => {
                const updates: Partial<ReaderState> = { currentPage: page };
                if (state.currentBook === 'quran') {
                    updates.quranPage = page;
                } else {
                    updates.thoughtsPage = page;
                }
                return updates;
            }),

            toggleBookmark: (pageId) => set((state) => ({
                bookmarks: state.bookmarks.includes(pageId)
                    ? state.bookmarks.filter((id) => id !== pageId)
                    : [...state.bookmarks, pageId],
            })),

            saveNote: (pageId, content) => set((state) => ({
                notes: {
                    ...state.notes,
                    [pageId]: { pageId, content, createdAt: Date.now() },
                },
            })),

            deleteNote: (pageId) => set((state) => {
                const { [pageId]: _, ...remainingNotes } = state.notes;
                return { notes: remainingNotes };
            }),

            isUIVisible: true,
            toggleUI: () => set((state) => ({ isUIVisible: !state.isUIVisible })),
            setUIVisible: (visible) => set({ isUIVisible: visible }),

            rotation: 0,
            rotatePage: () => set((state) => ({ rotation: (state.rotation + 90) % 360 })),

            isTwoPageView: false,
            setTwoPageView: (isTwoPage) => set({ isTwoPageView: isTwoPage }),
        }),
        {
            name: 'heritage-reader-storage', // Restored to previous key
            storage: createJSONStorage(() => localStorage),
        }
    )
);
