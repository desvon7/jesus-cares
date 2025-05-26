
import React from 'react';
import { Book, Chapter } from '../../services/comprehensiveBibleService';
import { useChapterText } from '../../hooks/useComprehensiveBibleData';
import { ReadingSettings } from './types/readingSettings';
import { VersesReaderHeader } from './components/VersesReaderHeader';
import { VersesContent } from './components/VersesContent';
import { VersesLoadingState } from './components/VersesLoadingState';
import { VersesErrorState } from './components/VersesErrorState';

interface VersesReaderProps {
  book: Book;
  chapter: Chapter;
  onBack: () => void;
  readingSettings: ReadingSettings;
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

const VersesReader: React.FC<VersesReaderProps> = ({ 
  book, 
  chapter, 
  onBack,
  readingSettings
}) => {
  const { chapterData, loading, error } = useChapterText(book.bibleId, chapter.id);

  if (loading) {
    return <VersesLoadingState />;
  }

  if (error) {
    return <VersesErrorState error={error} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <VersesReaderHeader 
        book={book} 
        chapter={chapter} 
        chapterData={chapterData} 
      />
      <VersesContent 
        chapterData={chapterData} 
        readingSettings={readingSettings} 
      />
    </div>
  );
};

export default VersesReader;
