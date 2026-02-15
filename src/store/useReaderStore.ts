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
    bookmarks: string[]; // List of page IDs
    notes: Record<string, Note>; // Map pageId to Note

    // Actions
    setBook: (book: BookType) => void;
    setPage: (page: number) => void;
    toggleBookmark: (pageId: string) => void;
    saveNote: (pageId: string, content: string) => void;
    deleteNote: (pageId: string) => void;
}

export const useReaderStore = create<ReaderState>()(
    persist(
        (set) => ({
            currentBook: 'quran',
            currentPage: 1, // This will be dynamic based on currentBook
            quranPage: 1,
            thoughtsPage: 1,
            bookmarks: [],
            notes: {},

            setBook: (book) => set((state) => ({
                currentBook: book,
                // When switching books, restore the page for that book
                currentPage: book === 'quran' ? state.quranPage : state.thoughtsPage
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

            toggleBookmark: (pageId) => set((state) => {
                const isBookmarked = state.bookmarks.includes(pageId);
                return {
                    bookmarks: isBookmarked
                        ? state.bookmarks.filter((id) => id !== pageId)
                        : [...state.bookmarks, pageId],
                };
            }),

            saveNote: (pageId, content) => set((state) => ({
                notes: {
                    ...state.notes,
                    [pageId]: { pageId, content, createdAt: Date.now() },
                },
            })),

            deleteNote: (pageId) => set((state) => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { [pageId]: _, ...remainingNotes } = state.notes;
                return { notes: remainingNotes };
            }),
        }),
        {
            name: 'heritage-reader-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
