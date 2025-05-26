
import React from 'react';
import { Book, Chapter, BibleVersion } from '../../services/comprehensiveBibleService';
import { useChapterText } from '../../hooks/useComprehensiveBibleData';
import { ReadingSettings } from './types/readingSettings';
import { VersesReaderHeader } from './components/VersesReaderHeader';
import { VersesContent } from './components/VersesContent';
import { VersesLoadingState } from './components/VersesLoadingState';
import { VersesErrorState } from './components/VersesErrorState';
import { VersesNavigationFooter } from './components/VersesNavigationFooter';

interface VersesReaderProps {
  book: Book;
  chapter: Chapter;
  onBack: () => void;
  readingSettings: ReadingSettings;
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  selectedVersion: BibleVersion;
  availableVersions: BibleVersion[];
  onVersionChange: (version: BibleVersion) => void;
  onBookSelect: () => void;
  onChapterSelect: () => void;
}

const VersesReader: React.FC<VersesReaderProps> = ({ 
  book, 
  chapter, 
  onBack,
  readingSettings,
  onPreviousChapter,
  onNextChapter,
  canGoPrevious = false,
  canGoNext = false,
  selectedVersion,
  availableVersions,
  onVersionChange,
  onBookSelect,
  onChapterSelect
}) => {
  const { chapterData, loading, error } = useChapterText(book.bibleId, chapter.id);

  if (loading) {
    return <VersesLoadingState />;
  }

  if (error) {
    return <VersesErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <VersesReaderHeader 
        book={book} 
        chapter={chapter} 
        chapterData={chapterData}
        onBack={onBack}
        selectedVersion={selectedVersion}
        availableVersions={availableVersions}
        onVersionChange={onVersionChange}
        onBookSelect={onBookSelect}
        onChapterSelect={onChapterSelect}
      />
      
      <div className="flex-1 pb-20">
        <VersesContent 
          chapterData={chapterData} 
          readingSettings={readingSettings} 
        />
      </div>

      <VersesNavigationFooter
        book={book}
        chapter={chapter}
        onPreviousChapter={onPreviousChapter}
        onNextChapter={onNextChapter}
        canGoPrevious={canGoPrevious}
        canGoNext={canGoNext}
        onBookSelect={onBookSelect}
        onChapterSelect={onChapterSelect}
      />
    </div>
  );
};

export default VersesReader;
