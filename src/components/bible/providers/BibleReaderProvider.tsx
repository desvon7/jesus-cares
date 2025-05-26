
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BibleVersion, Book as BookType, Chapter } from '../../../services/comprehensiveBibleService';
import { ReadingSettings, defaultReadingSettings } from '../types/readingSettings';
import { useBibleNavigation } from '../../../hooks/useBibleNavigation';
import { useBooks, useChapters, useBibleVersions } from '../../../hooks/useComprehensiveBibleData';

type ViewMode = 'books' | 'chapters' | 'verses';

interface BibleReaderContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  readingSettings: ReadingSettings;
  setReadingSettings: (settings: ReadingSettings) => void;
  currentVersion: BibleVersion | null;
  currentBook: BookType | null;
  currentChapter: Chapter | null;
  allChapters: Chapter[];
  setCurrentVersion: (version: BibleVersion) => void;
  setCurrentBook: (book: BookType | null) => void;
  setCurrentChapter: (chapter: Chapter | null) => void;
  goToPreviousChapter: () => void;
  goToNextChapter: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  versions: BibleVersion[];
  books: BookType[];
  chapters: Chapter[];
  booksLoading: boolean;
  booksError: string | null;
  chaptersLoading: boolean;
  chaptersError: string | null;
}

const BibleReaderContext = createContext<BibleReaderContextType | undefined>(undefined);

export const useBibleReaderContext = () => {
  const context = useContext(BibleReaderContext);
  if (!context) {
    throw new Error('useBibleReaderContext must be used within a BibleReaderProvider');
  }
  return context;
};

interface BibleReaderProviderProps {
  children: React.ReactNode;
  selectedVersion: BibleVersion;
  autoOpenGenesis?: boolean;
}

export const BibleReaderProvider: React.FC<BibleReaderProviderProps> = ({
  children,
  selectedVersion,
  autoOpenGenesis = false
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('books');
  const [showSettings, setShowSettings] = useState(false);
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>(defaultReadingSettings);

  const {
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
  } = useBibleNavigation();

  const { versions } = useBibleVersions();
  const { books, loading: booksLoading, error: booksError } = useBooks(currentVersion?.id || selectedVersion.id);
  const { chapters, loading: chaptersLoading, error: chaptersError } = useChapters(
    currentVersion?.id || selectedVersion.id, 
    currentBook?.id || null
  );

  // Initialize current version
  useEffect(() => {
    if (!currentVersion) {
      setCurrentVersion(selectedVersion);
    }
  }, [selectedVersion, currentVersion, setCurrentVersion]);

  // Update all chapters when chapters change
  useEffect(() => {
    setAllChapters(chapters);
  }, [chapters, setAllChapters]);

  // Auto-open Genesis when books are loaded
  useEffect(() => {
    if (autoOpenGenesis && books.length > 0 && !currentBook) {
      const genesis = books.find(book => 
        book.id.includes('GEN') || 
        book.name.toLowerCase().includes('genesis') ||
        book.abbreviation.toLowerCase() === 'gen'
      );
      if (genesis) {
        setCurrentBook(genesis);
        setViewMode('verses');
      }
    }
  }, [books, autoOpenGenesis, currentBook, setCurrentBook]);

  // Auto-select chapter 1 when Genesis is selected
  useEffect(() => {
    if (currentBook && chapters.length > 0 && !currentChapter && autoOpenGenesis) {
      const firstChapter = chapters.find(chapter => chapter.number === '1');
      if (firstChapter) {
        setCurrentChapter(firstChapter);
      }
    }
  }, [chapters, currentBook, currentChapter, autoOpenGenesis, setCurrentChapter]);

  const value = {
    viewMode,
    setViewMode,
    showSettings,
    setShowSettings,
    readingSettings,
    setReadingSettings,
    currentVersion,
    currentBook,
    currentChapter,
    allChapters,
    setCurrentVersion,
    setCurrentBook,
    setCurrentChapter,
    goToPreviousChapter,
    goToNextChapter,
    canGoPrevious,
    canGoNext,
    versions,
    books,
    chapters,
    booksLoading,
    booksError,
    chaptersLoading,
    chaptersError
  };

  return (
    <BibleReaderContext.Provider value={value}>
      {children}
    </BibleReaderContext.Provider>
  );
};
