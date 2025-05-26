
import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
  const navigate = useNavigate();
  const { chapterData, loading, error } = useChapterText(book.bibleId, chapter.id);
  const { readingSettings } = useBibleReaderContext();

  const handleHomeClick = () => {
    navigate('/');
  };

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

  // Log chapter data for debugging
  console.log('ModernVersesReader - Chapter Data:', {
    hasContent: !!chapterData?.content,
    contentType: typeof chapterData?.content,
    contentLength: chapterData?.content?.length || 0,
    contentPreview: chapterData?.content?.substring(0, 200) || 'No content'
  });

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
            {/* Home button */}
            <div className="mb-8">
              <Button
                variant="ghost"
                onClick={handleHomeClick}
                className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 rounded-full px-4 py-2 flex items-center space-x-2 mx-auto"
              >
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </div>

            {/* Error state content */}
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
