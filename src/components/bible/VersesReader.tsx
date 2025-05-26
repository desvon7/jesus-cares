
import React from 'react';
import { Copy, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
      content = content.replace(/<h3[^>]*>Chapter \d+<\/h3>/g, '');
    }
    
    return content;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600 dark:text-slate-400">Loading chapter...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        {!isMobile && <Button onClick={onBack}>Go Back</Button>}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className={`text-center ${isMobile ? 'pb-4' : 'pb-6'}`}>
          <CardTitle className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold mb-4`}>
            {book.name} {chapter.number}
          </CardTitle>
          {!isMobile && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyChapter}
                className="flex items-center space-x-1"
              >
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShareChapter}
                className="flex items-center space-x-1"
              >
                <Share className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className={isMobile ? 'px-2' : ''}>
          {chapterData?.content ? (
            <div 
              className={`prose prose-slate dark:prose-invert max-w-none leading-relaxed ${getFontFamilyClass()} ${isMobile ? 'prose-sm' : ''}`}
              style={getContentStyle()}
              dangerouslySetInnerHTML={{ 
                __html: processContent(chapterData.content) 
              }}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500 dark:text-slate-400">No content available for this chapter.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VersesReader;
