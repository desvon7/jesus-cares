
import React from 'react';
import { Book, Chapter } from '../../../../services/comprehensiveBibleService';

interface ModernChaptersGridProps {
  book: Book;
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
  onChapterSelect: (chapter: Chapter) => void;
}

export const ModernChaptersGrid: React.FC<ModernChaptersGridProps> = ({
  book,
  chapters,
  loading,
  error,
  onChapterSelect
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading chapters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Error loading chapters</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{book.name}</h2>
      
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            onClick={() => onChapterSelect(chapter)}
            className="aspect-square bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 flex items-center justify-center"
          >
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {chapter.number}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
