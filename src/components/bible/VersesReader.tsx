
import React from 'react';
import { useBibleReaderContext } from './providers/BibleReaderProvider';
import { useChapterText } from '../../hooks/useComprehensiveBibleData';
import { VersesReaderHeader } from './components/VersesReaderHeader';
import { VersesContent } from './components/VersesContent';
import { VersesLoadingState } from './components/VersesLoadingState';
import { VersesErrorState } from './components/VersesErrorState';
import { VersesNavigationFooter } from './components/VersesNavigationFooter';

const VersesReader: React.FC = () => {
  // Get all necessary state and functions directly from context
  const {
    currentVersion,
    currentBook,
    currentChapter,
    readingSettings,
    goToPreviousChapter,
    goToNextChapter,
    canGoPrevious,
    canGoNext,
    versions,
    setCurrentVersion,
    setCurrentBook,
    setCurrentChapter,
    setViewMode
  } = useBibleReaderContext();

  // If no chapter is selected, show selection prompt
  if (!currentBook || !currentChapter) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-slate-600 dark:text-slate-300 text-2xl">📖</span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {!currentBook ? 'Select a Book' : 'Select a Chapter'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {!currentBook 
              ? 'Choose a book from the Bible to start reading.' 
              : 'Choose a chapter to continue reading.'
            }
          </p>
          <button
            onClick={() => setViewMode(!currentBook ? 'books' : 'chapters')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            {!currentBook ? 'Browse Books' : 'Browse Chapters'}
          </button>
        </div>
      </div>
    );
  }

  const { chapterData, loading, error } = useChapterText(currentBook.bibleId, currentChapter.id);

  if (loading) {
    return <VersesLoadingState />;
  }

  if (error) {
    return <VersesErrorState error={error} />;
  }

  const handleVersionChange = (version: any) => {
    setCurrentVersion(version);
    setCurrentBook(null);
    setCurrentChapter(null);
    setViewMode('books');
  };

  const handleBookSelect = () => {
    setViewMode('books');
  };

  const handleChapterSelect = () => {
    setViewMode('chapters');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <VersesReaderHeader 
        book={currentBook} 
        chapter={currentChapter} 
        chapterData={chapterData}
        onBack={() => setViewMode('books')}
        selectedVersion={currentVersion}
        availableVersions={versions}
        onVersionChange={handleVersionChange}
        onBookSelect={handleBookSelect}
        onChapterSelect={handleChapterSelect}
      />
      
      <div className="flex-1 pb-20">
        <VersesContent 
          chapterData={chapterData} 
          readingSettings={readingSettings} 
        />
      </div>

      <VersesNavigationFooter
        book={currentBook}
        chapter={currentChapter}
        onPreviousChapter={goToPreviousChapter}
        onNextChapter={goToNextChapter}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onBookSelect={handleBookSelect}
        onChapterSelect={handleChapterSelect}
      />
    </div>
  );
};

export default VersesReader;
