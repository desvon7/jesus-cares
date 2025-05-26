
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ReadingSettings } from '../types/readingSettings';

interface VersesContentProps {
  chapterData: any;
  readingSettings: ReadingSettings;
}

export const VersesContent: React.FC<VersesContentProps> = ({ 
  chapterData, 
  readingSettings 
}) => {
  const isMobile = useIsMobile();

  const getFontFamilyClass = () => {
    switch (readingSettings.fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'sans-serif':
        return 'font-sans';
      case 'dyslexic':
        return 'font-mono';
      default:
        return 'font-serif';
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
  console.log('VersesContent - Chapter Data:', {
    hasContent: !!chapterData?.content,
    contentType: typeof chapterData?.content,
    contentLength: chapterData?.content?.length || 0,
    contentPreview: chapterData?.content?.substring(0, 200) || 'No content'
  });

  return (
    <div className="max-w-4xl mx-auto">
      <div className={`${isMobile ? 'px-6 py-8' : 'px-8 py-12'}`}>
        {chapterData?.content ? (
          <div 
            className={`
              prose prose-slate dark:prose-invert max-w-none 
              ${getFontFamilyClass()} 
              ${isMobile ? 'prose-lg' : 'prose-xl'}
              prose-p:leading-relaxed prose-p:mb-6
              prose-h3:text-3xl prose-h3:font-bold prose-h3:mb-8 prose-h3:text-slate-900 dark:prose-h3:text-slate-100 prose-h3:tracking-tight
              prose-sup:text-blue-600 dark:prose-sup:text-blue-400 prose-sup:font-semibold prose-sup:text-base prose-sup:ml-1
              prose-strong:text-slate-900 dark:prose-strong:text-slate-100
            `}
            style={getContentStyle()}
            dangerouslySetInnerHTML={{ 
              __html: processContent(chapterData.content) 
            }}
          />
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-slate-700 dark:to-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-slate-400 text-2xl">📖</span>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No content available</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">This chapter content could not be loaded.</p>
            <p className="text-sm text-slate-400">Try switching to a different Bible version like KJV, NIV, ESV, NASB, NKJV, or NLT.</p>
          </div>
        )}
      </div>
    </div>
  );
};
