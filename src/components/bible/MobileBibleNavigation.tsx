
import React from 'react';
import { ChevronLeft, ChevronRight, Home, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 p-4 safe-area-inset-bottom">
      {/* Top row - Navigation breadcrumbs */}
      <div className="flex items-center justify-center mb-4 space-x-2 text-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onVersionSelect}
          className="text-blue-600 dark:text-blue-400 font-medium px-2 py-1 h-auto"
        >
          {selectedVersion.abbreviation}
        </Button>
        {selectedBook && (
          <>
            <span className="text-slate-400 text-xs">›</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBookSelect}
              className="text-blue-600 dark:text-blue-400 font-medium px-2 py-1 h-auto"
            >
              {selectedBook.name}
            </Button>
          </>
        )}
        {selectedChapter && (
          <>
            <span className="text-slate-400 text-xs">›</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onChapterSelect}
              className="text-blue-600 dark:text-blue-400 font-medium px-2 py-1 h-auto"
            >
              Ch. {selectedChapter.number}
            </Button>
          </>
        )}
      </div>

      {/* Bottom row - Navigation controls */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onPreviousChapter}
          disabled={!canGoPrevious}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 disabled:text-slate-400 disabled:cursor-not-allowed px-3 py-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="font-medium">Previous</span>
        </Button>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHomeClick}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
          >
            <Home className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookSelect}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onNextChapter}
          disabled={!canGoNext}
          className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 disabled:text-slate-400 disabled:cursor-not-allowed px-3 py-2 rounded-full bg-slate-100/50 dark:bg-slate-800/50 disabled:bg-slate-50 dark:disabled:bg-slate-900"
        >
          <span className="font-medium">Next</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MobileBibleNavigation;
