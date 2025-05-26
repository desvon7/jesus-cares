
import React from 'react';
import { Book } from '../../../../services/comprehensiveBibleService';

interface ModernBooksGridProps {
  books: Book[];
  loading: boolean;
  error: string | null;
  onBookSelect: (book: Book) => void;
}

export const ModernBooksGrid: React.FC<ModernBooksGridProps> = ({
  books,
  loading,
  error,
  onBookSelect
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading books...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Error loading books</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Group books by testament
  const oldTestament = books.slice(0, 39);
  const newTestament = books.slice(39);

  return (
    <div className="h-full overflow-y-auto px-6 py-6">
      {/* Old Testament */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Old Testament</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {oldTestament.map((book) => (
            <button
              key={book.id}
              onClick={() => onBookSelect(book)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                {book.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* New Testament */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">New Testament</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {newTestament.map((book) => (
            <button
              key={book.id}
              onClick={() => onBookSelect(book)}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-200 text-left"
            >
              <div className="font-medium text-gray-900 dark:text-white text-sm leading-tight">
                {book.name}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
