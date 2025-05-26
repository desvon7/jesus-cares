
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

  return (
    <div className={`${isMobile ? 'px-4 py-6' : 'px-6 py-8'}`}>
      {chapterData?.content ? (
        <div 
          className={`
            prose prose-slate dark:prose-invert max-w-none 
            ${getFontFamilyClass()} 
            ${isMobile ? 'prose-base' : 'prose-lg'}
            prose-p:leading-relaxed prose-p:mb-4
            prose-h3:text-2xl prose-h3:font-semibold prose-h3:mb-6 prose-h3:text-slate-900 dark:prose-h3:text-slate-100
            prose-sup:text-blue-600 dark:prose-sup:text-blue-400 prose-sup:font-medium prose-sup:text-sm
          `}
          style={getContentStyle()}
          dangerouslySetInnerHTML={{ 
            __html: processContent(chapterData.content) 
          }}
        />
      ) : (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-slate-400 text-xl">📖</span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No content available for this chapter.</p>
          <p className="text-sm text-slate-400 mt-2">Try switching to a different Bible version.</p>
        </div>
      )}
    </div>
  );
};
