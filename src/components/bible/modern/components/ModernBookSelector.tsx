
import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Book } from '../../../../services/comprehensiveBibleService';

interface ModernBookSelectorProps {
  books: Book[];
  selectedBook: Book | null;
  onSelect: (book: Book) => void;
  onClose: () => void;
}

export const ModernBookSelector: React.FC<ModernBookSelectorProps> = ({
  books,
  selectedBook,
  onSelect,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = books.filter(book =>
    book.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const oldTestament = filteredBooks.slice(0, 39);
  const newTestament = filteredBooks.slice(39);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md h-3/4 rounded-t-3xl overflow-hidden">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Books</h2>
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

        {/* Search */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-0 rounded-xl"
            />
          </div>
        </div>

        {/* Books List */}
        <div className="flex-1 overflow-y-auto">
          {oldTestament.length > 0 && (
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">Old Testament</h3>
              <div className="space-y-1">
                {oldTestament.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => onSelect(book)}
                    className={`w-full px-4 py-3 text-left rounded-xl transition-colors ${
                      selectedBook?.id === book.id
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    {book.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {newTestament.length > 0 && (
            <div className="px-6 py-4">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">New Testament</h3>
              <div className="space-y-1">
                {newTestament.map((book) => (
                  <button
                    key={book.id}
                    onClick={() => onSelect(book)}
                    className={`w-full px-4 py-3 text-left rounded-xl transition-colors ${
                      selectedBook?.id === book.id
                        ? 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-900 dark:text-white'
                    }`}
                  >
                    {book.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
