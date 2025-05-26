
import React from 'react';
import { Copy, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Book, Chapter } from '../../services/comprehensiveBibleService';
import { useChapterText } from '../../hooks/useComprehensiveBibleData';

interface ReadingSettings {
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif' | 'dyslexic';
  theme: 'light' | 'dark' | 'sepia';
  lineSpacing: number;
  showVerseNumbers: boolean;
  showChapterNumbers: boolean;
  paragraphMode: boolean;
}

interface VersesReaderProps {
  book: Book;
  chapter: Chapter;
  onBack: () => void;
  readingSettings: ReadingSettings;
  onPreviousChapter?: () => void;
  onNextChapter?: () => void;
  canGoPrevious?: boolean;
  canGoNext?: boolean;
}

const VersesReader: React.FC<VersesReaderProps> = ({ 
  book, 
  chapter, 
  onBack,
  readingSettings
}) => {
  const isMobile = useIsMobile();
  const { chapterData, loading, error } = useChapterText(book.bibleId, chapter.id);
  const { toast } = useToast();

  const handleCopyChapter = () => {
    if (chapterData?.content) {
      const text = chapterData.content.replace(/<[^>]*>/g, '');
      navigator.clipboard.writeText(`${chapterData.reference}\n\n${text}`);
      toast({
        title: "Chapter copied",
        description: "The chapter text has been copied to your clipboard.",
      });
    }
  };

  const handleShareChapter = () => {
    if (chapterData?.content) {
      const text = chapterData.content.replace(/<[^>]*>/g, '');
      const shareText = `${chapterData.reference}\n\n${text}`;
      
      if (navigator.share) {
        navigator.share({ text: shareText });
      } else {
        navigator.clipboard.writeText(shareText);
        toast({
          title: "Chapter copied",
          description: "The chapter text has been copied to your clipboard.",
        });
      }
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading Scripture...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-600 dark:text-red-400 text-xl">!</span>
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Try selecting a different version like KJV, NIV, or ESV</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Clean header with chapter info and actions */}
      <div className={`sticky top-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 z-10 ${isMobile ? 'px-4 py-3' : 'px-6 py-4'}`}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`font-semibold text-slate-900 dark:text-slate-100 ${isMobile ? 'text-lg' : 'text-xl'}`}>
              {book.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Chapter {chapter.number}
            </p>
          </div>
          
          {!isMobile && (
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyChapter}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShareChapter}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                <Share className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Content area with clean typography */}
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
    </div>
  );
};

export default VersesReader;
