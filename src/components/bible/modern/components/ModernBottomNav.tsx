
import React from 'react';
import { BookOpen, List, Languages, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useBibleReaderContext } from '../../providers/BibleReaderProvider';

interface ModernBottomNavProps {
  onVersionSelect: () => void;
  onBookSelect: () => void;
  onChapterSelect: () => void;
  onSettingsOpen: () => void;
}

export const ModernBottomNav: React.FC<ModernBottomNavProps> = ({
  onVersionSelect,
  onBookSelect,
  onChapterSelect,
  onSettingsOpen
}) => {
  const {
    currentBook,
    currentChapter,
    goToPreviousChapter,
    goToNextChapter,
    canGoPrevious,
    canGoNext,
    viewMode
  } = useBibleReaderContext();

  if (viewMode === 'verses' && currentBook && currentChapter) {
    return (
      <div className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900 px-4 py-3 safe-area-inset-bottom">
        <div className="flex items-center justify-between">
          {/* Previous Chapter */}
          <Button
            variant="ghost"
            size="sm"
            onClick={goToPreviousChapter}
            disabled={!canGoPrevious}
            className="flex items-center space-x-2 text-blue-500 disabled:text-gray-300 dark:disabled:text-gray-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full px-4 py-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Previous</span>
          </Button>

          {/* Center Controls */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onVersionSelect}
              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2"
            >
              <Languages className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onBookSelect}
              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onChapterSelect}
              className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2"
            >
              <List className="h-5 w-5" />
            </Button>
          </div>

          {/* Next Chapter */}
          <Button
            variant="ghost"
            size="sm"
            onClick={goToNextChapter}
            disabled={!canGoNext}
            className="flex items-center space-x-2 text-blue-500 disabled:text-gray-300 dark:disabled:text-gray-600 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full px-4 py-2"
          >
            <span className="text-sm font-medium">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900 px-4 py-3 safe-area-inset-bottom">
      <div className="flex items-center justify-center space-x-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={onVersionSelect}
          className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-3"
        >
          <Languages className="h-5 w-5" />
          <span className="text-xs">Version</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onBookSelect}
          className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-3"
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs">Books</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsOpen}
          className="flex flex-col items-center space-y-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl p-3"
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs">Settings</span>
        </Button>
      </div>
    </div>
  );
};
