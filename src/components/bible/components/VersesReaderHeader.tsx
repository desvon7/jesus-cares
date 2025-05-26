
import React from 'react';
import { ArrowLeft, Languages, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { Book, Chapter, BibleVersion } from '../../../services/comprehensiveBibleService';

interface VersesReaderHeaderProps {
  book: Book;
  chapter: Chapter;
  chapterData: any;
  onBack: () => void;
  selectedVersion: BibleVersion;
  availableVersions: BibleVersion[];
  onVersionChange: (version: BibleVersion) => void;
  onBookSelect: () => void;
  onChapterSelect: () => void;
}

export const VersesReaderHeader: React.FC<VersesReaderHeaderProps> = ({ 
  book, 
  chapter, 
  chapterData,
  onBack,
  selectedVersion,
  availableVersions,
  onVersionChange,
  onBookSelect,
  onChapterSelect
}) => {
  const isMobile = useIsMobile();

  // Get unique languages from available versions
  const availableLanguages = Array.from(
    new Map(
      availableVersions.map(v => [v.language.id, v.language])
    ).values()
  );

  const handleLanguageChange = (languageId: string) => {
    const languageVersions = availableVersions.filter(v => v.language.id === languageId);
    if (languageVersions.length > 0) {
      onVersionChange(languageVersions[0]);
    }
  };

  return (
    <div className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-4xl mx-auto px-4 py-3">
        {/* Top navigation bar */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full px-3 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Back</span>
          </Button>

          <div className="flex items-center space-x-2">
            {/* Language selector */}
            {availableLanguages.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full px-3 py-2"
                  >
                    <Languages className="h-4 w-4" />
                    {!isMobile && <span className="text-sm">{selectedVersion.language.nameLocal}</span>}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  {availableLanguages.map((language) => (
                    <DropdownMenuItem 
                      key={language.id}
                      onClick={() => handleLanguageChange(language.id)}
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      {language.nameLocal}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Version selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full px-3 py-2 font-medium"
                >
                  {selectedVersion.abbreviation}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-64 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {availableVersions
                  .filter(v => v.language.id === selectedVersion.language.id)
                  .map((version) => (
                    <DropdownMenuItem 
                      key={version.id}
                      onClick={() => onVersionChange(version)}
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{version.abbreviation}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{version.name}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Breadcrumb navigation */}
        <div className="flex items-center space-x-2 text-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBookSelect}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium px-2 py-1 h-auto rounded-md"
          >
            {book.name}
          </Button>
          <span className="text-slate-400">›</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onChapterSelect}
            className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium px-2 py-1 h-auto rounded-md"
          >
            Chapter {chapter.number}
          </Button>
        </div>
      </div>
    </div>
  );
};
