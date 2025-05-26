
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBibleReaderContext } from '../../providers/BibleReaderProvider';
import { ModernBooksGrid } from './ModernBooksGrid';
import { ModernChaptersGrid } from './ModernChaptersGrid';
import { ModernVersesReader } from './ModernVersesReader';

export const ModernReaderView: React.FC = () => {
  const isMobile = useIsMobile();
  const {
    viewMode,
    currentBook,
    currentChapter,
    books,
    chapters,
    booksLoading,
    booksError,
    chaptersLoading,
    chaptersError,
    setCurrentBook,
    setCurrentChapter,
    setViewMode
  } = useBibleReaderContext();

  const handleBookSelect = (book: any) => {
    setCurrentBook(book);
    setCurrentChapter(null);
    setViewMode('chapters');
  };

  const handleChapterSelect = (chapter: any) => {
    setCurrentChapter(chapter);
    setViewMode('verses');
  };

  if (viewMode === 'books') {
    return (
      <ModernBooksGrid
        books={books}
        loading={booksLoading}
        error={booksError}
        onBookSelect={handleBookSelect}
      />
    );
  }

  if (viewMode === 'chapters' && currentBook) {
    return (
      <ModernChaptersGrid
        book={currentBook}
        chapters={chapters}
        loading={chaptersLoading}
        error={chaptersError}
        onChapterSelect={handleChapterSelect}
      />
    );
  }

  if (viewMode === 'verses' && currentBook && currentChapter) {
    return (
      <ModernVersesReader
        book={currentBook}
        chapter={currentChapter}
      />
    );
  }

  return null;
};
