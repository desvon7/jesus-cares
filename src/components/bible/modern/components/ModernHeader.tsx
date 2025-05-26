
import React from 'react';
import { ArrowLeft, ChevronDown, Settings, Share, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BibleVersion, Book, Chapter } from '../../../../services/comprehensiveBibleService';

interface ModernHeaderProps {
  currentVersion: BibleVersion | null;
  currentBook: Book | null;
  currentChapter: Chapter | null;
  onBack: () => void;
  onVersionSelect: () => void;
  onBookSelect: () => void;
  onChapterSelect: () => void;
  onSettingsOpen: () => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  currentVersion,
  currentBook,
  currentChapter,
  onBack,
  onVersionSelect,
  onBookSelect,
  onChapterSelect,
  onSettingsOpen
}) => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div className="bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 px-4 py-3 safe-area-inset-top">
      <div className="flex items-center justify-between">
        {/* Left - Back button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full p-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Center - Navigation */}
        <div className="flex items-center space-x-1 flex-1 justify-center">
          {/* Version selector */}
          <Button
            variant="ghost"
            onClick={onVersionSelect}
            className="text-blue-500 font-semibold px-3 py-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950 flex items-center space-x-1"
          >
            <span>{currentVersion?.abbreviation || 'KJV'}</span>
            <ChevronDown className="h-4 w-4" />
          </Button>

          {/* Book selector */}
          {currentBook && (
            <>
              <span className="text-gray-400 mx-1">›</span>
              <Button
                variant="ghost"
                onClick={onBookSelect}
                className="text-gray-900 dark:text-gray-100 font-medium px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-1"
              >
                <span>{currentBook.name}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Chapter selector */}
          {currentChapter && (
            <>
              <span className="text-gray-400 mx-1">›</span>
              <Button
                variant="ghost"
                onClick={onChapterSelect}
                className="text-gray-900 dark:text-gray-100 font-medium px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center space-x-1"
              >
                <span>Ch. {currentChapter.number}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Right - Actions */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleHomeClick}
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2"
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2"
          >
            <Share className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsOpen}
            className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
