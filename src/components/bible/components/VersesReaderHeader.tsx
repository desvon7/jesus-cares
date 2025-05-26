
import React from 'react';
import { Copy, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { Book, Chapter } from '../../../services/comprehensiveBibleService';

interface VersesReaderHeaderProps {
  book: Book;
  chapter: Chapter;
  chapterData: any;
}

export const VersesReaderHeader: React.FC<VersesReaderHeaderProps> = ({ 
  book, 
  chapter, 
  chapterData 
}) => {
  const isMobile = useIsMobile();
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

  return (
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
  );
};
