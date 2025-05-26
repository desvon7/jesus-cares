
import React from 'react';
import { ChevronLeft, ChevronRight, Home, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BibleVersion, Book, Chapter } from '../../services/comprehensiveBibleService';

interface MobileBibleNavigationProps {
  selectedVersion: BibleVersion;
  selectedBook: Book | null;
  selectedChapter: Chapter | null;
  onVersionSelect: () => void;
  onBookSelect: () => void;
  onChapterSelect: () => void;
  onPreviousChapter: () => void;
  onNextChapter: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

const MobileBibleNavigation: React.FC<MobileBibleNavigationProps> = ({
  selectedVersion,
  selectedBook,
  selectedChapter,
  onVersionSelect,
  onBookSelect,
  onChapterSelect,
  onPreviousChapter,
  onNextChapter,
  canGoPrevious,
  canGoNext
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 md:hidden">
      {/* Top row - Navigation breadcrumbs */}
      <div className="flex items-center justify-center mb-3 space-x-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onVersionSelect}
          className="text-blue-600 dark:text-blue-400"
        >
          {selectedVersion.abbreviation}
        </Button>
        {selectedBook && (
          <>
            <span className="text-slate-400">›</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBookSelect}
              className="text-blue-600 dark:text-blue-400"
            >
              {selectedBook.name}
            </Button>
          </>
        )}
        {selectedChapter && (
          <>
            <span className="text-slate-400">›</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onChapterSelect}
              className="text-blue-600 dark:text-blue-400"
            >
              Ch. {selectedChapter.number}
            </Button>
          </>
        )}
      </div>

      {/* Bottom row - Navigation controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousChapter}
          disabled={!canGoPrevious}
          className="flex items-center space-x-1"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onVersionSelect}
            className="flex items-center space-x-1"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookSelect}
            className="flex items-center space-x-1"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onNextChapter}
          disabled={!canGoNext}
          className="flex items-center space-x-1"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MobileBibleNavigation;
