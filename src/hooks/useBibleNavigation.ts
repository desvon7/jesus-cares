
import { useState, useCallback } from 'react';
import { BibleVersion, Book, Chapter } from '../services/comprehensiveBibleService';

interface UseBibleNavigationReturn {
  currentVersion: BibleVersion | null;
  currentBook: Book | null;
  currentChapter: Chapter | null;
  allChapters: Chapter[];
  setCurrentVersion: (version: BibleVersion) => void;
  setCurrentBook: (book: Book) => void;
  setCurrentChapter: (chapter: Chapter) => void;
  setAllChapters: (chapters: Chapter[]) => void;
  goToPreviousChapter: () => void;
  goToNextChapter: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const useBibleNavigation = (): UseBibleNavigationReturn => {
  const [currentVersion, setCurrentVersion] = useState<BibleVersion | null>(null);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [allChapters, setAllChapters] = useState<Chapter[]>([]);

  const currentChapterIndex = currentChapter 
    ? allChapters.findIndex(ch => ch.id === currentChapter.id)
    : -1;

  const canGoPrevious = currentChapterIndex > 0;
  const canGoNext = currentChapterIndex >= 0 && currentChapterIndex < allChapters.length - 1;

  const goToPreviousChapter = useCallback(() => {
    if (canGoPrevious) {
      setCurrentChapter(allChapters[currentChapterIndex - 1]);
    }
  }, [canGoPrevious, allChapters, currentChapterIndex]);

  const goToNextChapter = useCallback(() => {
    if (canGoNext) {
      setCurrentChapter(allChapters[currentChapterIndex + 1]);
    }
  }, [canGoNext, allChapters, currentChapterIndex]);

  return {
    currentVersion,
    currentBook,
    currentChapter,
    allChapters,
    setCurrentVersion,
    setCurrentBook,
    setCurrentChapter,
    setAllChapters,
    goToPreviousChapter,
    goToNextChapter,
    canGoPrevious,
    canGoNext
  };
};
