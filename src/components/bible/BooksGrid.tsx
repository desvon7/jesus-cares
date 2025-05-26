
import React from 'react';
import { Book } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Book as BookType } from '../../services/comprehensiveBibleService';

interface BooksGridProps {
  books: BookType[];
  loading: boolean;
  error: string | null;
  onBookSelect: (book: BookType) => void;
}

const BooksGrid: React.FC<BooksGridProps> = ({ books, loading, error, onBookSelect }) => {
  const oldTestamentBooks = books.filter(book => 
    book.id.includes('GEN') || book.id.includes('EXO') || book.id.includes('LEV') ||
    book.id.includes('NUM') || book.id.includes('DEU') || book.id.includes('JOS') ||
    book.id.includes('JDG') || book.id.includes('RUT') || book.id.includes('1SA') ||
    book.id.includes('2SA') || book.id.includes('1KI') || book.id.includes('2KI') ||
    book.id.includes('1CH') || book.id.includes('2CH') || book.id.includes('EZR') ||
    book.id.includes('NEH') || book.id.includes('EST') || book.id.includes('JOB') ||
    book.id.includes('PSA') || book.id.includes('PRO') || book.id.includes('ECC') ||
    book.id.includes('SNG') || book.id.includes('ISA') || book.id.includes('JER') ||
    book.id.includes('LAM') || book.id.includes('EZK') || book.id.includes('DAN') ||
    book.id.includes('HOS') || book.id.includes('JOL') || book.id.includes('AMO') ||
    book.id.includes('OBA') || book.id.includes('JON') || book.id.includes('MIC') ||
    book.id.includes('NAM') || book.id.includes('HAB') || book.id.includes('ZEP') ||
    book.id.includes('HAG') || book.id.includes('ZEC') || book.id.includes('MAL')
  );

  const newTestamentBooks = books.filter(book => !oldTestamentBooks.includes(book));

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  const BookSection = ({ title, books }: { title: string; books: BookType[] }) => (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
        <Book className="h-5 w-5 mr-2" />
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {books.map((book) => (
          <Card 
            key={book.id}
            className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 border-slate-200 dark:border-slate-700"
            onClick={() => onBookSelect(book)}
          >
            <CardContent className="p-4 text-center">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                {book.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {book.abbreviation}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-slate-100">
        Choose a Book
      </h1>
      
      {oldTestamentBooks.length > 0 && (
        <BookSection title="Old Testament" books={oldTestamentBooks} />
      )}
      
      {newTestamentBooks.length > 0 && (
        <BookSection title="New Testament" books={newTestamentBooks} />
      )}
    </div>
  );
};

export default BooksGrid;
