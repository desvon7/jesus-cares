
import React from 'react';
import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Chapter } from '../../services/comprehensiveBibleService';

interface ChaptersGridProps {
  book: Book;
  chapters: Chapter[];
  loading: boolean;
  error: string | null;
  onChapterSelect: (chapter: Chapter) => void;
  onBack: () => void;
}

const ChaptersGrid: React.FC<ChaptersGridProps> = ({ 
  book, 
  chapters, 
  loading, 
  error, 
  onChapterSelect 
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading chapters...</p>
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <BookOpen className="h-6 w-6 mr-2" />
          {book.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {chapters.map((chapter) => (
            <Card 
              key={chapter.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-105 border-slate-200 dark:border-slate-700"
              onClick={() => onChapterSelect(chapter)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {chapter.number}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChaptersGrid;
