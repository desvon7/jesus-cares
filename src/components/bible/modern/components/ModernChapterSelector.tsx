
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Book, Chapter } from '../../../../services/comprehensiveBibleService';

interface ModernChapterSelectorProps {
  chapters: Chapter[];
  selectedChapter: Chapter | null;
  book: Book;
  onSelect: (chapter: Chapter) => void;
  onClose: () => void;
}

export const ModernChapterSelector: React.FC<ModernChapterSelectorProps> = ({
  chapters,
  selectedChapter,
  book,
  onSelect,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-3/4 rounded-t-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{book.name}</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full p-2"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-4 gap-3">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => onSelect(chapter)}
                className={`aspect-square rounded-xl flex items-center justify-center text-lg font-semibold transition-colors ${
                  selectedChapter?.id === chapter.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {chapter.number}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
