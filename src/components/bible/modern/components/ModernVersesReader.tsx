
import React from 'react';
import { Book, Chapter } from '../../../../services/comprehensiveBibleService';
import { useChapterText } from '../../../../hooks/useComprehensiveBibleData';
import { useBibleReaderContext } from '../../providers/BibleReaderProvider';

interface ModernVersesReaderProps {
  book: Book;
  chapter: Chapter;
}

export const ModernVersesReader: React.FC<ModernVersesReaderProps> = ({
  book,
  chapter
}) => {
  const { chapterData, loading, error } = useChapterText(book.bibleId, chapter.id);
  const { readingSettings } = useBibleReaderContext();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading scripture...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 dark:text-red-400 text-xl">!</span>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Scripture not available</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Try selecting a different version like KJV, NIV, or ESV</p>
        </div>
      </div>
    );
  }

  const getFontFamilyClass = () => {
    switch (readingSettings.fontFamily) {
      case 'serif': return 'font-serif';
      case 'sans-serif': return 'font-sans';
      case 'dyslexic': return 'font-mono';
      default: return 'font-serif';
    }
  };

  const getContentStyle = () => ({
    fontSize: `${readingSettings.fontSize}px`,
    lineHeight: readingSettings.lineSpacing,
  });

  const processContent = (content: string) => {
    if (!readingSettings.showVerseNumbers) {
      content = content.replace(/<sup[^>]*>\d+<\/sup>/g, '');
    }
    
    if (!readingSettings.showChapterNumbers) {
      content = content.replace(/<h3[^>]*>.*?<\/h3>/g, '');
    }
    
    return content;
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {chapterData?.content ? (
          <div 
            className={`
              prose prose-slate dark:prose-invert max-w-none 
              ${getFontFamilyClass()} 
              prose-lg sm:prose-xl
              prose-p:leading-relaxed prose-p:mb-6
              prose-h3:text-3xl prose-h3:font-bold prose-h3:mb-8 prose-h3:text-gray-900 dark:prose-h3:text-white prose-h3:tracking-tight
              prose-sup:text-blue-500 prose-sup:font-semibold prose-sup:text-sm prose-sup:ml-1
              prose-strong:text-gray-900 dark:prose-strong:text-white
            `}
            style={getContentStyle()}
            dangerouslySetInnerHTML={{ 
              __html: processContent(chapterData.content) 
            }}
          />
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-2xl">📖</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No content available</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">This chapter content could not be loaded.</p>
            <p className="text-sm text-gray-400">Try switching to a different Bible version like KJV, NIV, or ESV.</p>
          </div>
        )}
      </div>
    </div>
  );
};
