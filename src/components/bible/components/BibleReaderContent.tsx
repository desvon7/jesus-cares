
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BibleVersion, Book as BookType, Chapter } from '../../../services/comprehensiveBibleService';
import { useBibleReaderContext } from '../providers/BibleReaderProvider';
import { themeClasses } from '../types/readingSettings';
import BooksGrid from '../BooksGrid';
import ChaptersGrid from '../ChaptersGrid';
import VersesReader from '../VersesReader';
import BibleToolbar from '../BibleToolbar';
import MobileBibleNavigation from '../MobileBibleNavigation';
import ReadingSettingsPanel from '../ReadingSettingsPanel';

interface BibleReaderContentProps {
  selectedVersion: BibleVersion;
}

export const BibleReaderContent: React.FC<BibleReaderContentProps> = ({ selectedVersion }) => {
  const isMobile = useIsMobile();
  const {
    viewMode,
    setViewMode,
    showSettings,
    setShowSettings,
    readingSettings,
    setReadingSettings,
    currentVersion,
    currentBook,
    currentChapter,
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
    chaptersError,
    setCurrentVersion
  } = useBibleReaderContext();

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
        <div className={`max-w-4xl mx-auto ${isMobile ? 'pb-24' : ''}`}>
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
              onPreviousChapter={goToPreviousChapter}
              onNextChapter={goToNextChapter}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              selectedVersion={currentVersion || selectedVersion}
              availableVersions={versions}
              onVersionChange={handleVersionChange}
              onBookSelect={() => {
                setCurrentBook(null);
                setCurrentChapter(null);
                setViewMode('books');
              }}
              onChapterSelect={() => {
                setCurrentChapter(null);
                setViewMode('chapters');
              }}
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
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
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
