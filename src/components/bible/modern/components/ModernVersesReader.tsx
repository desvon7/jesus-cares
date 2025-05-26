
import React from 'react';
import { useChapterText } from '../../../../hooks/useComprehensiveBibleData';
import { useBibleReaderContext } from '../../providers/BibleReaderProvider';

export const ModernVersesReader: React.FC = () => {
  const { 
    currentBook, 
    currentChapter, 
    readingSettings, 
    setViewMode 
  } = useBibleReaderContext();

  // If no chapter is selected, show selection interface
  if (!currentBook || !currentChapter) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <span className="text-gray-600 dark:text-gray-300 text-3xl">📖</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {!currentBook ? 'Select a Book' : 'Select a Chapter'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
            {!currentBook 
              ? 'Choose a book from the Bible to start reading.' 
              : 'Choose a chapter to continue reading.'
            }
          </p>
          <button
            onClick={() => setViewMode(!currentBook ? 'books' : 'chapters')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors text-lg"
          >
            {!currentBook ? 'Browse Books' : 'Browse Chapters'}
          </button>
        </div>
      </div>
    );
  }

  const { chapterData, loading, error } = useChapterText(currentBook.bibleId, currentChapter.id);

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
          <p className="text-red-600 dark:text-red-400 font-medium mb-2">Failed to load scripture</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Try selecting a different version like KJV, NIV, or ESV</p>
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
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <span className="text-gray-600 dark:text-gray-300 text-3xl">📖</span>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Scripture content not available</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">This version may not have data in the local files.</p>
            <p className="text-gray-500 dark:text-gray-400">Try versions like KJV, NIV, ESV, NASB, NKJV, or NLT which should have content available.</p>
          </div>
        )}
      </div>
    </div>
  );
};
