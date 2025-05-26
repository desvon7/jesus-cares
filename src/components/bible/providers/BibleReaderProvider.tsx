
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BibleVersion, Book as BookType, Chapter } from '../../../services/comprehensiveBibleService';
import { ReadingSettings, defaultReadingSettings } from '../types/readingSettings';
import { useBibleNavigation } from '../../../hooks/useBibleNavigation';
import { useBooks, useChapters, useBibleVersions, useChapterText } from '../../../hooks/useComprehensiveBibleData';

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
  chapterData: any;
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
  chapterLoading: boolean;
  chapterError: string | null;
}

const BibleReaderContext = createContext<BibleReaderContextType | null>(null);

export const useBibleReaderContext = () => {
  const context = useContext(BibleReaderContext);
  if (!context) {
    console.error('useBibleReaderContext called outside of BibleReaderProvider');
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
  console.log('BibleReaderProvider rendering with selectedVersion:', selectedVersion);
  
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

  // Fetch chapter text when current chapter changes
  const { chapterData, loading: chapterLoading, error: chapterError } = useChapterText(
    currentVersion?.id || selectedVersion.id,
    currentChapter?.id || null
  );

  // Initialize current version
  useEffect(() => {
    console.log('Initializing version:', selectedVersion);
    if (!currentVersion && selectedVersion) {
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
        console.log('Auto-opening Genesis:', genesis);
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
        console.log('Auto-opening Chapter 1:', firstChapter);
        setCurrentChapter(firstChapter);
      }
    }
  }, [chapters, currentBook, currentChapter, autoOpenGenesis, setCurrentChapter]);

  // Enhanced navigation functions that work with the allChapters array
  const enhancedGoToPreviousChapter = () => {
    if (!currentChapter || !allChapters.length) return;
    
    const currentIndex = allChapters.findIndex(ch => ch.id === currentChapter.id);
    if (currentIndex > 0) {
      const previousChapter = allChapters[currentIndex - 1];
      console.log('Navigating to previous chapter:', previousChapter);
      setCurrentChapter(previousChapter);
    }
  };

  const enhancedGoToNextChapter = () => {
    if (!currentChapter || !allChapters.length) return;
    
    const currentIndex = allChapters.findIndex(ch => ch.id === currentChapter.id);
    if (currentIndex >= 0 && currentIndex < allChapters.length - 1) {
      const nextChapter = allChapters[currentIndex + 1];
      console.log('Navigating to next chapter:', nextChapter);
      setCurrentChapter(nextChapter);
    }
  };

  const value: BibleReaderContextType = {
    viewMode,
    setViewMode,
    showSettings,
    setShowSettings,
    readingSettings,
    setReadingSettings,
    currentVersion: currentVersion || selectedVersion,
    currentBook,
    currentChapter,
    chapterData,
    allChapters,
    setCurrentVersion,
    setCurrentBook,
    setCurrentChapter,
    goToPreviousChapter: enhancedGoToPreviousChapter,
    goToNextChapter: enhancedGoToNextChapter,
    canGoPrevious,
    canGoNext,
    versions,
    books,
    chapters,
    booksLoading,
    booksError,
    chaptersLoading,
    chaptersError,
    chapterLoading,
    chapterError
  };

  console.log('BibleReaderProvider providing context value:', {
    currentVersion: value.currentVersion?.id,
    currentBook: value.currentBook?.name,
    currentChapter: value.currentChapter?.number,
    viewMode: value.viewMode,
    booksCount: value.books.length,
    chaptersCount: value.chapters.length,
    allChaptersCount: value.allChapters.length,
    hasChapterData: !!value.chapterData?.content
  });

  return (
    <BibleReaderContext.Provider value={value}>
      {children}
    </BibleReaderContext.Provider>
  );
};
