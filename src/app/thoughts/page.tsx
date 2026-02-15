'use client';

import { useEffect, useState } from 'react';
import { useReaderStore } from '@/store/useReaderStore';
import BookViewer from '@/components/ui/BookViewer';
import NavigationOverlay from '@/components/ui/NavigationOverlay';
import NotesModal from '@/components/ui/NotesModal';

export default function ThoughtsViewerPage() {
    const setBook = useReaderStore((state) => state.setBook);
    const [isNotesOpen, setIsNotesOpen] = useState(false);

    useEffect(() => {
        setBook('thoughts');
    }, [setBook]);

    return (
        <div className="relative h-screen w-full overflow-hidden">
            <NavigationOverlay onNotesClick={() => setIsNotesOpen(true)} />

            <BookViewer />

            <NotesModal
                isOpen={isNotesOpen}
                onClose={() => setIsNotesOpen(false)}
            />
        </div>
    );
}
