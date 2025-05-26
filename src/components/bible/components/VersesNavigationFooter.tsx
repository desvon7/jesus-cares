
import React from 'react';
import { ChevronLeft, ChevronRight, BookOpen, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Book, Chapter } from '../../../services/comprehensiveBibleService';

interface VersesNavigationFooterProps {
  book: Book;
  chapter: Chapter;
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
  onBookSelect: () => void;
  onChapterSelect: () => void;
}

export const VersesNavigationFooter: React.FC<VersesNavigationFooterProps> = ({
  book,
  chapter,
  onPreviousChapter,
  onNextChapter,
  canGoPrevious = false,
  canGoNext = false,
  onBookSelect,
  onChapterSelect
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 safe-area-inset-bottom">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between">
          {/* Previous Chapter Button */}
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            onClick={onPreviousChapter}
            disabled={!canGoPrevious}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:cursor-not-allowed hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full px-4 py-2 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="font-medium">Previous</span>
          </Button>

          {/* Center navigation */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBookSelect}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onChapterSelect}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          {/* Next Chapter Button */}
          <Button
            variant="ghost"
            size={isMobile ? "sm" : "default"}
            onClick={onNextChapter}
            disabled={!canGoNext}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 disabled:text-slate-300 dark:disabled:text-slate-600 disabled:cursor-not-allowed hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full px-4 py-2 transition-all duration-200"
          >
            <span className="font-medium">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
