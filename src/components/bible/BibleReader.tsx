
import React, { useState, useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useBooks, useChapters, useBibleVersions } from '../../hooks/useComprehensiveBibleData';
import { BibleVersion, Book as BookType, Chapter } from '../../services/comprehensiveBibleService';
import { useBibleNavigation } from '../../hooks/useBibleNavigation';
import BooksGrid from './BooksGrid';
import ChaptersGrid from './ChaptersGrid';
import VersesReader from './VersesReader';
import BibleToolbar from './BibleToolbar';
import MobileBibleNavigation from './MobileBibleNavigation';
import ReadingSettingsPanel from './ReadingSettingsPanel';

interface BibleReaderProps {
  selectedVersion: BibleVersion;
  onBack: () => void;
  autoOpenGenesis?: boolean;
}

type ViewMode = 'books' | 'chapters' | 'verses';

interface ReadingSettings {
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif' | 'dyslexic';
  theme: 'light' | 'dark' | 'sepia';
  lineSpacing: number;
  showVerseNumbers: boolean;
  showChapterNumbers: boolean;
  paragraphMode: boolean;
}

const BibleReader: React.FC<BibleReaderProps> = ({ selectedVersion, onBack, autoOpenGenesis = false }) => {
  const isMobile = useIsMobile();
  const [viewMode, setViewMode] = useState<ViewMode>('books');
  const [showSettings, setShowSettings] = useState(false);
  const [readingSettings, setReadingSettings] = useState<ReadingSettings>({
    fontSize: 16,
    fontFamily: 'serif',
    theme: 'light',
    lineSpacing: 1.5,
    showVerseNumbers: true,
    showChapterNumbers: true,
    paragraphMode: false
  });

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

  const handleBookSelect = (book: BookType) => {
    setCurrentBook(book);
    setCurrentChapter(null);
    setViewMode('chapters');
  };

  const handleChapterSelect = (chapter: Chapter) => {
    setCurrentChapter(chapter);
    setViewMode('verses');
  };

  const handleBackToBooks = () => {
    setCurrentBook(null);
    setCurrentChapter(null);
    setViewMode('books');
  };

  const handleBackToChapters = () => {
    setCurrentChapter(null);
    setViewMode('chapters');
  };

  const handleVersionChange = (version: BibleVersion) => {
    setCurrentVersion(version);
    // Reset navigation when version changes
    setCurrentBook(null);
    setCurrentChapter(null);
    setViewMode('books');
  };

  const themeClasses = {
    light: 'bg-white text-slate-900',
    dark: 'bg-slate-900 text-slate-100',
    sepia: 'bg-yellow-50 text-amber-900'
  };

  const containerClass = `min-h-screen ${themeClasses[readingSettings.theme]}`;

  return (
    <div className={containerClass}>
      {/* Desktop Toolbar */}
      {!isMobile && (
        <BibleToolbar
          selectedVersion={currentVersion || selectedVersion}
          selectedBook={currentBook}
          selectedChapter={currentChapter}
          onVersionChange={handleVersionChange}
          onBookSelect={handleBookSelect}
          onChapterSelect={handleChapterSelect}
          onSettingsOpen={() => setShowSettings(true)}
          availableVersions={versions}
          availableBooks={books}
          availableChapters={chapters}
        />
      )}

      <div className="relative">
        <div className={`max-w-4xl mx-auto p-4 ${isMobile ? 'pb-24' : ''}`}>
          {viewMode === 'books' && (
            <BooksGrid 
              books={books}
              loading={booksLoading}
              error={booksError}
              onBookSelect={handleBookSelect}
            />
          )}

          {viewMode === 'chapters' && currentBook && (
            <ChaptersGrid
              book={currentBook}
              chapters={chapters}
              loading={chaptersLoading}
              error={chaptersError}
              onChapterSelect={handleChapterSelect}
              onBack={handleBackToBooks}
            />
          )}

          {viewMode === 'verses' && currentBook && currentChapter && (
            <VersesReader
              book={currentBook}
              chapter={currentChapter}
              onBack={handleBackToChapters}
              readingSettings={readingSettings}
            />
          )}
        </div>

        {/* Mobile Navigation */}
        {isMobile && (
          <MobileBibleNavigation
            selectedVersion={currentVersion || selectedVersion}
            selectedBook={currentBook}
            selectedChapter={currentChapter}
            onVersionSelect={handleBackToBooks}
            onBookSelect={handleBackToChapters}
            onChapterSelect={() => setViewMode('chapters')}
            onPreviousChapter={goToPreviousChapter}
            onNextChapter={goToNextChapter}
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
          />
        )}

        {/* Settings Panel Overlay */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <ReadingSettingsPanel
              settings={readingSettings}
              onSettingsChange={setReadingSettings}
              onClose={() => setShowSettings(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default BibleReader;
